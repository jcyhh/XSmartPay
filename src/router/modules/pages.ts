export default [
    {
        path:'/download',
        component: () => import('@/views/download.vue')
    },
    {
        path:'/login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path:'/register',
        component: () => import('@/views/login/register.vue')
    },
    {
        path:'/forget',
        component: () => import('@/views/login/forget.vue')
    },
    {
        path:'/edit',
        component: () => import('@/views/login/edit.vue')
    },
    {
        path:'/bindEmail',
        component: () => import('@/views/login/bindEmail.vue')
    },
    {
        path:'/bindAddress',
        component: () => import('@/views/login/bindAddress.vue')
    },
    {
        path:'/editPay',
        component: () => import('@/views/login/editPay.vue')
    },
    {
        path:'/account',
        component: () => import('@/views/login/account.vue')
    },
    {
        path:'/notice',
        component: () => import('@/views/home/notice/list.vue')
    },
    {
        path:'/notice/:id',
        component: () => import('@/views/home/notice/detail.vue')
    },
    {
        path:'/helps',
        component: () => import('@/views/home/helps/list.vue')
    },
    {
        path:'/helps/:id',
        component: () => import('@/views/home/helps/detail.vue')
    },
    {
        path:'/yuebao/record',
        component: () => import('@/views/home/record.vue')
    },
    {
        path:'/virtual',
        component: () => import('@/views/pay/card/virtual.vue')
    },
    {
        path:'/physical',
        component: () => import('@/views/pay/card/physical.vue')
    },
    {
        path:'/physical/apply',
        component: () => import('@/views/pay/card/apply.vue')
    },
    {
        path:'/physical/bind',
        component: () => import('@/views/pay/card/bind.vue')
    },
    {
        path:'/physical/record',
        component: () => import('@/views/pay/card/record.vue')
    },
    {
        path:'/cardbag',
        component: () => import('@/views/user/cardbag.vue')
    },
    {
        path:'/team',
        component: () => import('@/views/user/team.vue')
    },
    {
        path:'/yueBao',
        component: () => import('@/views/home/yueBao.vue')
    },
    {
        path:'/community',
        component: () => import('@/views/user/community/index.vue')
    },
    {
        path:'/community/my',
        component: () => import('@/views/user/community/my.vue')
    },
    {
        path:'/community/apply',
        component: () => import('@/views/user/community/apply.vue')
    },
    {
        path:'/community/rank',
        component: () => import('@/views/user/community/rank.vue')
    },
    {
        path:'/news/:id',
        component: () => import('@/views/user/news/detail.vue')
    },
    {
        path:'/news/create',
        component: () => import('@/views/user/news/create.vue')
    },
    {
        path:'/news/my',
        component: () => import('@/views/user/news/my.vue')
    },
    {
        path:'/cardholder',
        component: () => import('@/views/user/cardholder/list.vue')
    },
    {
        path:'/cardholder/:id',
        component: () => import('@/views/user/cardholder/edit.vue')
    },
    {
        path:'/setting',
        component: () => import('@/views/user/setting.vue')
    },
    {
        path:'/draw/record',
        component: () => import('@/views/draw/record.vue')
    },
    {
        path:'/draw/rule',
        component: () => import('@/views/draw/rule.vue')
    },
    {
        path:'/user/recharge',
        component: () => import('@/views/user/recharge.vue')
    },
    {
        path:'/user/withdraw',
        component: () => import('@/views/user/withdraw.vue')
    },
    {
        path:'/user/withdraw/record',
        component: () => import('@/views/user/withdrawRecord.vue')
    },
    {
        path:'/user/transfer',
        component: () => import('@/views/user/transfer.vue')
    },
    {
        path:'/user/order',
        component: () => import('@/views/user/order.vue')
    },
    {
        path:'/user/aixOrder',
        component: () => import('@/views/user/aixOrder.vue')
    },
    {
        path:'/user/asset',
        component: () => import('@/views/user/asset.vue')
    },
    {
        path:'/pay/record',
        component: () => import('@/views/pay/record.vue')
    },
    {
        path:'/pay/record/:id',
        component: () => import('@/views/pay/detail.vue')
    },
    {
        path:'/pay/remittance',
        component: () => import('@/views/pay/pay.vue')
    },
    {
        path:'/setcard/:id',
        component: () => import('@/views/pay/card/setcard.vue')
    },
]