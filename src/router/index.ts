import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

console.log('routes =>', routes)
const router = createRouter({
    history: <any>createWebHistory(),
    routes: [...routes, {
        path: '/',
        redirect: '/home',
    }],
})

export default router