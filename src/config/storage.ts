import { useUserStore } from "@/store"

const addressKey: string = 'WELLET_ADDRESS' // 存储钱包地址的KEY

const refKey: string = 'REF' // 存储邀请码的KEY

const tokenKey: string = 'TOKEN' // 存储TOKEN的KEY

const langKey: string = 'LANG' // 存储多语言的KEY

const accountKey: string = 'ACCOUNT' // 存储登入账户的KEY

const accountListKey: string = 'ACCOUNT_LIST' // 存储已缓存账号列表的KEY

const reportKey: string = 'REPORT' // 测试

export interface LoginAccountItem {
    email: string
    token: string
}

interface ReportItem {
    timeId: string
    message: string
}

// 存储多语言
export const setLang = (data: string): void => localStorage.setItem(langKey, data)
export const getLang = (): string => localStorage.getItem(langKey) || (import.meta.env.PROD ? 'en' : 'zh')
export const delLang = (): void => localStorage.removeItem(langKey)

// 存储钱包地址
export const setAddress = (data: string): void => localStorage.setItem(addressKey, data)
export const getAddress = (): string => localStorage.getItem(addressKey)||''
export const delAddress = (): void => localStorage.removeItem(addressKey)

// 存储邀请码
export const setRef = (data: string): void => localStorage.setItem(refKey, data)
export const getRef = (): string => localStorage.getItem(refKey)||''
export const delRef = (): void => localStorage.removeItem(refKey)

// 存储Token
export const setToken = (data: string): void => {
    localStorage.setItem(tokenKey, data)
    const userStore = useUserStore()
    userStore.token = true
}
export const getToken = (): string => localStorage.getItem(tokenKey)||''
export const delToken = (): void => {
    localStorage.removeItem(tokenKey)
    const userStore = useUserStore()
    userStore.token = false
}

// 存储登入账户
export const setAccount = (data: string): void => localStorage.setItem(accountKey, data)
export const getAccount = (): string => localStorage.getItem(accountKey)||''
export const delAccount = (): void => localStorage.removeItem(accountKey)

// 存储已缓存账号列表
export const setAccountList = (data: LoginAccountItem[]): void => localStorage.setItem(accountListKey, JSON.stringify(data || []))
export const getAccountList = (): LoginAccountItem[] => {
    try {
        const data = JSON.parse(localStorage.getItem(accountListKey) || '[]')
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}
export const delAccountList = (): void => localStorage.removeItem(accountListKey)
export const upsertAccountItem = (data: LoginAccountItem): void => {
    const list = getAccountList()
    const index = list.findIndex(item => item.email === data.email)

    if (index > -1) {
        list[index] = data
    } else {
        list.unshift(data)
    }

    setAccountList(list)
}
export const removeAccountItem = (email: string): void => {
    const list = getAccountList().filter(item => item.email !== email)
    setAccountList(list)
}

export const setReport = (data: string): void => localStorage.setItem(reportKey, data)
export const getReport = (): string => localStorage.getItem(reportKey)||'[]'
export const delReport = (): void => localStorage.removeItem(reportKey)
export const upsertReport = (timeId: string, message: string): void => {
    let list: ReportItem[] = []

    try {
        const cache = JSON.parse(getReport())
        list = Array.isArray(cache) ? cache : []
    } catch {
        list = []
    }

    const index = list.findIndex(item => item.timeId === timeId)

    if (index > -1) {
        list[index].message = message
    } else {
        list.unshift({ timeId, message })
    }

    setReport(JSON.stringify(list))
}

// 保存
export function saveRef(){

}