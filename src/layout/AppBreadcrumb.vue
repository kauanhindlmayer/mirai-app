<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import type { Breadcrumb } from '@/types/layout'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<Breadcrumb[]>([])

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

function setBreadcrumbRoutes() {
  if (!hasBreadcrumbResolver()) return
  breadcrumbs.value = route.meta.breadcrumbResolver!(project.value!)
}

function hasBreadcrumbResolver() {
  return typeof route.meta.breadcrumbResolver === 'function'
}

function redirectTo(route: string) {
  router.push({ path: route })
}

watch(route, setBreadcrumbRoutes, { immediate: true })
</script>

<template>
  <nav class="layout-breadcrumb">
    <ol>
      <template v-for="(breadcrumb, i) in breadcrumbs" :key="breadcrumb">
        <li
          class="text-surface-950 dark:text-surface-0 text-xl font-medium px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
          @click="redirectTo(breadcrumb.route)"
        >
          {{ breadcrumb.label }}
        </li>
        <li v-if="i !== breadcrumbs.length - 1">/</li>
      </template>
    </ol>
  </nav>
</template>
