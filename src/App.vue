<script setup lang="ts">
import { useMeta } from 'vue-meta'

useMeta({
  title: 'Mirai',
  description: {
    name: 'description',
    content:
      'Mirai is a project management tool that aims to help teams collaborate and manage their projects more effectively.',
  },
})
</script>

<template>
  <metainfo />
  <Toast />
  <router-view />
</template>
