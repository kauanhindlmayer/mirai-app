<script setup lang="ts">
import { moveWikiPage as _moveWikiPage, listWikiPages } from '@/api/wiki-pages'
import { useDrawer } from '@/composables/useDialog'
import { useProjectStore } from '@/stores/project'
import { useWikiPageStore } from '@/stores/wiki-page'
import type { WikiPageSummary } from '@/types/wiki-page'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import type { TreeSelectionKeys } from 'primevue'
import type { TreeNode } from 'primevue/treenode'
import { computed, ref } from 'vue'

const store = useWikiPageStore()
const { wikiPage } = storeToRefs(store)
const { project } = storeToRefs(useProjectStore())

const { data: wikiPages } = useQuery({
  key: () => ['wiki-pages', project.value!.id],
  query: async () => listWikiPages(project.value!.id),
  placeholderData: [] as WikiPageSummary[],
})

const selectedKey = ref<TreeSelectionKeys | undefined>(undefined)
const nodes = computed(() => {
  return wikiPages.value.filter((page) => page.id !== wikiPage.value?.id).map(toNode)
})
const title = computed(() => `Move '${wikiPage.value?.title}'?`)
const isSaveButtonDisabled = computed(() => !selectedKey.value)

function toNode(page: WikiPageSummary): TreeNode {
  return {
    key: page.id,
    label: page.title,
    icon: 'pi pi-fw pi-book',
    children: page.subPages.map(toNode),
  }
}

const queryCache = useQueryCache()

const { mutate: moveWikiPage } = useMutation({
  mutation: async (_: MouseEvent) => {
    const [wikiPageId] = Object.keys(selectedKey.value!)
    return _moveWikiPage(project.value!.id, wikiPage.value!.id, {
      targetParentId: wikiPageId,
      targetPosition: 0,
    })
  },
  onSuccess() {
    queryCache.invalidateQueries({ key: ['wiki-pages', project.value!.id] })
    hideDrawer()
  },
})

const { isVisible, showDrawer, hideDrawer } = useDrawer()

defineExpose({
  showDrawer,
  hideDrawer,
})
</script>

<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    class="!w-full sm:!w-[36rem]"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">{{ title }}</span>
    </template>
    <Form class="flex flex-col h-full">
      <div class="flex-grow">
        <Tree
          v-model:selection-keys="selectedKey"
          :value="nodes"
          filter
          filter-placeholder="Search"
          selection-mode="single"
          meta-key-selection
        />
      </div>
      <div class="flex justify-end mt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="hideDrawer" />
        <Button type="submit" label="Move" :disabled="isSaveButtonDisabled" @click="moveWikiPage" />
      </div>
    </Form>
  </Drawer>
</template>

<style>
.p-dialog-content {
  height: calc(100% - 4rem);
  overflow-y: auto;
}
</style>
