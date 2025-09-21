<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import type { InputText } from 'primevue'
import { object, string, ValidationError } from 'yup'
import RetrospectiveItemComponent from '~/components/retrospectives/RetrospectiveItem.vue'
import type { RetrospectiveColumn, RetrospectiveItem } from '~/types/retrospective'
import { cacheKeys } from '~/utils/cache-keys'

const teamStore = useTeamStore()
const { teamId } = storeToRefs(teamStore)

const { retrospectiveId, column } = defineProps<{
  retrospectiveId: string
  column: RetrospectiveColumn
}>()

const items = ref<RetrospectiveItem[]>(column.items)

const isAddingItem = ref(false)
const newItemContent = ref('')
const validationError = ref('')

async function showNewItemInput() {
  isAddingItem.value = true
  await nextTick()
  newItemInputRef.value?.$el.focus()
}

function closeNewItemInput() {
  isAddingItem.value = false
  newItemContent.value = ''
  validationError.value = ''
}

const queryCache = useQueryCache()

const { mutate: createRetrospectiveItemFn } = useMutation({
  mutation: () =>
    createRetrospectiveItem(teamId.value!, retrospectiveId, column.id, newItemContent.value),
  onSuccess: () => {
    queryCache.invalidateQueries({
      key: cacheKeys.retrospectives.get(teamId.value!, retrospectiveId),
    })
    closeNewItemInput()
  },
})

const createRetrospectiveItemSchema = object({
  content: string()
    .required('Content is required')
    .min(3, 'Content must be at least 3 characters')
    .max(255, 'Content must be at most 255 characters'),
})

async function handleRetrospectiveItemCreation() {
  try {
    await createRetrospectiveItemSchema.validate({ content: newItemContent.value })
    validationError.value = ''
    createRetrospectiveItemFn()
  } catch (error) {
    if (error instanceof ValidationError) {
      validationError.value = error.errors[0]
    }
  }
}

async function clearValidationError() {
  validationError.value = ''
}

type InputTextInstance = InstanceType<typeof InputText> & {
  $el: HTMLElement
}
const newItemInputRef = useTemplateRef<InputTextInstance>('newItemInput')

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  closeNewItemInput()
})
</script>

<template>
  <div class="card !mb-4 !p-4 rounded-sm min-w-[250px]">
    <header class="text-lg">{{ column.title }}</header>

    <Button label="Add New Item" icon="pi pi-plus" class="my-2" text @click="showNewItemInput" />

    <div v-if="isAddingItem" @focusout="closeNewItemInput" class="mb-4">
      <div class="card flex flex-col mb-0!">
        <Textarea
          ref="newItemInput"
          v-model="newItemContent"
          auto-resize
          @keydown="clearValidationError"
          @keydown.enter.prevent="handleRetrospectiveItemCreation"
        />
        <Message v-if="validationError" severity="error" size="small" variant="simple">
          {{ validationError }}
        </Message>
        <p class="text-surface-600 dark:text-surface-200 leading-normal mt-4">
          {{ format(new Date(), "MMMM d, yyyy 'at' HH:mm") }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <RetrospectiveItemComponent
        v-for="item in items"
        :key="item.id"
        :retrospective-id="retrospectiveId"
        :column-id="column.id"
        :item="item"
      />
    </div>
  </div>
</template>
