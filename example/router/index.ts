import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Dashboard = () => import('@views/dashboard.vue')
const Start = () => import('@views/start.vue')
const Theme = () => import('@views/theme.vue')
const PassportLogin = () => import('@views/passport/login.vue')
const PassportRegister = () => import('@views/passport/register.vue')
const PassportForget = () => import('@views/passport/forget.vue')
const PassportUpdate = () => import('@views/passport/update.vue')
const SocialiteLogin = () => import('@views/socialite/login.vue')
const Home = () => import('@views/home.vue')
const Tools = () => import('../views/tools/index.vue')
const ToolsGlobal = () => import('../views/tools/global.vue')
const ToolsRequest = () => import('../views/tools/request.vue')
const ToolsCaches = () => import('../views/tools/caches.vue')
const ToolsFunctions = () => import('../views/tools/functions.vue')
const Pages = () => import('@views/pages/index.vue')
const PagesLogin = () => import('@views/pages/login.vue')
const PagesRegister = () => import('@views/pages/register.vue')
const PagesForget = () => import('@/views/pages/forget.vue')
const Components = () => import('@views/components/index.vue')
const ComponentsLayout = () => import('@views/components/layout.vue')
const ComponentsMenu = () => import('@views/components/menu.vue')
const ComponentsDropdown = () => import('@views/components/dropdown.vue')
const ComponentsNotice = () => import('@views/components/notice.vue')
const ComponentsModal = () => import('@views/components/modal.vue')
const ComponentsCaptcha = () => import('@views/components/captcha.vue')
const ComponentsSearch = () => import('@views/components/search.vue')
const ComponentsPassword = () => import('@views/components/password.vue')
const ComponentsAnchor = () => import('@views/components/anchor.vue')
const ComponentsHistory = () => import('@views/components/history.vue')
const ComponentsCode = () => import('@views/components/code.vue')
const Advanced = () => import('@views/advanced/index.vue')

const menuRoutes: Array<RouteRecordRaw> = [{
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
        path: '/start',
        name: 'start',
        meta: { title: '快速开始' },
        component: Start
    }, {
        path: '/theme',
        name: 'theme',
        meta: { title: '主题定制' },
        component: Theme
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
            path: '/tools/caches',
            name: 'tools-caches',
            meta: { title: '本地缓存' },
            component: ToolsCaches
        }, {
            path: '/tools/functions',
            name: 'tools-functions',
            meta: { title: '工具函数' },
            component: ToolsFunctions
        }]
    }, {
        path: '/pages',
        name: 'pages',
        meta: { title: '基础页面' },
        component: Pages,
        redirect: '/pages/login',
        children: [{
            path: '/pages/login',
            name: 'pages-login',
            meta: { title: '登录页面' },
            component: PagesLogin
        }, {
            path: '/pages/register',
            name: 'pages-register',
            meta: { title: '注册页面' },
            component: PagesRegister
        }, {
            path: '/pages/forget',
            name: 'pages-forget',
            meta: { title: '忘记密码' },
            component: PagesForget
        }]
    }, {
        path: '/components',
        name: 'components',
        meta: { title: '定制组件' },
        component: Components,
        redirect: '/components/layout',
        children: [{
            path: '/components/layout',
            name: 'components-layout',
            meta: { title: '基础布局' },
            component: ComponentsLayout
        }, {
            path: '/components/menu',
            name: 'components-menu',
            meta: { title: '左侧菜单' },
            component: ComponentsMenu
        }, {
            path: '/components/notice',
            name: 'components-notice',
            meta: { title: '消息中心' },
            component: ComponentsNotice
        }, {
            path: '/components/modal',
            name: 'components-modal',
            meta: { title: '弹窗提示' },
            component: ComponentsModal
        }, {
            path: '/components/captcha',
            name: 'components-captcha',
            meta: { title: '滑块验证' },
            component: ComponentsCaptcha
        }, {
            path: '/components/search',
            name: 'components-search',
            meta: { title: '搜索联想' },
            component: ComponentsSearch
        }, {
            path: '/components/password',
            name: 'components-password',
            meta: { title: '密码设置' },
            component: ComponentsPassword
        }, {
            path: '/components/dropdown',
            name: 'components-dropdown',
            meta: { title: '下拉菜单' },
            component: ComponentsDropdown
        }, {
            path: '/components/anchor',
            name: 'components-anchor',
            meta: { title: '锚点链接' },
            component: ComponentsAnchor
        }, {
            path: '/components/history',
            name: 'components-history',
            meta: { title: '历史路由' },
            component: ComponentsHistory
        }, {
            path: '/components/code',
            name: 'components-code',
            meta: { title: '代码高亮' },
            component: ComponentsCode
        }]
    }, {
        path: '/advanced',
        name: 'advanced',
        meta: { title: '高级应用' },
        component: Advanced
    }]
}]

const passportRoutes: Array<RouteRecordRaw> = [{
    path: '/login',
    name: 'single-login',
    meta: { title: '登录' },
    component: PassportLogin
}, {
    path: '/login/:socialite/:token',
    name: 'socialite-login',
    meta: { name: '社会化登录' },
    component: SocialiteLogin
}, {
    path: '/register',
    name: 'single-register',
    meta: { title: '注册' },
    component: PassportRegister
}, {
    path: '/passport/forget',
    name: 'single-forget',
    meta: { title: '找回密码' },
    component: PassportForget
}, {
    path: '/passport/update',
    name: 'single-update',
    meta: { title: '重置密码' },
    component: PassportUpdate
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