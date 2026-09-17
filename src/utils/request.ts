import axios from 'axios'
import { delToken, getToken } from '../config/storage'
import { langKey, uploadApi, uploadFileName, timeOut, uploadTimeOut, addressKey } from '../config/http'
import { getHeaderLang } from '../locale'
import { closeToast, showLoadingToast } from 'vant';
import { router, routerPush } from '@/router'
import { getAddress, loginPath } from '@/dapp/config'
import { message } from './message';
import { useAppStore } from '@/store';

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: timeOut
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        if (config.data instanceof FormData) config.timeout = uploadTimeOut
        else config.headers['Content-Type'] = "application/json; charset=UTF-8"

        config.headers['Authorization'] = `Bearer ${getToken()}`
        if (addressKey) config.headers[addressKey] = getAddress()
        if (langKey) config.headers[langKey] = getHeaderLang()
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
    response => response.data,
    error => {
        const code = error.response?.status || error.status
        const responseData = error.response?.data
        const errorMessage = typeof responseData === 'string' ? responseData : responseData?.message
        if (code == 401) {
            // 登录失效
            logout()
            return Promise.reject(new Error(errorMessage || 'Error'))
        } else {
            if(errorMessage === '请先绑定Google验证器' && !error.config?.url?.startsWith('/api/cross_transfers') && router.currentRoute.value.path !== '/googleAuthenticator'){
                routerPush('/googleAuthenticator')
            }
            if(responseData) message(errorMessage || responseData)
            return Promise.reject(new Error(errorMessage || 'Error'))
        }
    }
)

export const apiGet = (url: string, params: any = '') => service({ url, method: 'get', params })
export const apiPost = (url: string, data: any = {}) => service({ url, method: 'post', data })
export const apiDel = (url: string, data: any = {}) => service({ url, method: 'delete', data })
export const apiPut = (url: string, data: any = {}) => service({ url, method: 'put', data })

// 上传单张图片
export const apiUpload = () => {
    return new Promise((resolve, reject) => {
        const appStore = useAppStore()
        if (appStore.isH5) {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'

            input.onchange = async (e: Event) => {
                const file = (e.target as HTMLInputElement)?.files?.[0]
                if (!file) {
                    input.remove()
                    reject(new Error('未选择文件'))
                    return
                }

                const formData = new FormData()
                formData.set(uploadFileName, file, file.name)

                try {
                    showLoadingToast({
                        overlay: true,
                        forbidClick: true,
                        duration: 0,
                        zIndex: 10000000000
                    });
                    const response = await service({
                        url: uploadApi,
                        method: 'post',
                        data: formData,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    closeToast()
                    input.remove()
                    resolve(response)
                } catch (error) {
                    input.remove()
                    closeToast()
                    reject(error)
                }
            }

            input.click()
        }else{
            const flutterWindow = window as Window & {
                Flutter?: { postMessage?: (message: string) => void }
                receiveMessageFromFlutter?: (message: string) => void
            }
            const { Flutter } = flutterWindow

            if(Flutter && Flutter.postMessage){
                showLoadingToast({
                    overlay: true,
                    forbidClick: true,
                    duration: 0,
                    zIndex: 10000000000
                });

                const prevHandler = flutterWindow.receiveMessageFromFlutter
                let finished = false

                const cleanup = () => {
                    closeToast()
                    if (flutterWindow.receiveMessageFromFlutter === onFlutterMessage) {
                        flutterWindow.receiveMessageFromFlutter = prevHandler
                    }
                }

                const onFlutterMessage = (message: string) => {
                    prevHandler?.(message)
                    if (finished || typeof message !== 'string' || !message.startsWith('uploadImageUrl:')) return

                    const uploadImageUrl = message.replace('uploadImageUrl:', '').trim()
                    if (!uploadImageUrl) return

                    finished = true
                    cleanup()
                    resolve({ url: uploadImageUrl })
                }

                flutterWindow.receiveMessageFromFlutter = onFlutterMessage

                Flutter.postMessage(JSON.stringify({
                    type: 'uploadImage',
                    token: getToken()
                }))
            }else{
                message('上传不可用！', 'fail')
                reject(new Error('上传不可用！'))
            }
        }
    })
}

// 登录失效
export function logout() {
    delToken()
    const currentRoute = router.currentRoute.value
    if (currentRoute.path !== loginPath) routerPush(loginPath)
}
