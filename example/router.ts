import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import('./views/home.vue')
const Dashboard = () => import('./views/dashboard.vue')

const PassportLogin = () => import('./views/passport/login.vue')

const menuRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        meta: { title: '首页' },
        component: Home,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'dashboard',
            meta: { title: '控制中心' },
            component: Dashboard
        }]
    }
]

const passportRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'single-login',
        meta: { title: '登录' },
        component: PassportLogin
    }
]

const routes: Array<RouteRecordRaw> = [
    ...menuRoutes,
    ...passportRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router