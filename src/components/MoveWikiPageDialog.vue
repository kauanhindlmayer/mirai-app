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
const header = computed(() => `Move '${wikiPage.value?.title}'?`)
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
  closeDialog()
}

const isVisible = ref(false)

function openDialog() {
  isVisible.value = true
}

function closeDialog() {
  isVisible.value = false
}

defineExpose({
  openDialog,
  closeDialog,
})
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    :header="header"
    :style="{
      width: '45rem',
      height: '98%',
      maxHeight: '98%',
    }"
    position="topright"
    :modal="true"
    :draggable="false"
  >
    <Form class="flex flex-col h-full">
      <div class="flex-grow">
        <Tree
          v-model:selection-keys="selectedKey"
          :value="nodes"
          filter
          selection-mode="single"
          meta-key-selection
        />
      </div>
      <div class="flex justify-end mt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="closeDialog" />
        <Button type="submit" label="Move" :disabled="isSaveButtonDisabled" @click="moveWikiPage" />
      </div>
    </Form>
  </Dialog>
</template>

<style>
.p-dialog-content {
  height: calc(100% - 4rem);
  overflow-y: auto;
}
</style>
