<script setup lang="ts">
import type { RetrospectiveItem } from '~/types/retrospective'
import { format } from '~/utils/date'

defineProps<{ item: RetrospectiveItem }>()
</script>

<template>
  <div class="card flex flex-col gap-2">
    <p class="text-surface-900 dark:text-surface-0 mb-4">{{ item.content }}</p>
    <p class="text-surface-600 dark:text-surface-200 leading-normal">
      {{ format(item.createdAt, "MMMM d, yyyy 'at' HH:mm") }}
    </p>
  </div>
</template>
