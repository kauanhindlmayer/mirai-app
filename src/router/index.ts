import { ensureProjectLoaded } from '@/router/guards'
import projectRoutes from '@/router/modules/project'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  ...projectRoutes,
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { scrollToTop: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { scrollToTop: true },
  },
  {
    path: '/oops',
    name: 'oops',
    component: () => import('@/views/OopsView.vue'),
    meta: { scrollToTop: true },
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

router.beforeEach(ensureProjectLoaded)

export default router
