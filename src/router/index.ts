import AppLayout from '@/layout/AppLayout.vue';
import AuthLayout from '@/layout/AuthLayout.vue';
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw
} from 'vue-router';

const routes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/empty',
                name: 'empty',
                component: () => import('@/views/Empty.vue')
            }
        ]
    },
    {
        path: '/',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/LoginView.vue')
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('@/views/RegisterView.vue')
            },
            {
                path: 'oops',
                name: 'oops',
                component: () => import('@/views/Oops.vue')
            }
        ],
        meta: { scrollToTop: true }
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/NotFound.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/NotFound.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});

export default router;
