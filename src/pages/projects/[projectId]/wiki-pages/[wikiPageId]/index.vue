<script setup lang="ts">
import { useConfirm, type Menu, type TreeSelectionKeys } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import type { TreeNode } from 'primevue/treenode'
import MoveWikiPageDrawer from '~/components/wiki-pages/MoveWikiPageDrawer.vue'

const pageStore = usePageStore()
pageStore.setTitle('Wiki Pages - Overview')

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const confirm = useConfirm()
const toast = useAppToast()
const router = useRouter()

const { wikiPage } = useWikiPage()
const { wikiPages, isLoading } = useWikiPages()

const { isEditing, isAdding } = defineProps<{
  isEditing?: boolean
  isAdding?: boolean
}>()

const expandedKeys = ref<{ [key: string]: boolean }>({})
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
    if (!selectedKey.value || isEditing) return
    const [wikiPageId] = Object.keys(selectedKey.value)
    router.push(`/projects/${project.value.id}/wiki-pages/${wikiPageId}`)
  },
)

onMounted(async () => {
  setBreadcrumbs()
  selectWikiPage()
})

const route = useRoute('/projects/[projectId]/wiki-pages/[wikiPageId]/')

watch([() => wikiPages.value, () => route.params.wikiPageId], selectWikiPage)

function selectWikiPage() {
  if (!wikiPages.value.length || isAdding) return
  const { wikiPageId } = route.params
  const parentWikiPage = wikiPages.value.find(
    (page) => page.id === wikiPageId || page.subPages.some((subPage) => subPage.id === wikiPageId),
  )
  const wikiPage = parentWikiPage?.subPages.find((subPage) => subPage.id === wikiPageId)
  const selectedWikiPageId = wikiPage?.id || parentWikiPage?.id || wikiPages.value[0].id
  expandedKeys.value = parentWikiPage ? { [parentWikiPage.id]: true } : {}
  selectedKey.value = { [selectedWikiPageId]: true }
}

function openNewPageForm() {
  selectedKey.value = undefined
  expandedKeys.value = {}
  router.push(`/projects/${project.value.id}/wiki-pages/new`)
}

function closeForm(wikiPageId?: string) {
  parentWikiPageId.value = undefined
  if (wikiPageId) {
    router.push(`/projects/${project.value.id}/wiki-pages/${wikiPageId}`)
    selectedKey.value = { [wikiPageId]: true }
  } else {
    router.push(`/projects/${project.value.id}/wiki-pages`)
  }
}
const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Add Sub-Page', icon: 'pi pi-plus', command: addSubPage },
  { label: 'Copy Page Path', icon: 'pi pi-copy', command: copyPagePath },
  { label: 'Move Page', icon: 'pi pi-arrow-right', command: openMoveWikiPageDrawer },
  { label: 'Edit', icon: 'pi pi-pencil', command: redirectToEditPage },
  { label: 'Delete', icon: 'pi pi-trash', command: confirmDeleteWikiPage },
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
  navigator.clipboard.writeText(`/projects/${project.value.id}/wiki-pages/${wikiPage.value?.id}`)
  toast.showSuccess({ detail: 'Page path copied to clipboard' })
}

const moveWikiPageDrawerRef =
  useTemplateRef<InstanceType<typeof MoveWikiPageDrawer>>('moveWikiPageDrawer')

function openMoveWikiPageDrawer() {
  moveWikiPageDrawerRef.value?.showDrawer()
}

function redirectToEditPage() {
  router.push(`/projects/${project.value.id}/wiki-pages/${wikiPage.value!.id}/edit`)
}

const queryCache = useQueryCache()

const { mutate: deleteWikiPageFn } = useMutation({
  mutation: () => deleteWikiPage(project.value.id, wikiPage.value!.id),
  onSuccess: async () => {
    await queryCache.invalidateQueries({ key: ['wiki-pages', project.value.id] })
    toast.showSuccess({ detail: 'Wiki page deleted successfully' })
    router.push(`/projects/${project.value.id}/wiki-pages`)
  },
  onError: displayError,
})

function confirmDeleteWikiPage() {
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
    accept: deleteWikiPageFn,
  })
}

function openInNewTab() {
  window.open(`/projects/${project.value.id}/wiki-pages/${wikiPage.value!.id}`)
}

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Overview', route: `/projects/${project.value.id}/wiki-pages` },
    { label: 'Wiki Pages', route: `/projects/${project.value.id}/wiki-pages` },
  ])
}
</script>

<template>
  <div class="flex gap-4">
    <div class="w-16rem">
      <div class="card !p-2">
        <Tree
          v-model:selection-keys="selectedKey"
          v-model:expanded-keys="expandedKeys"
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
      <WikiPageDetail @delete-wiki-page="confirmDeleteWikiPage" v-else />
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
