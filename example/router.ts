import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import('./views/home.vue')
const Dashboard = () => import('./views/dashboard.vue')
const Start = () => import('./views/start.vue')
const Theming = () => import('./views/theming.vue')

const Tools = () => import('./views/tools/index.vue')
const ToolsGlobal = () => import('./views/tools/global.vue')
const ToolsRequest = () => import('./views/tools/request.vue')
const ToolsCache = () => import('./views/tools/cache.vue')
const ToolsFunction = () => import('./views/tools/function.vue')

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
        }, {
            path: 'start',
            name: 'start',
            meta: { title: '快速上手' },
            component: Start
        }, {
            path: 'theming',
            name: 'theming',
            meta: { title: '主题定制' },
            component: Theming
        }, {
            path: '/tools',
            name: 'tools',
            meta: { title: '系统工具' },
            component: Tools,
            redirect: '/tools/global',
            children: [{
                path: '/tools/global',
                name: 'tools-global',
                meta: { title: '全局变量' },
                component: ToolsGlobal
            }, {
                path: '/tools/request',
                name: 'tools-request',
                meta: { title: '请求响应' },
                component: ToolsRequest
            }, {
                path: '/tools/cache',
                name: 'tools-cache',
                meta: { title: '本地缓存' },
                component: ToolsCache
            }, {
                path: '/tools/function',
                name: 'tools-function',
                meta: { title: '工具函数' },
                component: ToolsFunction
            }]
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