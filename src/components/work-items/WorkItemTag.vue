<script setup lang="ts">
import type { WorkItemType } from '~/types/work-item'

defineProps<{
  type: WorkItemType
}>()
</script>

<template>
  <Tag
    :value="getTypeLabel(type)"
    :style="{
      backgroundColor: getTypeBackgroundColor(type),
      color: getTypeColor(type),
    }"
  />
</template>
