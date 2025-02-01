<script setup lang="ts">
import { deleteTag as _deleteTag, updateTag as _updateTag, createTag, listTags } from '@/api/tags'
import AppTag from '@/components/tags/AppTag.vue'
import ColorSelect from '@/components/tags/ColorSelect.vue'
import { displayError } from '@/composables/displayError'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import type { CreateTagRequest, Tag } from '@/types/tag'
import { getColorName } from '@/utils/tag'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { DataTableRowEditSaveEvent } from 'primevue'
import { computed, onBeforeMount, ref } from 'vue'

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
const searchTerm = ref('')
const filteredTags = computed(() => {
  return tags.value.filter((tag) => tag.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
})

const queryCache = useQueryCache()

const { mutate: addTag } = useMutation({
  mutation: (_: MouseEvent) => createTag(project.value!.id, newTag.value),
  onSuccess: async () => {
    await queryCache.invalidateQueries({ key: ['tags'] })
    newTag.value = { name: '', description: '', color: '' }
  },
  onError: displayError,
})

const { mutate: updateTag } = useMutation({
  mutation: (event: DataTableRowEditSaveEvent) => {
    const tag = event.newData as Tag
    return _updateTag(project.value!.id, tag.id, {
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

const { mutate: deleteTag } = useMutation({
  mutation: (_: MouseEvent) => _deleteTag(project.value!.id, selectedTags.value[0].id),
  onSuccess: async () => {
    selectedTags.value = []
    await queryCache.invalidateQueries({ key: ['tags'] })
  },
  onError: displayError,
})

const { data: tags, isLoading } = useQuery({
  key: () => ['tags'],
  query: () => listTags(project.value!.id),
  placeholderData: [] as Tag[],
})

function setBreadcrumbs() {
  const projectName = project.value!.name
  const projectId = project.value!.id
  pageStore.setBreadcrumbs([
    { label: projectName, route: `/projects/${projectId}/summary` },
    { label: 'Boards', route: `/projects/${projectId}/boards` },
    { label: 'Tags', route: `/projects/${projectId}/tags` },
  ])
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
              <InputText v-model.trim="searchTerm" placeholder="Search" />
            </IconField>
            <Button
              label="Delete"
              severity="danger"
              icon="pi pi-trash"
              :disabled="selectedTags.length === 0"
              @click="deleteTag"
            />
          </div>
        </div>
        <div class="flex items-center mb-4">
          <InputText v-model="newTag.name" placeholder="Name" class="mr-4" />
          <InputText v-model="newTag.description" placeholder="Description" class="mr-4" />
          <ColorSelect v-model="newTag.color" />
          <Button
            label="Add Tag"
            icon="pi pi-plus"
            class="mr-4"
            :disabled="!newTag.name"
            @click="addTag"
          />
        </div>
        <DataTable
          v-model:editingRows="editingRows"
          v-model:selection="selectedTags"
          :value="filteredTags"
          :loading="isLoading"
          edit-mode="row"
          data-key="id"
          table-style="min-width: 50rem"
          @row-edit-save="updateTag"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

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
        </DataTable>
      </div>
    </div>
  </div>
</template>
