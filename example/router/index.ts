import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Login = () => import('@views/login.vue')
const Register = () => import('@views/register.vue')
const Home = () => import('@views/home.vue')
const Dashboard = () => import('@views/dashboard.vue')
const Tools = () => import('../views/tools/index.vue')
const ToolsGlobal = () => import('../views/tools/global.vue')
const ToolsRequest = () => import('../views/tools/request.vue')

const menuRoutes: Array<RouteRecordRaw> = [{
    path: '/',
    meta: {title: '首页'},
    component: Home,
    redirect: 'dashboard',
    children: [{
        path: 'dashboard',
        name: 'dashboard',
        meta: {title: '控制中心'},
        component: Dashboard
    }, {
        path: 'tools',
        name: 'tools',
        meta: {title: '系统工具'},
        component: Tools,
        redirect: '/tools/global',
        children: [{
            path: '/tools/global',
            name: 'tools-global',
            meta: {title: '全局变量'},
            component: ToolsGlobal
        }, {
            path: '/tools/request',
            name: 'tools-request',
            meta: {title: '请求响应'},
            component: ToolsRequest
        }]
    }]
}]

const passportRoutes: Array<RouteRecordRaw> = [{
    path: '/login',
    name: 'single-login',
    meta: {title: '登录'},
    component: Login
}, {
    path: '/register',
    name: 'single-register',
    meta: {title: '注册'},
    component: Register
}]

const routes: Array<RouteRecordRaw> = [
    ...menuRoutes,
    ...passportRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router