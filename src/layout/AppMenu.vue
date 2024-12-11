<script setup lang="ts">
import { ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

const menuItems = ref([
  {
    label: 'Overview',
    icon: 'pi pi-fw pi-home',
    items: [
      {
        label: 'Summary',
        icon: 'pi pi-fw pi-file',
        to: '/summary',
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-chart-bar',
        to: '/dashboard',
      },
      {
        label: 'Wiki',
        icon: 'pi pi-fw pi-book',
        to: '/wiki',
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
        to: '/work-items',
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
