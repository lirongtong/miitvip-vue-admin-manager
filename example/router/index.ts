import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const Home = () => import('../views/home.vue')
const Start = () => import('../views/start.vue')
const Passport = () => import('../views/passport/index.vue')
const Login = () => import('../views/passport/login.vue')
const Register = () => import('../views/passport/register.vue')

const routes: Array<RouteRecordRaw> = [{
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
    }]
}]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router