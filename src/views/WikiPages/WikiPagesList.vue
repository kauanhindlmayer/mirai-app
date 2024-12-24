<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import { useWikiPageStore } from '@/stores/wiki-page'
import type { WikiPageSummary } from '@/types'
import { storeToRefs } from 'pinia'
import type { TreeSelectionKeys } from 'primevue'
import type { TreeNode } from 'primevue/treenode'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WikiPageDetail from './WikiPageDetail.vue'
import WikiPageForm from './WikiPageForm.vue'

const wikiPageStore = useWikiPageStore()
const { wikiPage, wikiPageStats } = storeToRefs(wikiPageStore)
const { isSidebarActive } = useLayout()

const route = useRoute()
const router = useRouter()

defineProps<{ isEditing?: boolean }>()

const nodes = computed(() => wikiPageStore.wikiPages.map(toNode))

function toNode(page: WikiPageSummary): TreeNode {
  return {
    key: page.id,
    label: page.title,
    icon: 'pi pi-fw pi-book',
    children: page.subPages.map(toNode),
  }
}

const selectedKey = ref<TreeSelectionKeys | undefined>(undefined)

watch(
  () => selectedKey.value,
  async () => {
    if (!selectedKey.value) return
    isCreating.value = false
    const [wikiPageId] = Object.keys(selectedKey.value)
    router.push({ name: 'wiki-pages', params: { wikiPageId } })
    await Promise.all([
      wikiPageStore.getWikiPage(wikiPageId),
      wikiPageStore.getWikiPageStats(wikiPageId),
    ])
  },
)

onBeforeMount(async () => {
  await wikiPageStore.listWikiPages()
  const wikiPageId = route.params.wikiPageId || wikiPageStore.wikiPages[0].id
  selectedKey.value = { [wikiPageId as string]: true }
})

const isCreating = ref(false)

function startCreation() {
  selectedKey.value = undefined
  wikiPageStore.resetWikiPage()
  isCreating.value = true
}

function stopCreation() {
  selectedKey.value = { [wikiPageStore.wikiPages[0].id as string]: true }
  isCreating.value = false
}
</script>

<template>
  <div class="flex gap-4">
    <div :class="[isSidebarActive ? 'w-1/5' : 'w-1/4']">
      <div class="card">
        <Tree v-model:selectionKeys="selectedKey" :value="nodes" filter selection-mode="single">
          <template #default="slotProps">
            <p class="max-w-52 truncate">{{ slotProps.node.label }}</p>
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
    <div :class="[isSidebarActive ? 'w-4/5' : 'w-3/4']">
      <WikiPageForm v-if="isCreating || isEditing" :wiki-page="wikiPage" @close="stopCreation" />
      <WikiPageDetail v-else-if="wikiPage" :wiki-page="wikiPage" :wiki-page-stats="wikiPageStats" />
      <ConfirmDialog style="width: 450px" />
    </div>
  </div>
</template>
