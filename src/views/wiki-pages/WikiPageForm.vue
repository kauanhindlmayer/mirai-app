<script setup lang="ts">
import { useWikiPageStore } from '@/stores/wiki-page'
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue'
import { computed, ref } from 'vue'

const confirm = useConfirm()
const store = useWikiPageStore()
const { wikiPage } = storeToRefs(store)

const { parentWikiPageId } = defineProps<{ parentWikiPageId?: string }>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const title = ref<string>(wikiPage.value?.title || '')
const content = ref<string>(wikiPage.value?.content || '')

const isEditing = computed(() => !!wikiPage.value)
const isSaveButtonDisabled = computed(() => !title.value || !content.value)
const isWikiPageUnchanged = computed(() => {
  const isEmpty = !title.value && !content.value
  const isSameContent =
    title.value === wikiPage.value?.title && content.value === wikiPage.value?.content
  return isEmpty || isSameContent
})

function close() {
  if (isWikiPageUnchanged.value) {
    emit('close')
    return
  }
  confirm.require({
    header: 'Unsaved Changes',
    message:
      'You have unsaved changes made to this page which will be lost if you navigate away. ' +
      'Would you like to continue editing?',
    rejectProps: {
      label: 'Discard',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Continue Editing',
      severity: 'primary',
    },
    reject: () => {
      emit('close')
    },
  })
}

async function save() {
  if (isEditing.value) {
    await store.updateWikiPage(wikiPage.value!.id, { title: title.value, content: content.value })
    await store.getWikiPage(wikiPage.value!.id)
  } else {
    await store.createWikiPage({ title: title.value, content: content.value, parentWikiPageId })
  }
  await store.listWikiPages()
  emit('close')
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex gap-2 mb-4">
          <InputText v-model="title" class="w-11/12" />
          <Button label="Close" severity="secondary" @click="close" />
          <Button
            label="Save"
            severity="secondary"
            :disabled="isSaveButtonDisabled"
            @click="save"
          />
        </div>
        <Editor v-model="content" editor-style="height: 320px" />
      </div>
    </div>
  </div>
</template>
