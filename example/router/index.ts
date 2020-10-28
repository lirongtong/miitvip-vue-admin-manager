import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Home = () => import('/@views/home.vue')
const Start = () => import('/@views/start.vue')
const Passport = () => import('/@views/passport/index.vue')
const Login = () => import('/@views/passport/login.vue')
const Register = () => import('/@views/passport/register.vue')
const List = () => import('/@views/list/index.vue')
const ListNormal = () => import('/@views/list/normal.vue')
const ListCard = () => import('/@views/list/card.vue')
const ListGoods = () => import('/@views/list/goods.vue')
const Tools = () => import('/@views/tools/index.vue')
const ToolsEditor = () => import('/@views/tools/editor.vue')
const ToolsCaptcha = () => import('/@views/tools/captcha.vue')

const routes: Array<RouteRecordRaw> = [{
    path: '/',
    component: Home,
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
            component: ToolsCaptcha
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
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router