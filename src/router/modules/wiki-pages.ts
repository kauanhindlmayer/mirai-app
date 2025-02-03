import type { RouteRecordRaw } from 'vue-router'

const wikiPagesRoutes: RouteRecordRaw[] = [
  {
    path: 'wiki-pages/:wikiPageId?',
    name: 'wiki-pages',
    component: () => import('@/views/wiki-pages/WikiPagesList.vue'),
  },
  {
    path: 'wiki-pages/:wikiPageId/edit',
    name: 'wiki-page-edit',
    component: () => import('@/views/wiki-pages/WikiPagesList.vue'),
    props: { isEditing: true },
  },
  {
    path: 'wiki-pages/new',
    name: 'wiki-page-new',
    component: () => import('@/views/wiki-pages/WikiPagesList.vue'),
    props: { isAdding: true },
  },
]

export default wikiPagesRoutes
