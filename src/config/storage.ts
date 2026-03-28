const addressKey: string = 'WELLET_ADDRESS' // 存储钱包地址的KEY

const refKey: string = 'REF' // 存储邀请码的KEY

const tokenKey: string = 'TOKEN' // 存储TOKEN的KEY

const langKey: string = 'LANG' // 存储多语言的KEY

const accountKey: string = 'ACCOUNT' // 存储登入账户的KEY

const reportKey: string = 'REPORT' // 测试

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
export const setToken = (data: string): void => localStorage.setItem(tokenKey, data)
export const getToken = (): string => localStorage.getItem(tokenKey)||''
export const delToken = (): void => localStorage.removeItem(tokenKey)

// 存储登入账户
export const setAccount = (data: string): void => localStorage.setItem(accountKey, data)
export const getAccount = (): string => localStorage.getItem(accountKey)||''
export const delAccount = (): void => localStorage.removeItem(accountKey)

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