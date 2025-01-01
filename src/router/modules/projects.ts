import type { Project } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

const projectsRoutes: RouteRecordRaw[] = [
  { path: '', redirect: '/projects' },
  {
    path: 'projects',
    name: 'projects-home',
    component: () => import('@/views/projects/ProjectsList.vue'),
    meta: {
      title: 'Projects - Home',
    },
  },
  {
    path: 'projects/:projectId/summary',
    name: 'project-summary',
    component: () => import('@/views/projects/ProjectSummary.vue'),
    meta: {
      title: 'Summary - Overview',
      breadcrumbResolver: (project: Project) => [
        { label: project.name, route: `/projects/${project.id}/summary` },
        { label: 'Overview', route: `/projects/${project.id}/summary` },
        { label: 'Summary', route: `/projects/${project.id}/summary` },
      ],
    },
  },
]

export default projectsRoutes
