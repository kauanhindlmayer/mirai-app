<script setup lang="ts">
import AppTag from '@/components/tags/AppTag.vue'
import ColorSelect from '@/components/tags/ColorSelect.vue'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { useTagStore } from '@/stores/tag'
import type { CreateTagRequest, Tag } from '@/types/tag'
import { getColorName } from '@/utils/tag'
import { storeToRefs } from 'pinia'
import type { DataTableRowEditSaveEvent } from 'primevue'
import { computed, onBeforeMount, ref } from 'vue'

const pageStore = usePageStore()
const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)
const tagStore = useTagStore()
const { tags } = storeToRefs(tagStore)

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

async function addTag() {
  await tagStore.createTag({
    name: newTag.value.name,
    description: newTag.value.description,
    color: newTag.value.color,
  })
  newTag.value = { name: '', description: '', color: '' }
  await tagStore.listTags()
}

async function updateTag(event: DataTableRowEditSaveEvent) {
  const tag = event.newData as Tag
  await tagStore.updateTag(tag.id, {
    name: tag.name,
    description: tag.description,
    color: tag.color,
  })
  await tagStore.listTags()
}

async function deleteTag() {
  await tagStore.deleteTag(selectedTags.value[0].id)
  selectedTags.value = []
  await tagStore.listTags()
}

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value!.name, route: `/projects/${project.value!.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value!.id}/boards` },
    { label: 'Tags', route: `/projects/${project.value!.id}/tags` },
  ])
}

onBeforeMount(() => {
  tagStore.listTags()
  pageStore.setTitle('Tags - Boards')
  setBreadcrumbs()
})
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
