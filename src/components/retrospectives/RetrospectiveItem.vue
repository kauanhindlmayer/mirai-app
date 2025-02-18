<script setup lang="ts">
import { useMutation, useQueryCache } from '@pinia/colada'
import { storeToRefs } from 'pinia'
import { useConfirm, type Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { ref, useTemplateRef } from 'vue'
import { deleteRetrospectiveItem } from '~/api/retrospectives'
import { useAppToast } from '~/composables/useAppToast'
import { useTeamStore } from '~/stores/team'
import type { RetrospectiveItem } from '~/types/retrospective'
import { format } from '~/utils/date'

const teamStore = useTeamStore()
const { teamId } = storeToRefs(teamStore)

const { retrospectiveId, columnId, item } = defineProps<{
  item: RetrospectiveItem
  retrospectiveId: string
  columnId: string
}>()

const queryCache = useQueryCache()
const toast = useAppToast()
const confirm = useConfirm()

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Delete Item', icon: 'pi pi-trash', command: confirmDeleteRetrospectiveItem },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

function confirmDeleteRetrospectiveItem() {
  confirm.require({
    header: 'Delete Item?',
    message: `Are you sure you want to delete the item '${item.content}'?`,
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => deleteRetrospectiveItemFn(),
  })
}

const { mutate: deleteRetrospectiveItemFn } = useMutation({
  mutation: () => deleteRetrospectiveItem(teamId.value!, retrospectiveId, columnId, item.id),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['retrospective', retrospectiveId] })
    toast.showSuccess({ detail: 'Item deleted successfully' })
  },
})
</script>

<template>
  <div class="card flex justify-between p-4">
    <div class="flex flex-col gap-2">
      <p class="text-surface-900 dark:text-surface-0 mb-4">{{ item.content }}</p>
      <p class="text-surface-600 dark:text-surface-200 leading-normal">
        {{ format(item.createdAt, "MMMM d, yyyy 'at' HH:mm") }}
      </p>
    </div>

    <div class="-mr-2 -mt-2">
      <Button
        icon="pi pi-ellipsis-v"
        severity="secondary"
        text
        class="p-2"
        @click="toggleMenuItems"
      />
      <Menu ref="menu" popup :model="menuItems" />
    </div>
  </div>
</template>
