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
    children: [{
        path: 'start',
        component: Start 
    }, {
        path: 'passport',
        component: Passport,
        redirect: 'passport/login',
        children: [{
            path: 'login',
            component: Login
        }, {
            path: 'register',
            component: Register
        }]
    }, {
        path: 'tools',
        component: Tools,
        redirect: 'tools/editor',
        children: [{
            path: 'editor',
            component: ToolsEditor
        }, {
            path: 'captcha',
            component: ToolsCaptcha,
            redirect: 'tools/captcha/message',
            children: [{
                path: 'message',
                component: ToolsCaptchaMessage
            }]
        }]
    }, {
        path: 'list',
        component: List,
        redirect: 'list/normal',
        children: [{
            path: 'normal',
            component: ListNormal
        }, {
            path: 'card',
            component: ListCard
        }, {
            path: 'goods',
            component: ListGoods
        }]
    }]
}]

const passportRouter: Array<RouteRecordRaw> = [{
    path: '/login',
    name: 'login',
    meta: {title: '登录'},
    component: LoginSingle
}, {
    path: '/register',
    name: 'register',
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