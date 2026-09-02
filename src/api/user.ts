import { apiGet, apiPost } from "@/utils/request";

export interface GoogleBindResponse {
    secret: string
}

export interface GoogleConfirmBindParams {
    email_code: string
    code: string
}

export const apiUserInfo = async () => await apiGet('/api/users/my')

export const apiUpdateUserInfo = async (params:any) => await apiPost('/api/users/my', params)

export const apiGoogleBind = async ():Promise<GoogleBindResponse> => {
    return await apiPost('/api/auth/google/bind') as unknown as GoogleBindResponse
}

export const apiGoogleConfirmBind = async (params:GoogleConfirmBindParams) => await apiPost('/api/auth/google/confirm_bind', params)

export const apiVersion = async (params:any) => await apiGet('/api/version', params)

export const apiCardholder = async (params:any) => await apiGet('/api/cardholder', params)

export const apiCardholderAdd = async (params:any) => await apiPost('/api/cardholder', params)

export const apiCardholderInfo = async (params:any) => await apiGet(`/api/cardholder/${params}`)

export const apiCardholderUpdate = async (params:any) => await apiPost('/api/cardholder/update', params)

export const apiRecharge = async () => await apiGet('/api/users/my/recharge_address')

export const apiWithdrawConfig = async () => await apiGet('/api/withdraws/config')

export const apiTransferConfig = async () => await apiGet('/api/transfer/config')

export const apiWithdraw = async (params:any) => await apiPost('/api/withdraws', params)

export const apiTransfer = async (params:any) => await apiPost('/api/transfer', params)

export const apiHelpDetail = async (params:any) => await apiGet(`/api/help_center/${params}`)

export const apiLeves = async () => await apiGet('/api/config/finance_levels')

export const apiChat = async () => await apiGet('/api/chat/customer_service')
