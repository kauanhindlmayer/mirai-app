<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  message: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <i :class="[icon, 'text-6xl text-surface-400 mb-4']" />
    <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-200 mb-2">
      {{ title }}
    </h3>
    <p class="text-surface-500 dark:text-surface-400 text-center mb-6 max-w-md">
      {{ message }}
    </p>
  </div>
</template>
