<script setup lang="ts">
const pageStore = usePageStore()
const { breadcrumbs } = storeToRefs(pageStore)

const router = useRouter()

function redirectTo(route: string) {
  router.push({ path: route })
}
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
