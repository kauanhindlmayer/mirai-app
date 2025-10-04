<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import {
  addTagToWorkItem,
  addWorkItemComment,
  createWorkItemLink,
  deleteWorkItemComment,
  deleteWorkItemLink,
  removeTagFromWorkItem,
  updateWorkItem,
  updateWorkItemComment,
} from '~/api/work-items'
import type { Tag } from '~/types/tag'
import {
  ValueArea,
  WorkItemStatus,
  type CreateWorkItemLinkRequest,
  type TagBriefResponse,
} from '~/types/work-item'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const router = useRouter()
const route = useRoute()

const workItemId = computed(() => route.query.workItemId as string)

const workItemStatuses = formatEnumOptions(WorkItemStatus)
const valueAreas = formatEnumOptions(ValueArea)

const workItemLastUpdated = computed(() =>
  format(workItem.value!.updatedAtUtc ?? workItem.value!.createdAtUtc, 'MMM d'),
)

const { data: workItem } = useQuery({
  key: () => ['work-items', workItemId.value],
  query: () => getWorkItem(project.value.id, workItemId.value),
  enabled: () => !!workItemId.value,
})

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems: MenuItem[] = [
  { label: 'Change Type', icon: 'pi pi-pencil', disabled: true },
  { label: 'Create Copy of Work Item', icon: 'pi pi-clone', disabled: true },
  { label: 'Copy Link', icon: 'pi pi-copy', disabled: true },
  { label: 'Delete', icon: 'pi pi-trash', disabled: true },
]

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

function copyToClipboard() {
  navigator.clipboard.writeText(workItem.value!.title)
}

const { mutate: removeTagFromWorkItemFn } = useMutation({
  mutation: (tag: TagBriefResponse) =>
    removeTagFromWorkItem(project.value.id, workItemId.value!, tag.name),
  onSuccess() {
    queryCache.invalidateQueries({ key: ['work-items'] })
    toast.showSuccess({ detail: 'Tag removed successfully' })
  },
})

const selectedTag = ref<Tag | null>(null)
const showTagSelector = ref(false)
const tagSelectorRef = useTemplateRef<HTMLDivElement>('tagSelectorRef')

onClickOutside(
  tagSelectorRef,
  (event) => {
    const target = event.target as HTMLElement
    if (target.closest('.p-autocomplete-overlay')) return
    showTagSelector.value = false
  },
  { ignore: ['.p-autocomplete-overlay'] },
)

const { mutate: addTagToWorkItemFn } = useMutation({
  mutation: (tag: Tag) => addTagToWorkItem(project.value.id, workItemId.value!, tag.name),
  onSuccess() {
    queryCache.invalidateQueries({ key: ['work-items'] })
    queryCache.invalidateQueries({ key: ['board'] })
    toast.showSuccess({ detail: 'Tag added successfully' })
    selectedTag.value = null
  },
})

watch(selectedTag, (tag) => {
  if (!tag) return
  const tagExists = workItem.value?.tags.some((t) => t.name === tag.name)
  if (tagExists) {
    toast.showError({ detail: 'Tag already added to work item' })
    selectedTag.value = null
    return
  }
  addTagToWorkItemFn(tag)
  showTagSelector.value = false
})

const toast = useAppToast()
const queryCache = useQueryCache()

const { mutate: updateWorkItemFn } = useMutation({
  mutation: (_: Event) => updateWorkItem(project.value.id, workItemId.value!, workItem.value!),
  onSuccess() {
    queryCache.invalidateQueries({ key: ['board'] })
    queryCache.invalidateQueries({ key: ['work-items'] })
    toast.showSuccess({ detail: 'Work Item updated successfully' })
    hideDialog()
  },
})

const { mutate: addCommentFn } = useMutation({
  mutation: (content: string) =>
    addWorkItemComment(project.value.id, workItemId.value!, { content }),
  onSuccess() {
    queryCache.invalidateQueries({ key: ['work-items'] })
    toast.showSuccess({ detail: 'Comment added successfully' })
  },
})

const { mutate: deleteCommentFn } = useMutation({
  mutation: (commentId: string) =>
    deleteWorkItemComment(project.value.id, workItemId.value!, commentId),
  onSuccess() {
    queryCache.invalidateQueries({ key: ['work-items'] })
    toast.showSuccess({ detail: 'Comment deleted successfully' })
  },
})

const { mutate: updateCommentFn } = useMutation({
  mutation: ({ commentId, content }: { commentId: string; content: string }) =>
    updateWorkItemComment(project.value.id, workItemId.value!, commentId, { content }),
  onSuccess() {
    queryCache.invalidateQueries({ key: ['work-items'] })
    toast.showSuccess({ detail: 'Comment updated successfully' })
  },
})

const { mutate: createLinkFn } = useMutation({
  mutation: (request: CreateWorkItemLinkRequest) =>
    createWorkItemLink(project.value.id, workItemId.value!, request),
  onSuccess() {
    queryCache.invalidateQueries({ key: ['work-items'] })
    toast.showSuccess({ detail: 'Link created successfully' })
  },
})

const { mutate: deleteLinkFn } = useMutation({
  mutation: (linkId: string) => deleteWorkItemLink(project.value.id, workItemId.value!, linkId),
  onSuccess() {
    queryCache.invalidateQueries({ key: ['work-items'] })
    toast.showSuccess({ detail: 'Link removed successfully' })
  },
})

watch(
  () => workItemId.value,
  (newWorkItemId) => {
    if (!newWorkItemId) return
    showDialog()
  },
)

onBeforeMount(() => {
  if (!workItemId.value) return
  showDialog()
})

const { isVisible, showDialog } = useDialog()

function hideDialog() {
  const { workItemId, ...rest } = route.query
  router.replace({ query: rest })
  isVisible.value = false
}

defineExpose({
  showDialog,
  hideDialog,
})
</script>

<template>
  <Dialog
    v-if="workItem"
    class="work-item-dialog"
    v-model:visible="isVisible"
    modal
    maximizable
    :style="{ width: '75vw', height: '85vh' }"
    :content-style="{ height: '100%', margin: '0', padding: '0' }"
    :draggable="false"
    @hide="hideDialog"
  >
    <template #header>
      <div class="side-color" :style="{ backgroundColor: getTypeColor(workItem.type) }" />
      <span class="font-semibold whitespace-nowrap ml-5">
        {{ getTypeLabel(workItem.type) }} {{ workItem?.code }}
      </span>
    </template>
    <div class="flex flex-col">
      <div class="relative -pl-5">
        <div class="side-color" :style="{ backgroundColor: getTypeColor(workItem.type) }" />
        <div class="flex justify-between items-center ml-5 mb-2 mr-4 py-2">
          <span class="mr-4">{{ workItem?.code }}</span>
          <InputGroup>
            <InputText v-model="workItem.title" />
            <InputGroupAddon>
              <Button
                variant="text"
                severity="secondary"
                icon="pi pi-clipboard"
                @click="copyToClipboard"
              />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div class="flex justify-between items-center ml-5 mb-2 mr-4 py-2">
          <div class="flex items-center gap-2 flex-1">
            <div class="flex items-center gap-2">
              <AssigneeSelector v-model="workItem.assignee" class="min-w-48" />
            </div>
            <div class="flex items-center gap-2 ml-6">
              <Chip
                v-for="tag in workItem.tags"
                :key="tag.name"
                :label="tag.name"
                removable
                @remove="removeTagFromWorkItemFn(tag)"
              />
              <div ref="tagSelectorRef" class="inline-block">
                <TagSelector v-if="showTagSelector" v-model="selectedTag" class="max-w-48" />
                <Button
                  v-else
                  icon="pi pi-plus"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  v-tooltip.bottom="'Add tag'"
                  @click="showTagSelector = true"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0 ml-4">
            <Button
              label="Save and Close"
              severity="secondary"
              icon="pi pi-save"
              @click="updateWorkItemFn"
            />
            <Button severity="secondary" icon="pi pi-refresh" text v-tooltip.bottom="'Refresh'" />
            <Button
              severity="secondary"
              icon="pi pi-ellipsis-v"
              aria-haspopup="true"
              aria-controls="overlay_menu"
              text
              v-tooltip.bottom="'More Actions'"
              @click="toggleMenuItems"
            />
            <Menu ref="menu" id="overlay_menu" popup :model="menuItems" />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 py-2 pl-5 bg-gray-100">
        <span class="mr-4">State:</span>
        <Select
          v-model="workItem.status"
          :options="workItemStatuses"
          option-label="label"
          option-value="value"
          class="ml-2"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2">
              <Badge :severity="getStatusSeverity(slotProps.value)" />
              {{ getStatusLabel(slotProps.value) }}
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Select>

        <span class="ml-auto mr-5">Last Updated: {{ workItemLastUpdated }}</span>
      </div>
      <div class="flex w-full gap-4">
        <Accordion :value="['0', '1', '2']" multiple class="w-[65%]">
          <AccordionPanel value="0">
            <AccordionHeader>
              <span class="text-lg">Description</span>
            </AccordionHeader>
            <AccordionContent>
              <Textarea
                v-model="workItem.description"
                rows="2"
                placeholder="Click to add Description"
                auto-resize
                fluid
              />
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader>
              <span class="text-lg">Acceptance Criteria</span>
            </AccordionHeader>
            <AccordionContent>
              <Textarea
                v-model="workItem.acceptanceCriteria"
                rows="2"
                placeholder="Click to add Acceptance Criteria"
                auto-resize
                fluid
              />
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="2">
            <AccordionHeader>
              <span class="text-lg">Discussion</span>
            </AccordionHeader>
            <AccordionContent>
              <CommentsSection
                :comments="workItem.comments"
                @add-comment="addCommentFn"
                @delete-comment="deleteCommentFn"
                @update-comment="(commentId, content) => updateCommentFn({ commentId, content })"
              />
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

        <Accordion :value="['0', '1']" multiple class="w-[32.5%]">
          <AccordionPanel value="0">
            <AccordionHeader>
              <span class="text-lg">Planning</span>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-2">
                <div class="flex flex-col">
                  <label for="storyPoints" class="font-medium text-surface-600 dark:text-surface-0">
                    Story Points
                  </label>
                  <InputNumber v-model="workItem.planning.storyPoints" input-id="storyPoints" />
                </div>
                <div class="flex flex-col">
                  <label for="priority" class="font-medium text-surface-600 dark:text-surface-0">
                    Priority
                  </label>
                  <InputNumber v-model="workItem.planning.priority" input-id="priority" />
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader>
              <span class="text-lg">Classification</span>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-2">
                <div class="flex flex-col">
                  <label for="valueArea" class="font-medium text-surface-600 dark:text-surface-0">
                    Value Area
                  </label>
                  <Select
                    v-model="workItem.classification.valueArea"
                    :options="valueAreas"
                    option-label="label"
                    option-value="value"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

        <Accordion :value="['0', '1']" multiple class="w-[32.5%]">
          <AccordionPanel value="0">
            <AccordionHeader>
              <span class="text-lg">Development</span>
            </AccordionHeader>
            <AccordionContent>
              Link a GitHub commit, pull request or branch to this work item to see the status of
              your development.
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader>
              <span class="text-lg">Related Work Items</span>
            </AccordionHeader>
            <AccordionContent>
              <RelatedWorkItemsSection
                :outgoing-links="workItem.outgoingLinks"
                :incoming-links="workItem.incomingLinks"
                :project-id="project.id"
                :work-item-id="workItemId"
                @delete-link="deleteLinkFn"
                @create-link="createLinkFn"
              />
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.side-color {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px !important;
}
:deep(.p-chip) {
  padding: 2px 6px;
  font-size: 0.75rem;
  border-radius: 4px;
  height: auto;
}
:deep(.p-chip .p-chip-text) {
  line-height: 1rem;
}
:deep(.p-chip .p-chip-remove-icon) {
  font-size: 0.75rem;
}
</style>

<style>
.work-item-dialog > .p-dialog {
  border-radius: 0.5rem !important;
}
.work-item-dialog > .p-dialog-header {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 0.5rem;
  padding: 0 !important;
}
.work-item-dialog > .p-dialog-content {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 0 !important;
}
</style>
