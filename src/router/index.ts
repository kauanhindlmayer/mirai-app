import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import { authGuard } from '~/router/guards/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

router.beforeEach(authGuard)

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
