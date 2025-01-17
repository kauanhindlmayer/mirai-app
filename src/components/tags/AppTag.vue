<script setup lang="ts">
defineProps<{
  color: string
  label: string
}>()

const documentStyle = getComputedStyle(document.documentElement)
const textColor = documentStyle.getPropertyValue('--text-color')
</script>

<template>
  <Tag :style="{ backgroundColor: color, color: textColor }">
    <span class="font-normal">{{ label }}</span>
  </Tag>
</template>
