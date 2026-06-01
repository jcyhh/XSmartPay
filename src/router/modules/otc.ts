export default [
    {
        path:'/otc',
        component: () => import('@/views/otc/index.vue')
    },
    {
        path:'/otc/release',
        component: () => import('@/views/otc/release.vue')
    },
    {
        path:'/otc/order',
        component: () => import('@/views/otc/order.vue')
    },
    {
        path:'/otc/detail/buy',
        component: () => import('@/views/otc/detailBuy.vue')
    },
    {
        path:'/otc/detail/sale',
        component: () => import('@/views/otc/detailSale.vue')
    },
    {
        path:'/otc/appeal',
        component: () => import('@/views/otc/appeal.vue')
    }
]