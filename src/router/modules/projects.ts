import type { RouteRecordRaw } from 'vue-router'

const projectsRoutes: RouteRecordRaw[] = [
  { path: '', redirect: '/projects' },
  {
    path: 'projects',
    name: 'projects-home',
    component: () => import('~/views/projects/ProjectsList.vue'),
  },
  {
    path: 'projects/:projectId/summary',
    name: 'project-summary',
    component: () => import('~/views/projects/ProjectSummary.vue'),
  },
]

export default projectsRoutes
