<template>
  <div class="card flex flex-col w-72 p-4 rounded shadow-lg m-2">
    <h2 class="text-lg font-semibold mb-2">{{ column.name }}</h2>
    <BoardCard v-for="card in column.cards" :key="card.id" :card="card" />
  </div>
</template>

<script setup lang="ts">
import type { Column } from '@/types/board'
import { defineProps } from 'vue'
import BoardCard from './BoardCard.vue'

defineProps<{ column: Column }>()
</script>
