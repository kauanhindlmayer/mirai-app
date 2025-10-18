<script setup lang="ts">
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { listWorkItems } from '~/api/work-items'
import { WorkItemLinkType, type CreateWorkItemLinkRequest, type WorkItem } from '~/types/work-item'

const props = defineProps<{
  projectId: string
  currentWorkItemId: string
}>()

const emit = defineEmits<{
  'link-created': [request: CreateWorkItemLinkRequest]
}>()

const { isVisible, showDialog } = useDialog()

const initialValues = {
  targetWorkItemId: '',
  linkType: WorkItemLinkType.Related,
  comment: '',
}

const form = ref<CreateWorkItemLinkRequest>({ ...initialValues })

const selectedWorkItem = ref<WorkItem | null>(null)
const searchTerm = ref('')

const linkTypeOptions = formatEnumOptions(WorkItemLinkType)

const {
  data: searchResults,
  isLoading,
  refetch,
} = useQuery({
  key: () => ['work-items-search', props.projectId, searchTerm.value],
  query: () =>
    listWorkItems(props.projectId, {
      page: 1,
      pageSize: 20,
      searchTerm: searchTerm.value,
      sort: '',
    }),
  enabled: () => !!searchTerm.value,
})

const workItems = computed(() => {
  if (!searchResults.value?.items) return []
  return searchResults.value.items.filter((item) => item.id !== props.currentWorkItemId)
})

const isFormValid = computed(() => selectedWorkItem.value !== null && form.value.linkType !== null)

watch(selectedWorkItem, (workItem) => {
  form.value.targetWorkItemId = workItem?.id ?? ''
})

function handleSearch(event: AutoCompleteCompleteEvent) {
  searchTerm.value = event.query
  refetch()
}

function handleCreate() {
  if (!isFormValid.value) return
  emit('link-created', { ...form.value })
  hideDialog()
}

function hideDialog() {
  isVisible.value = false
  selectedWorkItem.value = null
  Object.assign(form.value, initialValues)
}

defineExpose({
  showDialog,
  hideDialog,
})
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Add Link"
    :style="{ width: '30rem' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="work-item" class="font-medium text-surface-600 dark:text-surface-0">
          Work Item
        </label>
        <AutoComplete
          id="work-item"
          v-model="selectedWorkItem"
          :suggestions="workItems"
          :loading="isLoading"
          option-label="title"
          placeholder="Search by code or title..."
          class="w-full"
          dropdown
          dropdown-mode="blank"
          @complete="handleSearch"
        >
          <template #option="{ option }">
            <div class="flex flex-col">
              <span class="font-medium line-clamp-1">{{ option.code }} - {{ option.title }}</span>
              <small class="text-surface-500">{{ option.type }} | {{ option.status }}</small>
            </div>
          </template>
        </AutoComplete>
      </div>

      <div class="flex flex-col gap-2">
        <label for="link-type" class="font-medium text-surface-600 dark:text-surface-0">
          Link Type
        </label>
        <Select
          id="link-type"
          v-model="form.linkType"
          :options="linkTypeOptions"
          option-label="label"
          option-value="value"
          placeholder="Select link type"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="comment" class="font-medium text-surface-600 dark:text-surface-0">
          Comment
        </label>
        <Textarea
          id="comment"
          v-model="form.comment"
          rows="3"
          placeholder="Enter an optional comment..."
          :maxlength="500"
          fluid
        />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" severity="secondary" @click="hideDialog" />
      <Button label="Add Link" :disabled="!isFormValid" @click="handleCreate" />
    </template>
  </Dialog>
</template>
