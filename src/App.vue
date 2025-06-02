<script setup lang="ts">
import { useShortcuts } from '~/composables/useShortcuts'

useMeta({
  title: 'Mirai',
  description: {
    name: 'description',
    content:
      'Mirai is a project management tool that aims to help teams collaborate and manage their projects more effectively.',
  },
})

useShortcuts()
</script>

<template>
  <metainfo />
  <Toast />
  <router-view />
</template>
