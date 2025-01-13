<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import type { MenuItem } from '@/types/layout'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

const { project } = storeToRefs(useProjectStore())

const menuItems = computed<MenuItem[]>(() => [
  {
    label: 'Overview',
    icon: 'pi pi-fw pi-home',
    items: [
      {
        label: 'Summary',
        icon: 'pi pi-fw pi-file',
        to: `/projects/${project.value?.id}/summary`,
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-chart-bar',
        to: `/projects/${project.value?.id}/dashboard`,
      },
      {
        label: 'Wiki Pages',
        icon: 'pi pi-fw pi-book',
        to: `/projects/${project.value?.id}/wiki-pages`,
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
        to: `/projects/${project.value?.id}/work-items`,
      },
      {
        label: 'Boards',
        icon: 'pi pi-fw pi-th-large',
        to: `/projects/${project.value?.id}/boards`,
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
      {
        label: 'Personas',
        icon: 'pi pi-fw pi-users',
        to: '/personas',
      },
      {
        label: 'Retrospectives',
        icon: 'pi pi-fw pi-comments',
        to: '/retrospectives',
      },
      {
        label: 'Estimate',
        icon: 'pi pi-fw pi-stopwatch',
        to: '/estimates',
      },
      {
        label: 'Tags',
        icon: 'pi pi-fw pi-tags',
        to: '/tags',
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
