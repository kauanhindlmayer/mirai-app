<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import type { InputText } from 'primevue'
import { nextTick, ref, useTemplateRef } from 'vue'
import type { RetrospectiveColumn, RetrospectiveItem } from '~/types/retrospective'
import { format } from '~/utils/date'
import RetrospectiveItemComponent from './RetrospectiveItem.vue'

const props = defineProps<{ column: RetrospectiveColumn }>()

const items = ref<RetrospectiveItem[]>(props.column.items)

const isAddingItem = ref(false)
const newItemContent = ref('')

async function showNewItemInput() {
  isAddingItem.value = true
  await nextTick()
  newItemInputRef.value?.$el.focus()
}

function closeNewItemInput() {
  isAddingItem.value = false
  newItemContent.value = ''
}

type InputTextInstance = InstanceType<typeof InputText> & {
  $el: HTMLElement
}
const newItemInputRef = useTemplateRef<InputTextInstance>('newItemInput')

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  closeNewItemInput()
})
</script>

<template>
  <div class="card flex-1 p-4 mr-4 rounded w-72 max-w-96">
    <header class="text-lg">{{ column.title }}</header>

    <Button label="Add New Item" icon="pi pi-plus" class="my-2" text @click="showNewItemInput" />

    <div v-if="isAddingItem" @focusout="closeNewItemInput" class="mb-4">
      <div class="card flex flex-col gap-2">
        <Textarea ref="newItemInput" v-model="newItemContent" class="mb-4" />
        <p class="text-surface-600 dark:text-surface-200 leading-normal">
          {{ format(new Date(), "MMMM d, yyyy 'at' HH:mm") }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <RetrospectiveItemComponent v-for="item in items" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style>
.card {
  margin-bottom: 0 !important;
}
</style>
