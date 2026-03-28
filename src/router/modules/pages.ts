export default [
    {
        path:'/login',
        component: () => import('@/views/login/index.vue')
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
        path:'/notice',
        component: () => import('@/views/home/notice/list.vue')
    },
    {
        path:'/notice/:id',
        component: () => import('@/views/home/notice/detail.vue')
    },
]