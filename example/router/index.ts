import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import('../views/home.vue')
const Login = () => import('../views/login.vue')
const Register = () => import('../views/register.vue')
const Start = () => import('../views/start.vue')
const Tools = () => import('../views/tools/index.vue')
const ToolsG = () => import('../views/tools/config.vue')
const ToolsCaches = () => import('../views/tools/caches.vue')
const ToolsHttp = () => import('../views/tools/http.vue')
const ToolsTools = () => import('../views/tools/tools.vue')
const Pages = () => import('../views/pages/index.vue')
const PagesLogin = () => import('../views/pages/login.vue')
const PagesRegister = () => import('../views/pages/register.vue')
const Components = () => import('../views/components/index.vue')
const ComponentsLayout = () => import('../views/components/layout.vue')
const ComponentsMenu = () => import('../views/components/menu.vue')
const ComponentsNotice = () => import('../views/components/notice.vue')
const ComponentsModal = () => import('../views/components/modal.vue')
const ComponentsTooltip = () => import ('../views/components/tooltip.vue')
const ComponentsCaptcha = () => import('../views/components/captcha.vue')
const ComponentsPassword = () => import('../views/components/password.vue')
const ComponentsDropdown = () => import('../views/components/dropdown.vue')
const ComponentsSearch = () => import('../views/components/search.vue')
const ComponentsAnchor = () => import('../views/components/anchor.vue')
const ComponentsUploader = () => import('../views/components/uploader.vue')

const menuRoutes: Array<RouteRecordRaw> = [{
    path: '/',
    meta: {title: '首页'},
    component: Home,
    redirect: 'start',
    children: [{
        path: 'start',
        name: 'start',
        meta: {title: '快速上手'},
        component: Start
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
            component: ToolsG
        }, {
            path: '/tools/http',
            name: 'tools-http',
            meta: {title: '请求响应'},
            component: ToolsHttp
        }, {
            path: '/tools/caches',
            name: 'tools-caches',
            meta: {title: '本地缓存'},
            component: ToolsCaches
        }, {
            path: '/tools/func',
            name: 'tools-func',
            meta: {title: '工具函数'},
            component: ToolsTools
        }]
    }, {
        path: 'pages',
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
        }]
    }, {
        path: 'components',
        name: 'components',
        meta: {title: '定制组件'},
        component: Components,
        redirect: '/components/layout',
        children: [{
            path: '/components/layout',
            name: 'components-layout',
            meta: {title: '基础布局'},
            component: ComponentsLayout
        }, {
            path: '/components/menu',
            name: 'components-menu',
            meta: {title: '左侧菜单'},
            component: ComponentsMenu
        }, {
            path: '/components/notice',
            name: 'components-notice',
            meta: {title: '消息中心'},
            component: ComponentsNotice
        }, {
            path: '/components/modal',
            name: 'components-modal',
            meta: {title: '弹窗组件'},
            component: ComponentsModal
        }, {
            path: '/components/tooltip',
            name: 'components-tooltip',
            meta: {title: '气泡提示'},
            component: ComponentsTooltip
        }, {
            path: '/components/captcha',
            name: 'components-captcha',
            meta: {title: '滑块验证'},
            component: ComponentsCaptcha
        }, {
            path: '/components/search',
            name: 'components-search',
            meta: {title: '联想搜索'},
            component: ComponentsSearch
        }, {
            path: '/components/uploader',
            name: 'components-uploader',
            meta: {title: '文件上传'},
            component: ComponentsUploader
        }, {
            path: '/components/password',
            name: 'components-password',
            meta: {title: '密码设置'},
            component: ComponentsPassword
        }, {
            path: '/components/dropdown',
            name: 'components-dropdown',
            meta: {title: '下拉菜单'},
            component: ComponentsDropdown
        }, {
            path: '/components/anchor',
            name: 'components-anchor',
            meta: {title: '锚点链接'},
            component: ComponentsAnchor
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
    ...passportRoutes,
    ...menuRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router