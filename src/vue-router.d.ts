import type { BreadcrumbResolver } from '@/types/layout'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    breadcrumbResolver?: BreadcrumbResolver
  }
}
