<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { useWikiPageStore } from '@/stores/wiki-page'
import type { WikiPageSummary } from '@/types/wiki-page'
import { storeToRefs } from 'pinia'
import { useConfirm, type Menu, type TreeSelectionKeys } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import type { TreeNode } from 'primevue/treenode'
import { computed, onBeforeMount, ref, toRef, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WikiPageDetail from './WikiPageDetail.vue'
import WikiPageForm from './WikiPageForm.vue'

const project = toRef(useProjectStore(), 'project')
const store = useWikiPageStore()
const { wikiPage, wikiPageStats } = storeToRefs(store)

const confirm = useConfirm()
const route = useRoute()
const router = useRouter()

const { isEditing } = defineProps<{ isEditing?: boolean }>()

const nodes = computed(() => store.wikiPages.map(toNode))

function toNode(page: WikiPageSummary): TreeNode {
  return {
    key: page.id,
    label: page.title,
    icon: 'pi pi-fw pi-book',
    children: page.subPages.map(toNode),
  }
}

const selectedKey = ref<TreeSelectionKeys | undefined>(undefined)
const selectedWikiPageId = ref('')

watch(
  () => selectedKey.value,
  async () => {
    if (!selectedKey.value) {
      router.push({ name: 'wiki-pages', params: { wikiPageId: '' } })
      return
    }
    isFormVisible.value = false
    const [wikiPageId] = Object.keys(selectedKey.value)
    selectedWikiPageId.value = wikiPageId
    router.push({ name: 'wiki-pages', params: { wikiPageId } })
    await Promise.all([store.getWikiPage(wikiPageId), store.getWikiPageStats(wikiPageId)])
  },
)

onBeforeMount(async () => {
  await store.listWikiPages()
  const wikiPageId = route.params.wikiPageId || store.wikiPages[0].id
  selectedKey.value = { [wikiPageId as string]: true }
})

watch(
  () => isEditing,
  (value) => {
    isFormVisible.value = value
  },
)

const isFormVisible = ref(isEditing)

function startCreation() {
  selectedKey.value = undefined
  store.resetWikiPage()
  isFormVisible.value = true
}

function stopCreation() {
  selectedKey.value = { [store.wikiPages[0].id as string]: true }
  isFormVisible.value = false
}

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Add Sub-Page', icon: 'pi pi-plus', command: startCreation },
  { label: 'Copy Page Path', icon: 'pi pi-copy', disabled: true },
  { label: 'Move Page', icon: 'pi pi-arrow-right', disabled: true },
  { label: 'Edit', icon: 'pi pi-pencil', command: redirectToEditPage },
  { label: 'Delete', icon: 'pi pi-trash', command: deleteWikiPage },
  { label: 'Open in New Tab', icon: 'pi pi-external-link', command: openInNewTab },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

function redirectToEditPage() {
  router.push(`/projects/${project.value?.id}/wiki-pages/${selectedWikiPageId.value}/edit`)
  isFormVisible.value = true
}

function deleteWikiPage() {
  confirm.require({
    header: `Delete '${wikiPage.value?.title}'?`,
    message:
      `'${wikiPage.value?.title}' page and its sub-pages (if any) will be deleted.` +
      'Are you sure you want to delete?',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      await store.deleteWikiPage(wikiPage.value!.id)
      await store.listWikiPages()
      selectedKey.value = { [store.wikiPages[0].id as string]: true }
    },
  })
}

function openInNewTab() {
  window.open(`/projects/${project.value?.id}/wiki-pages/${selectedWikiPageId.value}`)
}
</script>

<template>
  <div class="flex gap-4">
    <div class="w-16rem">
      <div class="card p-2">
        <Tree
          v-model:selectionKeys="selectedKey"
          :value="nodes"
          filter
          selection-mode="single"
          meta-key-selection
        >
          <template #default="slotProps">
            <div class="flex justify-between items-center group">
              <p class="max-w-48 truncate">
                {{ slotProps.node.label }}
              </p>
              <Button
                icon="pi pi-ellipsis-v"
                severity="secondary"
                class="group-hover:visible"
                :class="{
                  visible: selectedKey && selectedKey[slotProps.node.key],
                  invisible: !(selectedKey && selectedKey[slotProps.node.key]),
                }"
                text
                rounded
                @click="toggleMenuItems"
              />
              <Menu ref="menu" popup :model="menuItems" />
            </div>
          </template>
        </Tree>
        <Button
          label="New Page"
          icon="pi pi-plus"
          variant="text"
          class="w-full mt-4"
          @click="startCreation"
        />
      </div>
    </div>
    <div class="flex-1">
      <WikiPageForm v-if="isFormVisible" :wiki-page="wikiPage" @close="stopCreation" />
      <WikiPageDetail v-else-if="wikiPage" :wiki-page="wikiPage" :wiki-page-stats="wikiPageStats" />
    </div>
    <ConfirmDialog style="width: 450px" />
  </div>
</template>

<style>
.p-tree-node-label {
  width: 100%;
}
</style>
