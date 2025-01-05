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
]

export default wikiPagesRoutes
