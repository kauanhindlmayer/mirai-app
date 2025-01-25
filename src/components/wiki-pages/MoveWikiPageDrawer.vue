<script setup lang="ts">
import { useWikiPageStore } from '@/stores/wiki-page'
import type { WikiPageSummary } from '@/types/wiki-page'
import { storeToRefs } from 'pinia'
import type { TreeSelectionKeys } from 'primevue'
import type { TreeNode } from 'primevue/treenode'
import { computed, ref } from 'vue'

const store = useWikiPageStore()
const { wikiPage } = storeToRefs(store)

const emit = defineEmits<{
  (event: 'move-wiki-page'): void
}>()

const selectedKey = ref<TreeSelectionKeys | undefined>(undefined)
const nodes = computed(() => store.wikiPages.map(toNode))
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

async function moveWikiPage() {
  const [wikiPageId] = Object.keys(selectedKey.value!)
  await store.moveWikiPage(wikiPage.value!.id, { targetParentId: wikiPageId, targetPosition: 0 })
  emit('move-wiki-page')
  closeDrawer()
}

const isVisible = ref(false)

function openDrawer() {
  isVisible.value = true
}

function closeDrawer() {
  isVisible.value = false
}

defineExpose({
  openDrawer,
  closeDrawer,
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
        <Button type="button" label="Cancel" severity="secondary" @click="closeDrawer" />
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
