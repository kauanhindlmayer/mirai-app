<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbRoutes = ref<string[]>([])

function setBreadcrumbRoutes() {
  if (route.meta.breadcrumb) {
    breadcrumbRoutes.value = route.meta.breadcrumb as string[]
    return
  }

  breadcrumbRoutes.value = route.fullPath
    .split('/')
    .filter((item) => item !== '')
    .filter((item) => isNaN(Number(item)))
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
}

watch(route, setBreadcrumbRoutes, { immediate: true, deep: true })
</script>

<template>
  <nav class="layout-breadcrumb">
    <ol>
      <template v-for="(breadcrumbRoute, i) in breadcrumbRoutes" :key="breadcrumbRoute">
        <li class="text-surface-950 dark:text-surface-0 title-h7 text-xl">
          {{ breadcrumbRoute }}
        </li>
        <li v-if="i !== breadcrumbRoutes.length - 1" class="layout-breadcrumb-chevron">/</li>
      </template>
    </ol>
  </nav>
</template>
