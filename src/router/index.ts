import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '~/layout/AppLayout.vue'
import { ensureProjectLoaded } from '~/router/guards'
import boardsRoutes from '~/router/modules/boards'
import projectsRoutes from '~/router/modules/projects'
import wikiPagesRoutes from '~/router/modules/wiki-pages'
import workItemsRoutes from '~/router/modules/work-items'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      ...projectsRoutes,
      {
        path: 'projects/:projectId',
        children: [
          ...workItemsRoutes,
          ...wikiPagesRoutes,
          ...boardsRoutes,
          {
            path: 'dashboards',
            name: 'dashboards',
            component: () => import('~/views/DashboardView.vue'),
          },
          {
            path: 'tags',
            name: 'tags',
            component: () => import('~/views/TagsView.vue'),
          },
          {
            path: 'personas',
            name: 'personas',
            component: () => import('~/views/PersonasView.vue'),
          },
          {
            path: 'backlogs',
            name: 'backlogs',
            component: () => import('~/views/BacklogView.vue'),
          },
          {
            path: 'sprints',
            name: 'sprints',
            component: () => import('~/views/SprintsView.vue'),
          },
          {
            path: 'retrospectives',
            name: 'retrospectives',
            component: () => import('~/views/EmptyView.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('~/views/LoginView.vue'),
    meta: { scrollToTop: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('~/views/RegisterView.vue'),
    meta: { scrollToTop: true },
  },
  {
    path: '/oops',
    name: 'oops',
    component: () => import('~/views/OopsView.vue'),
    meta: { scrollToTop: true },
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('~/views/NotFound.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('~/views/NotFound.vue'),
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
