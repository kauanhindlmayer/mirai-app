<script setup lang="ts">
import { useWorkItemStore } from '@/stores/work-item'
import { getStatusLabel, getStatusSeverity, getTypeColor, getTypeLabel } from '@/utils/work-item'
import { storeToRefs } from 'pinia'
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { computed, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import CommentsSection from './CommentsSection.vue'

const router = useRouter()
const workItemStore = useWorkItemStore()
const { workItem } = storeToRefs(workItemStore)

const title = computed(() => {
  if (!workItem.value) return ''
  return `${getTypeLabel(workItem.value.type)} `
})

const isVisible = ref(false)

async function openDialog(workItemId: string) {
  isVisible.value = true
  await workItemStore.getWorkItem(workItemId)
}

function closeDialog() {
  router.replace({ query: undefined })
  isVisible.value = false
}

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Change Type', icon: 'pi pi-pencil', disabled: true },
  { label: 'Create Copy of Work Item', icon: 'pi pi-clone', disabled: true },
  { label: 'Copy Link', icon: 'pi pi-copy', disabled: true },
  { label: 'Delete', icon: 'pi pi-trash', disabled: true },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

function copyToClipboard() {
  navigator.clipboard.writeText(workItem.value!.title)
}

defineExpose({
  openDialog,
  closeDialog,
})
</script>

<template>
  <Dialog
    v-if="workItem"
    v-model:visible="isVisible"
    modal
    :style="{ width: '64rem' }"
    @hide="closeDialog"
  >
    <template #header>
      <div class="side-color" :style="{ backgroundColor: getTypeColor(workItem.type) }" />
      <span class="font-semibold whitespace-nowrap ml-5">{{ title }}</span>
    </template>
    <div class="flex flex-col">
      <div class="relative -pl-5">
        <div class="side-color" :style="{ backgroundColor: getTypeColor(workItem.type) }" />
        <div class="flex justify-between items-center ml-5 mb-2 mr-4 py-2">
          <span class="mr-4">{{ workItem?.code }}</span>
          <InputGroup>
            <InputText v-model="workItem.title" />
            <InputGroupAddon>
              <Button severity="secondary" icon="pi pi-clipboard" @click="copyToClipboard" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div class="flex justify-between items-center ml-5 mb-2 py-2">
          <div>
            <Avatar shape="circle" icon="pi pi-user" class="mr-2" />
            <span class="text-surface-900 dark:text-surface-0">
              {{ workItem.assignedTo || 'Unassigned' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Button
              label="Save and Close"
              severity="secondary"
              icon="pi pi-save"
              disabled
              @click="closeDialog"
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
        <span class="mr-4">State</span>
        <Badge :severity="getStatusSeverity(workItem.status)" />
        {{ getStatusLabel(workItem.status) }}
      </div>
      <div>
        <Accordion :value="['0', '1', '2']" multiple>
          <AccordionPanel value="0">
            <AccordionHeader>
              <span class="text-lg">Description</span>
            </AccordionHeader>
            <AccordionContent>
              <Textarea
                v-model="workItem.description"
                rows="2"
                placeholder="Click to add Description"
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
                v-model="workItem.description"
                rows="2"
                placeholder="Click to add Acceptance Criteria"
                fluid
              />
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="2">
            <AccordionHeader>
              <span class="text-lg">Discussion</span>
            </AccordionHeader>
            <AccordionContent>
              <CommentsSection :comments="[]" />
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
</style>

<style>
.p-dialog {
  border-radius: 0.5rem !important;
}
.p-dialog-header {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 0.5rem;
  padding: 0 !important;
}
.p-dialog-content {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 0 !important;
}
</style>
