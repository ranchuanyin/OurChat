import {createRouter, createWebHistory} from 'vue-router'
import {useStore} from "@/stores";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: "welcome",
            component: () => import('@/views/Welcome.vue'),
            children: [
                {
                    path: '',
                    name: 'welcome-login',
                    component: () => import('@/components/welcome/LoginPage.vue'),
                }, {
                    path: 'register',
                    name: 'welcome-register',
                    component: () => import('@/components/welcome/RegisterPage.vue'),
                },
                {
                    path: 'forget',
                    name: 'welcome-forget',
                    component: () => import('@/components/welcome/ForgetPage.vue'),
                }
            ]
        },
        {
            path:'/message',
            name: 'message-index',
            component:() => import('@/views/index.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    const store = useStore()
    if (store.auth.user != null && to.name.startsWith('welcome-')) {
        next('/message')
    } else if (store.auth.user == null && to.fullPath.startsWith('/message')) {
        next('/')
    } else if (to.matched.length === 0) {
        next('/message')
    } else {
        next()
    }
})

export default router
