import { parseEther, parseGwei } from 'viem'

export const loginPath = '/' // 登录页面

export const homePath = '/home' // 首页

export const approveAmount: string = '115792089237316195423570985008687907853269984665640564039457584007913129639935' // 授权额度

export const gasLimitMultiplier = 130n // gas limit 倍数 (130n = 1.3倍)

export const defaultGasPrice = parseGwei('0.05') // GWEI

export const minGasBalance = parseEther('0.0004') // 交易前最低 ETH 余额

export type SignMessage = 'Login' | 'Transfer' | 'Withdraw' | 'Order' | 'Node' | 'Pledge' | 'Claim' | 'Saving' | 'TokenOrder' | 'ClaimQuota'; // 签名前缀

const addressKey: string = 'WELLET_ADDRESS' // 存储钱包地址的KEY

const refKey: string = 'REF' // 存储邀请码的KEY

const tokenKey: string = 'TOKEN' // 存储TOKEN的KEY

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