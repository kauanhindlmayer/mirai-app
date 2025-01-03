<template>
  <div class="card flex-1 p-4 mr-4 rounded bg-gray-200 min-w-52">
    <h2 class="text-lg font-semibold mb-2">{{ column.name }}</h2>
    <BoardCard v-for="card in column.cards" :key="card.id" :card="card" />
  </div>
</template>

<script setup lang="ts">
import type { Column } from '@/types/board'
import BoardCard from './BoardCard.vue'

defineProps<{ column: Column }>()
</script>
