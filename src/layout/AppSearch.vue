<script setup lang="ts">
import type { InputText } from 'primevue'

const { layoutState } = useLayout()

type InputTextInstance = InstanceType<typeof InputText> & {
  $el: HTMLElement
}
const searchInputRef = useTemplateRef<InputTextInstance>('searchInput')
const searchQuery = ref('')

const router = useRouter()

function redirectToWisdomExtractor() {
  layoutState.searchBarActive = false
  router.push({
    name: '/projects/[projectId]/wisdom-extractor',
    query: { q: searchQuery.value },
  })
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
      header: 'hidden!',
      content: 'p-0!',
    }"
  >
    <div class="search-container">
      <i class="pi pi-search" />
      <InputText
        type="text"
        class="p-inputtext search-input"
        ref="searchInput"
        v-model="searchQuery"
        placeholder="Search"
        @keydown.enter="redirectToWisdomExtractor"
      />
    </div>
  </Dialog>
</template>
