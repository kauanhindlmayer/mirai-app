<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import type { Popover } from 'primevue'
import Draggable from 'vuedraggable/src/vuedraggable'
import { mixed, object, string } from 'yup'
import { createWorkItem } from '~/api/work-items'
import type { Card, Column, DraggableEvent, MoveCardRequest } from '~/types/board'
import { WorkItemType, type CreateWorkItemRequest } from '~/types/work-item'
import { formatEnumOptions } from '~/utils'

const { boardId, column } = defineProps<{
  boardId: string
  column: Column
}>()

const cards = ref<Card[]>([...column.cards])

watch(
  () => column.cards,
  (newCards) => {
    cards.value = [...newCards]
  },
)

const teamStore = useTeamStore()
const { teamId } = storeToRefs(teamStore)

type MoveCardMutationPayload = {
  columnId: string
  cardId: string
  request: MoveCardRequest
}

const queryCache = useQueryCache()

const { mutate: moveCardFn } = useMutation({
  mutation: (payload: MoveCardMutationPayload) =>
    moveCard(teamId.value!, boardId, payload.columnId, payload.cardId, payload.request),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['board', boardId] })
  },
  onError: displayError,
})

async function onChange(event: DraggableEvent<Card>) {
  const { moved, added } = event

  if (moved) {
    const card = moved.element
    moveCardFn({
      columnId: card.columnId,
      cardId: card.id,
      request: {
        targetColumnId: column.id,
        targetPosition: moved.newIndex,
      },
    })
  }

  if (added) {
    const card = added.element
    moveCardFn({
      columnId: card.columnId,
      cardId: card.id,
      request: {
        targetColumnId: column.id,
        targetPosition: added.newIndex,
      },
    })
  }
}

const initialValues: CreateWorkItemRequest = {
  title: '',
  type: WorkItemType.UserStory,
  assignedTeamId: teamId.value!,
}

const form = ref<CreateWorkItemRequest>({ ...initialValues })

const createWorkItemSchema = object({
  title: string().required('Title is a required field'),
  type: mixed<WorkItemType>().oneOf(Object.values(WorkItemType), 'Type is a required field'),
})

const resolver = ref(yupResolver(createWorkItemSchema))

const popover = useTemplateRef<InstanceType<typeof Popover>>('popover')

function togglePopover(event: Event) {
  popover.value?.toggle(event)
}

function hidePopover() {
  popover.value?.hide()
  Object.assign(form.value, initialValues)
}

const workItemTypes = formatEnumOptions(WorkItemType)

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const { mutate: createWorkItemFn, isLoading } = useMutation({
  mutation: () => createWorkItem(project.value.id, form.value),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['work-items', project.value.id] })
    queryCache.invalidateQueries({ key: ['board', boardId] })
    hidePopover()
  },
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  createWorkItemFn()
}
</script>

<template>
  <div class="card !p-4 rounded-sm min-w-[250px] max-w-[300px]">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <h2 class="text-lg">{{ column.name }}</h2>
        <i
          v-if="column.definitionOfDone"
          class="pi pi-info-circle"
          v-tooltip.bottom="column.definitionOfDone"
        />
      </div>
      <div v-if="column.wipLimit">
        <span
          :class="[
            column.cards.length > column.wipLimit ? 'text-red-700' : 'text-green-700',
            'text-xl',
          ]"
        >
          {{ column.cards.length }}
        </span>
        / {{ column.wipLimit }}
      </div>
    </div>

    <div v-if="column.isDefault" class="mb-3">
      <Button
        icon="pi pi-plus"
        label="New item"
        outlined
        size="small"
        class="w-full"
        @click="togglePopover"
      />
      <Popover ref="popover">
        <Form
          class="flex items-center gap-2 mt-2"
          :initial-values="form"
          :resolver
          @submit="onFormSubmit"
        >
          <FormField v-slot="$field" name="template" class="flex flex-col">
            <label for="template" class="font-medium text-surface-900 dark:text-surface-0">
              Template
              <small class="text-red-400">*</small>
            </label>
            <Select
              v-model="form.type"
              class="w-36"
              :options="workItemTypes"
              option-label="label"
              option-value="value"
              placeholder="Select a template"
            />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
              {{ $field.error?.message }}
            </Message>
          </FormField>

          <FormField v-slot="$field" name="title">
            <label for="title" class="font-medium text-surface-900 dark:text-surface-0">
              Title <small class="text-red-400">*</small>
            </label>
            <InputText input-id="title" v-model="form.title" class="w-full" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
              {{ $field.error?.message }}
            </Message>
          </FormField>

          <Button type="submit" label="Add to Top" class="mt-6" :disabled="isLoading" />
        </Form>
      </Popover>
    </div>

    <Draggable v-model="cards" group="cards" :animation="150" item-key="id" @change="onChange">
      <template #item="{ element: card }: { element: Card }">
        <div>
          <BoardCard :card="card" />
        </div>
      </template>
    </Draggable>
  </div>
</template>
