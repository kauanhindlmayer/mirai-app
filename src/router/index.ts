import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ensureProjectLoaded } from './guards'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/projects' },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('@/views/Projects/ProjectsList.vue'),
      },
      {
        path: 'projects/:projectId',
        children: [
          {
            path: 'summary',
            name: 'project-summary',
            component: () => import('@/views/Projects/ProjectSummary.vue'),
          },
          {
            path: 'work-items',
            name: 'project-work-items',
            component: () => import('@/views/WorkItems/WorkItemsList.vue'),
          },
        ],
      },
    ],
  },
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
