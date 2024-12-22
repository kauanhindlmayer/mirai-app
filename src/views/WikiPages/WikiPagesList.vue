<script setup lang="ts">
import { useWikiPageStore } from '@/stores/wiki-page'
import type { WikiPageSummary } from '@/types'
import { storeToRefs } from 'pinia'
import type { TreeSelectionKeys } from 'primevue'
import type { TreeNode } from 'primevue/treenode'
import { computed, onBeforeMount, ref, watchEffect } from 'vue'
import WikiPageDetail from './WikiPageDetail.vue'

const wikiPageStore = useWikiPageStore()
const { wikiPage, wikiPageStats } = storeToRefs(wikiPageStore)

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

watchEffect(async () => {
  if (!selectedKey.value) return
  const [wikiPageId] = Object.keys(selectedKey.value as object)
  await wikiPageStore.getWikiPage(wikiPageId)
  await wikiPageStore.getWikiPageStats(wikiPageId)
})

onBeforeMount(async () => {
  await wikiPageStore.listWikiPages()
  selectedKey.value = { [wikiPageStore.wikiPages[0].id]: true }
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-3">
      <div class="card">
        <Tree v-model:selectionKeys="selectedKey" :value="nodes" filter selection-mode="single">
        </Tree>
        <Button label="New Page" icon="pi pi-plus" variant="text" class="w-full mt-4" />
      </div>
    </div>
    <div class="col-span-9">
      <WikiPageDetail v-if="wikiPage" :wiki-page="wikiPage" :wiki-page-stats="wikiPageStats" />
    </div>
  </div>
</template>
