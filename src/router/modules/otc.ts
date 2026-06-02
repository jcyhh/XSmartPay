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
        path:'/otc/details/:id',
        component: () => import('@/views/otc/details.vue')
    },
    {
        path:'/otc/detail/:id',
        component: () => import('@/views/otc/detail.vue')
    },
    {
        path:'/otc/appeal',
        component: () => import('@/views/otc/appeal.vue')
    },
    {
        path:'/otc/chat/:id',
        component: () => import('@/views/otc/chat.vue')
    }
]