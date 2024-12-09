import AppLayout from '@/layout/AppLayout.vue';
import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw
} from 'vue-router';

const routes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/p/:projectName/',
        component: AppLayout,
        children: [
            {
                path: 'empty',
                name: 'empty',
                component: () => import('@/views/Empty.vue')
            },
            {
                path: 'summary',
                name: 'project',
                component: () => import('@/views/Empty.vue'),
                meta: { breadcrumb: ['Summary'] }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { scrollToTop: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/RegisterView.vue'),
        meta: { scrollToTop: true }
    },
    {
        path: '/oops',
        name: 'oops',
        component: () => import('@/views/Oops.vue'),
        meta: { scrollToTop: true }
    },
    {
        path: '/projects',
        name: 'projects-home',
        component: () => import('@/views/ProjectsHomeView.vue')
    },
    {
        path: '/not-found',
        name: 'not-found',
        component: () => import('@/views/NotFound.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
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
