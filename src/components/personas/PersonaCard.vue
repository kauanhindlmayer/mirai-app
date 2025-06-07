<script setup lang="ts">
import type { PersonaBriefResponse } from '~/types/persona'

const { persona } = defineProps<{
  persona: PersonaBriefResponse
}>()
</script>

<template>
  <Card class="!rounded-lg cursor-pointer">
    <template #header>
      <img
        v-if="persona.imageUrl"
        :src="persona.imageUrl"
        alt="Persona image"
        class="w-full h-48 object-cover"
      />
      <div v-else class="w-full h-48 bg-gray-100 dark:bg-surface-500" />
    </template>
    <template #title>
      <div class="text-lg font-semibold text-center text-gray-900 dark:text-white">
        {{ persona.name }}
      </div>
    </template>
  </Card>
</template>
