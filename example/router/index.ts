import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const Home = () => import('../views/home.vue')
const Start = () => import('../views/start.vue')
const LoginSingle = () => import('../views/login.vue')
const RegisterSingle = () => import('../views/register.vue')
const Passport = () => import('../views/passport/index.vue')
const Login = () => import('../views/passport/login.vue')
const Register = () => import('../views/passport/register.vue')
const List = () => import('../views/list/index.vue')
const ListNormal = () => import('../views/list/normal.vue')
const ListCard = () => import('../views/list/card.vue')
const ListGoods = () => import('../views/list/goods.vue')
const Tools = () => import('../views/tools/index.vue')
const ToolsEditor = () => import('../views/tools/editor.vue')
const ToolsCaptcha = () => import('../views/tools/captcha.vue')
const ToolsCaptchaMessage = () => import('../views/tools/message.vue')

const menuRouter: Array<RouteRecordRaw> = [{
    path: '/',
    component: Home,
    redirect: 'start',
    meta: {title: '首页'},
    children: [{
        path: 'start',
        name: 'start',
        meta: {title: '快速开始'},
        component: Start 
    }, {
        path: 'passport',
        meta: {title: '注册登录'},
        component: Passport,
        redirect: 'passport/login',
        children: [{
            path: 'login',
            name: 'login',
            meta: {title: '登录页面'},
            component: Login
        }, {
            path: 'register',
            name: 'register',
            meta: {title: '注册页面'},
            component: Register
        }]
    }, {
        path: 'tools',
        component: Tools,
        redirect: 'tools/editor',
        children: [{
            path: 'editor',
            name: 'editor',
            meta: {title: '编辑器'},
            component: ToolsEditor
        }, {
            path: 'captcha',
            component: ToolsCaptcha,
            meta: {title: '验证码'},
            redirect: 'tools/captcha/message',
            children: [{
                path: 'message',
                name: 'message',
                meta: {title: '短信验证码'},
                component: ToolsCaptchaMessage
            }]
        }]
    }, {
        path: 'list',
        component: List,
        meta: {title: '列表页面'},
        redirect: 'list/normal',
        children: [{
            path: 'normal',
            name: 'normal',
            meta: {title: '基础列表'},
            component: ListNormal
        }, {
            path: 'card',
            name: 'card',
            meta: {title: '卡片列表'},
            component: ListCard
        }, {
            path: 'goods',
            name: 'goods',
            meta: {title: '商品列表'},
            component: ListGoods
        }]
    }]
}]

const passportRouter: Array<RouteRecordRaw> = [{
    path: '/login',
    name: 'single-login',
    meta: {title: '登录'},
    component: LoginSingle
}, {
    path: '/register',
    name: 'single-register',
    meta: {title: '注册'},
    component: RegisterSingle
}]

const routes: Array<RouteRecordRaw> = [
    ...passportRouter,
    ...menuRouter
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router