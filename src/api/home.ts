import { apiGet, apiPost } from "@/utils/request";

export const apiStats = async () => await apiGet('/api/config/statistics')

export const apiBanner = async () => await apiGet('/api/banners')

export const apiConfig = async () => await apiGet('/api/config')

export const apiProduct = async () => await apiGet('/api/products')

export const apiMessage = async (params:any) => await apiGet(`/api/config/marquee/${params}`)

export const apiNodes = async () => await apiGet('/api/node-product/nodes')

export const apiBuyNode = async (params:any) => await apiPost('/api/node-product/orders', params)

export const apiNodeStat = async () => await apiGet('/api/node-product/statistics')

export const apiNodeUnStake = async (params:any) => await apiPost('/api/node-product/redeem', params)