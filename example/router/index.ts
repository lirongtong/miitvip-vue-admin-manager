import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Dashboard = () => import('@views/dashboard.vue')
const Start = () => import('@views/start.vue')
const Theme = () => import('@views/theme.vue')
const Login = () => import('@views/login.vue')
const Register = () => import('@views/register.vue')
const Home = () => import('@views/home.vue')
const Tools = () => import('../views/tools/index.vue')
const ToolsGlobal = () => import('../views/tools/global.vue')
const ToolsRequest = () => import('../views/tools/request.vue')
const ToolsCaches = () => import('../views/tools/caches.vue')
const ToolsFunctions = () => import('../views/tools/functions.vue')
const Pages = () => import('@views/pages/index.vue')
const PagesLogin = () => import('@views/pages/login.vue')
const PagesRegister = () => import('@views/pages/register.vue')
const PagesForget = () => import('@views/pages/forget.vue')

const menuRoutes: Array<RouteRecordRaw> = [{
    path: '/',
    meta: {title: '首页'},
    component: Home,
    redirect: '/dashboard',
    children: [{
        path: 'dashboard',
        name: 'dashboard',
        meta: {title: '控制中心'},
        component: Dashboard
    }, {
        path: '/start',
        name: 'start',
        meta: {title: '快速开始'},
        component: Start
    }, {
        path: '/theme',
        name: 'theme',
        meta: {title: '主题定制'},
        component: Theme
    }, {
        path: '/tools',
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
        }, {
            path: '/tools/caches',
            name: 'tools-caches',
            meta: {title: '本地缓存'},
            component: ToolsCaches
        }, {
            path: '/tools/functions',
            name: 'tools-functions',
            meta: {title: '工具函数'},
            component: ToolsFunctions
        }]
    }, {
        path: '/pages',
        name: 'pages',
        meta: {title: '基础页面'},
        component: Pages,
        redirect: '/pages/login',
        children: [{
            path: '/pages/login',
            name: 'pages-login',
            meta: {title: '登录页面'},
            component: PagesLogin
        }, {
            path: '/pages/register',
            name: 'pages-register',
            meta: {title: '注册页面'},
            component: PagesRegister
        }, {
            path: '/pages/forget',
            name: 'pages-forget',
            meta: {title: '忘记密码'},
            component: PagesForget
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