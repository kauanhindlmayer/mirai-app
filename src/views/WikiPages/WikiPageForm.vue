<script setup lang="ts">
import { useWikiPageStore } from '@/stores/wiki-page'
import type { WikiPage } from '@/types/wiki-page'
import { useConfirm } from 'primevue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const { wikiPage, parentWikiPageId } = defineProps<{
  wikiPage: WikiPage | null
  parentWikiPageId?: string
}>()

const confirm = useConfirm()
const router = useRouter()
const store = useWikiPageStore()

const isEditing = computed(() => !!wikiPage)

const title = ref<string>(wikiPage?.title || '')
const content = ref<string>(wikiPage?.content || '')

const emit = defineEmits(['close'])

const isWikiPageUnchanged = computed(() => {
  return (
    (isEditing.value && title.value === wikiPage?.title && content.value === wikiPage?.content) ||
    (!isEditing.value && !title.value && !content.value)
  )
})

const isSaveButtonDisabled = computed(() => !title.value || !content.value)

function close() {
  if (isWikiPageUnchanged.value) {
    closeForm()
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
    reject: closeForm,
  })
}

function closeForm() {
  if (wikiPage) {
    router.back()
  } else {
    emit('close')
  }
}

async function save() {
  if (isEditing.value) {
    await store.updateWikiPage(wikiPage!.id, { title: title.value, content: content.value })
    store.wikiPage!.title = title.value
    store.wikiPage!.content = content.value
  } else {
    await store.createWikiPage({ title: title.value, content: content.value, parentWikiPageId })
  }
  await store.listWikiPages()
  closeForm()
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
