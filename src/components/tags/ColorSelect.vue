<script setup lang="ts">
import { colors, getColorName } from '~/utils/tag'

const color = defineModel<string>()
</script>

<template>
  <Select
    v-model="color"
    :options="colors"
    option-label="name"
    option-value="code"
    placeholder="Select a color"
    class="w-48"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center">
        <AppTag :color="slotProps.value" :label="getColorName(slotProps.value)" />
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>

    <template #option="{ option }">
      <AppTag :color="option.code" :label="option.name" />
    </template>
  </Select>
</template>
