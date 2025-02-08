<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { MenuItem } from 'primevue/menuitem'
import { computed } from 'vue'
import { useProjectStore } from '~/stores/project'
import AppMenuItem from './AppMenuItem.vue'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const menuItems = computed<MenuItem[]>(() => [
  {
    label: 'Overview',
    icon: 'pi pi-fw pi-home',
    items: [
      {
        label: 'Summary',
        icon: 'pi pi-fw pi-file',
        to: `/projects/${project.value.id}/summary`,
      },
      {
        label: 'Dashboards',
        icon: 'pi pi-fw pi-chart-bar',
        to: `/projects/${project.value.id}/dashboards`,
      },
      {
        label: 'Wiki Pages',
        icon: 'pi pi-fw pi-book',
        to: `/projects/${project.value.id}/wiki-pages`,
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
        to: `/projects/${project.value.id}/work-items`,
      },
      {
        label: 'Boards',
        icon: 'pi pi-fw pi-th-large',
        to: `/projects/${project.value.id}/boards`,
      },
      {
        label: 'Backlogs',
        icon: 'pi pi-fw pi-calendar',
        to: `/projects/${project.value.id}/backlogs`,
      },
      {
        label: 'Sprints',
        icon: 'pi pi-fw pi-calendar-times',
        to: `/projects/${project.value.id}/sprints`,
      },
      {
        label: 'Personas',
        icon: 'pi pi-fw pi-users',
        to: `/projects/${project.value.id}/personas`,
      },
      {
        label: 'Retrospectives',
        icon: 'pi pi-fw pi-comments',
        to: `/projects/${project.value.id}/retrospectives`,
      },
      {
        label: 'Tags',
        icon: 'pi pi-fw pi-tags',
        to: `/projects/${project.value.id}/tags`,
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
