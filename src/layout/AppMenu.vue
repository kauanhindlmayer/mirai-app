<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Overview',
        icon: 'pi pi-fw pi-home',
        items: [
            { label: 'Empty Page', icon: 'pi pi-fw pi-file', to: '/empty' }
        ]
    },
    { separator: true }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <AppMenuItem v-if="!item.separator" :item="item" root :index="i" />
            <li v-else class="menu-separator" />
        </template>
    </ul>
</template>
