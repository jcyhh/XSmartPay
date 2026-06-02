import { apiGet, apiPost } from "@/utils/request";

export const apiYuebaoStats = async () => await apiGet('/api/yuebao/statistics')

export const apiYuebaoConfig = async () => await apiGet('/api/yuebao/config')

export const apiTakeOut = (params:any) => apiPost('/api/yuebao/withdraw', params)

export const apiYuebaoPlan = async () => await apiGet('/api/yuebao/packages')

export const apiSave = (params:any) => apiPost('/api/yuebao/orders', params)