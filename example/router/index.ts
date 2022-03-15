import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Login = () => import('@views/login.vue')
const Register = () => import('@views/register.vue')

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
    ...passportRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router