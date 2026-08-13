import { apiGet, apiPost } from '@/utils/request'

export const apiNftCards = async () => await apiGet('/api/node/cards')
export const apiBuyNft = async (params: { node_id: number }) => await apiPost('/api/node/buy', params)
export const apiNftOrders = async (params: { page_no: number; page_size: number; is_bind?: number }) => await apiGet('/api/node', params)
export const apiNftShops = async (params: { page_no: number; page_size: number }) => await apiGet('/api/shop', params)
export const apiNftBindings = async (params: { page_no: number; page_size: number }) => await apiGet('/api/shop/bindings', params)
export const apiBindNftShop = async (params: { shop_id: number; node_order_id: number }) => await apiPost('/api/shop/bind', params)
