import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { isTokenExpired } from '~/utils'

export function authGuard(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const token = localStorage.getItem('accessToken')
  const isAuthenticated = token && !isTokenExpired(token)
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(to.path)
  if (!isAuthenticated && !isPublicRoute) {
    next('/login')
    return
  }
  if (isAuthenticated && to.path === '/login') {
    next('/')
    return
  }
  next()
}
