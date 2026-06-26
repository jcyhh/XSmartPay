export const appName = 'X SmartPay'; // 项目名

export const publicPath = '/h5/'; // 部署目录

export const assetUSDT: string = 'USDT'; // 资产名称

export const assetUSD: string = 'USD'; // 资产名称

export const assetAIX: string = 'AIX'; // 资产名称

export const assetNFTC: string = 'NFTC'; // 资产名称

export const assetBot: string = 'BOT'; // 资产名称

const assetMap:Record<string, string> = {
    balance_usdt: assetUSDT,
    balance_aix: assetAIX,
    balance_nftc: assetNFTC
}

export const getAssetByCode = (assetCode:string) => assetMap[assetCode] || assetCode