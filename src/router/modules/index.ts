/**
 * keepAlive: true —— 跳转别的页面后，本页面不销毁
 */
import Start from '@/views/index.vue'
import Layout from '@/layout/index.vue'
import pages from './pages'

export default [
    {
        path:'/', // 启动
        component: Start
    },
    {
        path:'/home',
        component: Layout,
        redirect: '/home/index',
        children:[{
            path:'index',
            component: () => import('@/views/home/index.vue')
        }]
    },
    {
        path:'/pay',
        component: Layout,
        redirect: '/pay/index',
        children:[{
            path:'index',
            component: () => import('@/views/pay/index.vue')
        }]
    },
    {
        path:'/draw',
        component: Layout,
        redirect: '/draw/index',
        children:[{
            path:'index',
            component: () => import('@/views/draw/index.vue')
        }]
    },
    {
        path:'/user',
        component: Layout,
        redirect: '/user/index',
        children:[{
            path:'index',
            component: () => import('@/views/user/index.vue')
        }]
    },
    ...pages,
    {
        path:'/ref/:ref([a-zA-Z0-9]+)', // 接收邀请码，需配置在常规路由的下方
        component: Start
    }
]