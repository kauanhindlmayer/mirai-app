<script setup lang="ts">
import type { VirtualScrollerProps } from 'primevue'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { listTags } from '~/api/tags'
import type { Tag } from '~/types/tag'

defineProps<{ disabled?: boolean }>()

const selectedTag = defineModel<Tag | null>()

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const searchTerm = ref('')
const page = ref(1)
const allTags = ref<Tag[]>([])
const hasNextPage = ref(true)

const {
  data: tagsResponse,
  isLoading,
  refetch,
} = useQuery({
  key: () => ['tags', project.value.id, searchTerm.value, page.value],
  query: () =>
    listTags(project.value.id, {
      page: page.value,
      pageSize: 20,
      searchTerm: searchTerm.value,
      sort: '',
    }),
  enabled: () => false,
})

watch(
  tagsResponse,
  (response) => {
    if (!response) return
    if (page.value === 1) {
      allTags.value = response.items
    } else {
      allTags.value.push(...response.items)
    }
    hasNextPage.value = response.hasNextPage
  },
  { immediate: true },
)

function handleSearch(event: AutoCompleteCompleteEvent) {
  searchTerm.value = event.query
  page.value = 1
  refetch()
}

function onLazyLoad() {
  if (isLoading.value || !hasNextPage.value) return
  page.value += 1
  refetch()
}

const virtualScrollerOptions: VirtualScrollerProps = {
  lazy: true,
  onLazyLoad,
  itemSize: 48,
}
</script>

<template>
  <AutoComplete
    v-model="selectedTag"
    :suggestions="allTags"
    :disabled="disabled"
    :loading="isLoading"
    option-label="name"
    placeholder="Add tag..."
    class="w-full"
    dropdown
    dropdown-mode="blank"
    @complete="handleSearch"
    :virtual-scroller-options="virtualScrollerOptions"
  >
    <template #option="{ option }">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: option.color }" />
        <span>{{ option.name }}</span>
      </div>
    </template>
  </AutoComplete>
</template>
