<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import type { InputText } from 'primevue'
import { useTemplateRef } from 'vue'

const { layoutState } = useLayout()

type InputTextInstance = InstanceType<typeof InputText> & {
  $el: HTMLElement
}
const searchInputRef = useTemplateRef<InputTextInstance>('searchInput')

function toggleSearchBar() {
  layoutState.searchBarActive = !layoutState.searchBarActive
}

function focusOnInput() {
  searchInputRef.value?.$el.focus()
}
</script>

<template>
  <Dialog
    v-model:visible="layoutState.searchBarActive"
    :breakpoints="{ '992px': '75vw', '576px': '90vw' }"
    modal
    dismissable-mask
    @show="focusOnInput"
    :pt="{
      root: 'w-1/2',
      header: '!hidden',
      content: '!p-0',
    }"
  >
    <div class="search-container">
      <i class="pi pi-search" />
      <InputText
        type="text"
        class="p-inputtext search-input"
        ref="searchInput"
        placeholder="Search"
        @keydown.enter="toggleSearchBar"
      />
    </div>
  </Dialog>
</template>
