<script setup lang="ts">
import { createWikiPage, updateWikiPage } from '@/api/wiki-pages'
import { displayError } from '@/composables/displayError'
import { useAppToast } from '@/composables/useAppToast'
import { useWikiPage } from '@/queries/wiki-pages'
import { useProjectStore } from '@/stores/project'
import { useMutation, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue'
import { computed, ref } from 'vue'

const confirm = useConfirm()
const { project } = storeToRefs(useProjectStore())

const { parentWikiPageId } = defineProps<{
  parentWikiPageId?: string
}>()

const emit = defineEmits<{ (event: 'close', wikiPageId: string): void }>()

const { wikiPage } = useWikiPage()

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
    emit('close', wikiPage.value!.id)
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
      emit('close', wikiPage.value!.id)
    },
  })
}

const toast = useAppToast()
const queryCache = useQueryCache()

const { mutate: createWikiPageFn } = useMutation({
  mutation: () =>
    createWikiPage(project.value.id, {
      title: title.value,
      content: content.value,
      parentWikiPageId,
    }),
  onSuccess: async (wikiPageId: string) => {
    queryCache.invalidateQueries({ key: ['wiki-pages', project.value.id] })
    toast.showSuccess({ detail: 'Wiki page created successfully' })
    emit('close', wikiPageId)
  },
  onError: displayError,
})

const { mutate: updateWikiPageFn } = useMutation({
  mutation: () =>
    updateWikiPage(project.value.id, wikiPage.value!.id, {
      title: title.value,
      content: content.value,
    }),
  onSuccess: async () => {
    queryCache.invalidateQueries({ key: ['wiki-pages', project.value.id] })
    toast.showSuccess({ detail: 'Wiki page updated successfully' })
    emit('close', wikiPage.value!.id)
  },
  onError: displayError,
})

function saveWikiPage() {
  if (isEditing.value) {
    updateWikiPageFn()
  } else {
    createWikiPageFn()
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
          <Button
            label="Save"
            severity="secondary"
            :disabled="isSaveButtonDisabled"
            @click="saveWikiPage"
          />
        </div>
        <Editor v-model="content" editor-style="height: 320px" />
      </div>
    </div>
  </div>
</template>
