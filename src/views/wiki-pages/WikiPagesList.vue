<script setup lang="ts">
import { listWikiPages } from '@/api/wiki-pages'
import MoveWikiPageDrawer from '@/components/wiki-pages/MoveWikiPageDrawer.vue'
import { useAppToast } from '@/composables/useAppToast'
import { usePageStore } from '@/stores/page'
import { useProjectStore } from '@/stores/project'
import { useWikiPageStore } from '@/stores/wiki-page'
import type { WikiPageSummary } from '@/types/wiki-page'
import { useQuery } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import { useConfirm, type Menu, type TreeSelectionKeys } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import type { TreeNode } from 'primevue/treenode'
import { computed, onBeforeMount, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WikiPageDetail from './WikiPageDetail.vue'
import WikiPageForm from './WikiPageForm.vue'

const pageStore = usePageStore()
pageStore.setTitle('Wiki Pages - Overview')

const store = useWikiPageStore()
const { wikiPage } = storeToRefs(store)
const { project } = storeToRefs(useProjectStore())

const confirm = useConfirm()
const toast = useAppToast()
const route = useRoute()
const router = useRouter()

const { isEditing } = defineProps<{ isEditing?: boolean }>()

const selectedKey = ref<TreeSelectionKeys | undefined>(undefined)
const nodes = computed(() => wikiPages.value.map((page, index) => toNode(page, index === 0)))

function toNode(page: WikiPageSummary, isRoot: boolean = false): TreeNode {
  return {
    key: page.id,
    label: page.title,
    icon: isRoot ? 'pi pi-fw pi-home' : 'pi pi-fw pi-book',
    children: page.subPages.map((subPage) => toNode(subPage)),
  }
}

watch(
  () => selectedKey.value,
  async () => {
    if (!selectedKey.value) return
    isAdding.value = false
    const [wikiPageId] = Object.keys(selectedKey.value!)
    router.push({ name: 'wiki-pages', params: { wikiPageId } })
  },
)

const { data: wikiPages, isLoading } = useQuery({
  key: () => ['wiki-pages', project.value!.id],
  query: async () => {
    const wikiPages = await listWikiPages(project.value!.id)
    const wikiPageId = route.params.wikiPageId || wikiPages[0].id
    selectedKey.value = { [wikiPageId as string]: true }
    return wikiPages
  },
  placeholderData: [] as WikiPageSummary[],
})

onBeforeMount(setBreadcrumbs)

function setBreadcrumbs() {
  const projectName = project.value!.name
  const projectId = project.value!.id
  pageStore.setBreadcrumbs([
    { label: projectName, route: `/projects/${projectId}/summary` },
    { label: 'Overview', route: `/projects/${projectId}/wiki-pages` },
    { label: 'Wiki', route: `/projects/${projectId}/wiki-pages` },
  ])
}

const isAdding = ref(false)

function openNewPageForm() {
  isAdding.value = true
  selectedKey.value = undefined
  router.push({ name: 'wiki-pages', params: { wikiPageId: '' } })
  store.resetWikiPage()
}

function closeForm() {
  isAdding.value = false
  parentWikiPageId.value = ''
  if (isEditing) {
    router.push(`/projects/${project.value!.id}/wiki-pages/${wikiPage.value!.id}`)
  } else {
    selectedKey.value = { [store.wikiPages[0].id as string]: true }
  }
}

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Add Sub-Page', icon: 'pi pi-plus', command: addSubPage },
  { label: 'Copy Page Path', icon: 'pi pi-copy', command: copyPagePath },
  { label: 'Move Page', icon: 'pi pi-arrow-right', command: openMoveWikiPageDrawer },
  { label: 'Edit', icon: 'pi pi-pencil', command: redirectToEditPage },
  { label: 'Delete', icon: 'pi pi-trash', command: deleteWikiPage },
  { label: 'Open in New Tab', icon: 'pi pi-external-link', command: openInNewTab },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

const parentWikiPageId = ref<string | undefined>(undefined)

function addSubPage() {
  parentWikiPageId.value = wikiPage.value!.id
  openNewPageForm()
}

function copyPagePath() {
  navigator.clipboard.writeText(`/projects/${project.value?.id}/wiki-pages/${wikiPage.value?.id}`)
  toast.showSuccess({ detail: 'Page path copied to clipboard' })
}

const moveWikiPageDrawerRef =
  useTemplateRef<InstanceType<typeof MoveWikiPageDrawer>>('moveWikiPageDrawer')

function openMoveWikiPageDrawer() {
  moveWikiPageDrawerRef.value?.showDrawer()
}

function redirectToEditPage() {
  router.push(`/projects/${project.value!.id}/wiki-pages/${wikiPage.value!.id}/edit`)
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
  window.open(`/projects/${project.value?.id}/wiki-pages/${wikiPage.value!.id}`)
}
</script>

<template>
  <div class="flex gap-4">
    <div class="w-16rem">
      <div class="card p-2">
        <Tree
          v-model:selection-keys="selectedKey"
          :value="nodes"
          :loading="isLoading"
          filter
          selection-mode="single"
          meta-key-selection
        >
          <template #default="slotProps">
            <div class="flex justify-between items-center group ml-1">
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
                v-tooltip.bottom="'More Options'"
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
          @click="openNewPageForm"
        />
      </div>
    </div>
    <div class="flex-1">
      <WikiPageForm
        v-if="isAdding || isEditing"
        :parent-wiki-page-id="parentWikiPageId"
        @close="closeForm"
      />
      <WikiPageDetail @delete-wiki-page="deleteWikiPage" v-else />
    </div>
    <MoveWikiPageDrawer ref="moveWikiPageDrawer" />
    <ConfirmDialog style="width: 450px" />
  </div>
</template>

<style>
.p-tree-node-label {
  width: 100%;
}
</style>
