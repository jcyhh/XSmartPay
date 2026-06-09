import { apiGet, apiPost } from "@/utils/request";

export const apiOpenVirtualCard = (params:any) => apiPost('/api/card/virtual/create', params)

export const apiUpgradeVirtualCard = (params:any) => apiPost('/api/card/difference-level', params)

export const apiGetCardList = (params:any) => apiGet('/api/card/list', params)

export const apiRefreshCard = (params:any) => apiPost('/api/card/refresh', params)

export const apiRecharge = (params:any) => apiPost('/api/card/recharge', params)

export const apiTransfer = (params:any) => apiPost('/api/card/transfer', params)

export const apiDrawList = () => apiGet('/api/products/rush')

export const apiDrawConfig = () => apiGet('/api/products/config')

export const apiDraw = () => apiPost('/api/order/rush')

export const apiCard = (params:any) => apiPost('/api/order', params)

export const apiCardActive = (params:any) => apiPost('/api/card/active', params)

export const apiDrawStats = () => apiGet('/api/order/rebate_stats')

export const apiCardBind = (params:any) => apiPost('/api/card/physical/bind', params)

export const apiCardApply = (params:any) => apiPost('/api/card/physical/apply', params)

export const apiCardPsw = (params:any) => apiPost('/api/card/set-pin', params)

export const apiCardInfo = async (params:any) => await apiGet('/api/card/sensitive', params)

export const apiCardInfoUpdate = (params:any) => apiPost('/api/card/update-sensitive', params)

export const apiCardConfig = async () => await apiGet('/api/card/config')