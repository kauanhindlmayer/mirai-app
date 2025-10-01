<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import {
  useConfirm,
  type DataTablePageEvent,
  type DataTableRowEditSaveEvent,
  type DataTableSortEvent,
} from 'primevue'
import { deleteTags } from '~/api/tags'

const pageStore = usePageStore()
pageStore.setTitle('Tags - Boards')

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const selectedTags = ref<Tag[]>([])
const editingRows = ref([])

const newTag = ref<CreateTagRequest>({
  name: '',
  description: '',
  color: '',
})

const queryCache = useQueryCache()

const { mutate: addTag } = useMutation({
  mutation: (_: MouseEvent) => createTag(project.value.id, newTag.value),
  onSuccess: async () => {
    await queryCache.invalidateQueries({ key: ['tags'] })
    newTag.value = { name: '', description: '', color: '' }
  },
  onError: displayError,
})

const { mutate: updateTagFn } = useMutation({
  mutation: (event: DataTableRowEditSaveEvent) => {
    const tag = event.newData as Tag
    return updateTag(project.value.id, tag.id, {
      name: tag.name,
      description: tag.description,
      color: tag.color,
    })
  },
  onSuccess: async () => {
    await queryCache.invalidateQueries({ key: ['tags'] })
  },
  onError: displayError,
})

const confirm = useConfirm()

function confirmDeleteTags() {
  confirm.require({
    header: 'Are you sure you want to delete the selected tags?',
    message: 'All associations of the selected tags will be removed. This action cannot be undone.',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: deleteTagFn,
  })
}

const { mutate: deleteTagFn } = useMutation({
  mutation: () =>
    deleteTags(
      project.value.id,
      selectedTags.value.map((tag) => tag.id),
    ),
  onSuccess: async () => {
    await queryCache.invalidateQueries({ key: ['tags'] })
    selectedTags.value = []
  },
  onError: displayError,
})

const filters = ref<PaginationFilter>({
  page: 1,
  pageSize: 10,
  sort: '',
  searchTerm: '',
})

async function onSort(event: DataTableSortEvent) {
  const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc'
  filters.value.sort = `${event.sortField} ${sortOrder}`
}

async function onPaginate(event: DataTablePageEvent) {
  filters.value.page = event.page + 1
  filters.value.pageSize = event.rows
}

const onSearch = useDebounceFn((newSearchTerm) => {
  filters.value.searchTerm = newSearchTerm.trim()
}, 300)

const { data: tags, isLoading } = useQuery({
  key: () => ['tags', filters.value],
  query: () => listTags(project.value.id, filters.value),
  placeholderData: (previousData) => previousData,
})

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
    { label: 'Tags', route: `/projects/${project.value.id}/tags` },
  ])
}

const router = useRouter()

function redirectToTagImports() {
  router.push(`/projects/${project.value.id}/tags/import`)
}

onBeforeMount(setBreadcrumbs)
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-xl mb-4">Tags Management</div>
          <div class="flex items-center gap-2">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText @update:model-value="onSearch" placeholder="Keyword Search" />
            </IconField>
            <Button
              label="Delete"
              severity="danger"
              icon="pi pi-trash"
              :disabled="selectedTags.length === 0"
              @click="confirmDeleteTags"
            />
          </div>
        </div>
        <div class="flex items-center gap-4 mb-4">
          <InputText v-model="newTag.name" placeholder="Name" />
          <InputText v-model="newTag.description" placeholder="Description" />
          <ColorSelect v-model="newTag.color" />
          <Button label="Add Tag" icon="pi pi-plus" :disabled="!newTag.name" @click="addTag" />
          <Button
            label="Import Tags"
            icon="pi pi-upload"
            severity="secondary"
            @click="redirectToTagImports"
          />
        </div>
        <DataTable
          v-model:editingRows="editingRows"
          v-model:selection="selectedTags"
          :value="tags?.items"
          :rows="filters.pageSize"
          :total-records="tags?.totalCount"
          :rows-per-page-options="[5, 10, 20, 50]"
          :loading="isLoading"
          :page-count="tags?.totalPages"
          lazy
          paginator
          table-style="min-width: 50rem"
          edit-mode="row"
          data-key="id"
          @row-edit-save="updateTagFn"
          @sort="onSort"
          @page="onPaginate"
        >
          <Column selection-mode="multiple" header-style="width: 3rem" />

          <Column header="Name" field="name" sortable>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" fluid />
            </template>
          </Column>
          <Column header="Description" field="description" sortable>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" fluid />
            </template>
          </Column>
          <Column header="Color" field="color" sortable>
            <template #body="{ data }">
              <AppTag :color="data.color" :label="getColorName(data.color)" />
            </template>
            <template #editor="{ data, field }">
              <ColorSelect v-model="data[field]" />
            </template>
          </Column>
          <Column header="Associations" field="workItemsCount" sortable />
          <Column header="Actions" row-editor />
          <template #empty>
            <div v-if="!isLoading" class="text-center py-24">
              <div class="mb-4">
                <i class="pi pi-tag text-4xl text-surface-400 dark:text-surface-600"></i>
              </div>
              <div class="text-lg font-medium text-surface-900 dark:text-surface-0 mb-2">
                No tags found
              </div>
              <div class="text-surface-600 dark:text-surface-400 mb-4">
                Create tags to categorize and organize your work items.
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
    <ConfirmDialog style="width: 450px" />
  </div>
</template>
