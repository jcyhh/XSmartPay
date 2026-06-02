import { apiGet, apiPost } from "@/utils/request";

export const apiOtcAssets = async () => await apiGet('/api/otc/assets')

export const apiOtcPayments = async () => await apiGet('/api/otc/payments')

export const apiOtcPaymentDetail = async (params:any) => await apiGet('/api/otc/payments/detail', params)

export const apiSaveOtcPayment = async (params:any) => await apiPost('/api/otc/payments', params)

export const apiOtcList = async (params:any) => await apiGet('/api/otc', params)

export const apiCreateOtcOrder = async (params:any) => await apiPost('/api/otc', params)

export const apiOtcDeal = async (params:any) => await apiPost('/api/otc/sell', params)

export const apiMyOtcOrders = async (params:any) => await apiGet('/api/otc/my', params)

export const apiOtcOrderDetail = async (params:any) => await apiGet(`/api/otc/orders/${params}`)

export const apiCancelOtcOrder = async (params:any) => await apiPost(`/api/otc/orders/${params}/cancel`)

export const apiOtcTrades = async (params:any) => await apiGet('/api/otc/trades', params)

export const apiOtcTradeDetail = async (params:any) => await apiGet(`/api/otc/trades/${params}`)

export const apiCancelOtcTrade = async (params:any) => await apiPost(`/api/otc/trades/${params}/cancel`)

export const apiPayOtcTrade = async (params:any) => await apiPost('/api/otc/trades/pay', params)

export const apiConfirmOtcTrade = async (params:any) => await apiPost(`/api/otc/trades/${params}/confirm`)

export const apiAppealOtcTrade = async (params:any) => await apiPost('/api/otc/trades/appeal', params)
