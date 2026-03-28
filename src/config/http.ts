export const langKey: string = 'Lang' // 请求头多语言的key, 配置为空代表不传

export const addressKey: string = 'Address' // 请求头钱包地址的key, 配置为空代表不传

export const uploadApi: string = '/api/uploads' // 上传接口

export const uploadFileName: string = 'upload' // 上传接口文件参数名

export const uploadTimeOut: number = 60000 // 上传请求超时时间，毫秒

export const timeOut: number = 10000 // 请求超时时间，毫秒

export type Api =
| '/api/index'   // 配置
| '/api/auth/login'
| '/api/config'
| '/api/users/my'
| '/api/users/my/referrals'
| '/api/index/reward_burned'
| '/api/index/check_daily_order'
| '/api/index/queue_list'
| '/api/users/my/balance_logs'
| '/api/withdraw'
| '/api/quota_claim'
| '/api/index/claimed_reward_list'
| '/api/index/queue_list_old'
| '/api/index/queue_list_old2'