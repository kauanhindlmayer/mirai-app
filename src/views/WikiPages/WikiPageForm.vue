<script setup lang="ts">
import type { WikiPage } from '@/types'
import { useConfirm } from 'primevue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { wikiPage } = defineProps<{
  wikiPage: WikiPage | null
}>()

const confirm = useConfirm()
const router = useRouter()

const title = ref(wikiPage?.title)
const content = ref(wikiPage?.content)

const emit = defineEmits(['close'])

function close() {
  const hasContentNotChanged =
    title.value === wikiPage?.title || content.value === wikiPage?.content
  if (hasContentNotChanged) {
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
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex gap-2 mb-4">
          <InputText v-model="title" class="w-11/12" />
          <Button label="Close" severity="secondary" @click="close" />
          <Button label="Save" severity="secondary" />
        </div>
        <Editor v-model="content" editor-style="height: 320px" />
      </div>
    </div>
  </div>
</template>
