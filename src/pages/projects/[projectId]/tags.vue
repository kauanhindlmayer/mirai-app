<script setup lang="ts">
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { debouncedRef } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import type { DataTableRowEditSaveEvent } from 'primevue'
import { onBeforeMount, ref } from 'vue'
import { createTag, deleteTag, listTags, updateTag } from '~/api/tags'
import { displayError } from '~/composables/displayError'
import { usePageStore } from '~/stores/page'
import { useProjectStore } from '~/stores/project'
import type { CreateTagRequest, Tag } from '~/types/tag'
import { getColorName } from '~/utils/tag'

const pageStore = usePageStore()
pageStore.setTitle('Tags - Boards')

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const selectedTags = ref<Tag[]>([])
const editingRows = ref([])

const searchTerm = ref('')
const debouncedSearchTerm = debouncedRef(searchTerm, 500)
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

const { mutate: deleteTagFn } = useMutation({
  mutation: (_: MouseEvent) => deleteTag(project.value.id, selectedTags.value[0].id),
  onSuccess: async () => {
    await queryCache.invalidateQueries({ key: ['tags'] })
    selectedTags.value = []
  },
  onError: displayError,
})

const { data: tags, isLoading } = useQuery({
  key: () => ['tags', debouncedSearchTerm.value],
  query: () => listTags(project.value.id, debouncedSearchTerm.value),
  placeholderData: (previousData) => previousData,
})

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
    { label: 'Tags', route: `/projects/${project.value.id}/tags` },
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
              @click="deleteTagFn"
            />
          </div>
        </div>
        <div class="flex items-center gap-4 mb-4">
          <InputText v-model="newTag.name" placeholder="Name" />
          <InputText v-model="newTag.description" placeholder="Description" />
          <ColorSelect v-model="newTag.color" />
          <Button label="Add Tag" icon="pi pi-plus" :disabled="!newTag.name" @click="addTag" />
        </div>
        <DataTable
          v-model:editingRows="editingRows"
          v-model:selection="selectedTags"
          :value="tags"
          :loading="isLoading"
          edit-mode="row"
          data-key="id"
          table-style="min-width: 50rem"
          @row-edit-save="updateTagFn"
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
