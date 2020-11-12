import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const Home = () => import('../views/home.vue')
const Start = () => import('../views/start.vue')

const routes: Array<RouteRecordRaw> = [{
    path: '/',
    component: Home,
    redirect: 'start',
    children: [{
        path: 'start',
        component: Start 
    }]
}]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router