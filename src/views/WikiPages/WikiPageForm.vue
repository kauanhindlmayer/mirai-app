<script setup lang="ts">
import { useWikiPageStore } from '@/stores/wiki-page'
import type { WikiPage } from '@/types'
import { useConfirm } from 'primevue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const { wikiPage, parentWikiPageId } = defineProps<{
  wikiPage: WikiPage | null
  parentWikiPageId?: string
}>()

const confirm = useConfirm()
const router = useRouter()
const wikiPageStore = useWikiPageStore()

const title = ref<string>(wikiPage?.title || '')
const content = ref<string>(wikiPage?.content || '')

const emit = defineEmits(['close'])

const isWikiPageUnchanged = computed(() => {
  return title.value === wikiPage?.title && content.value === wikiPage?.content
})

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
  // Save wiki page
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex gap-2 mb-4">
          <InputText v-model="title" class="w-11/12" />
          <Button label="Close" severity="secondary" @click="close" />
          <Button label="Save" severity="secondary" :disabled="isWikiPageUnchanged" @click="save" />
        </div>
        <Editor v-model="content" editor-style="height: 320px" />
      </div>
    </div>
  </div>
</template>
