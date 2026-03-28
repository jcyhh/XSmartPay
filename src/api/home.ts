import { apiGet } from "@/utils/request";

export const apiStats = async () => await apiGet('/api/config/statistics')

export const apiBanner = async () => await apiGet('/api/banners')

export const apiProduct = async () => await apiGet('/api/products')

export const apiMessage = async (params:any) => await apiGet(`/api/config/marquee/${params}`)