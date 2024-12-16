<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import type { MenuItem } from '@/types/layout'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

const projectStore = useProjectStore()
const { projectId } = storeToRefs(projectStore)

const menuItems = ref<MenuItem[]>([
  {
    label: 'Overview',
    icon: 'pi pi-fw pi-home',
    items: [
      {
        label: 'Summary',
        icon: 'pi pi-fw pi-file',
        to: `/projects/${projectId}/summary`,
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-chart-bar',
        to: `/projects/${projectId}/dashboard`,
      },
      {
        label: 'Wiki',
        icon: 'pi pi-fw pi-book',
        to: `/projects/${projectId}/wiki`,
      },
    ],
  },
  { separator: true },
  {
    label: 'Boards',
    icon: 'pi pi-fw pi-th-large',
    items: [
      {
        label: 'Work Items',
        icon: 'pi pi-fw pi-list',
        to: `/projects/${projectId}/work-items`,
      },
      {
        label: 'Boards',
        icon: 'pi pi-fw pi-th-large',
        to: '/boards',
      },
      {
        label: 'Backlogs',
        icon: 'pi pi-fw pi-calendar',
        to: '/backlogs',
      },
      {
        label: 'Sprints',
        icon: 'pi pi-fw pi-calendar-times',
        to: '/sprints',
      },
      {
        label: 'Queries',
        icon: 'pi pi-fw pi-search',
        to: '/queries',
      },
    ],
  },
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menuItems" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" root :index="i" />
      <li v-else class="menu-separator" />
    </template>
  </ul>
</template>
