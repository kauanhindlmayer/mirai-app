import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import { ensureProjectLoaded } from '~/router/guards'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

router.beforeEach(ensureProjectLoaded)

export default router
