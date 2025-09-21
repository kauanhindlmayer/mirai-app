<script setup lang="ts">
import { useConfirm, type Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import type { RetrospectiveItem } from '~/types/retrospective'
import { cacheKeys } from '~/utils/cache-keys'

const teamStore = useTeamStore()
const { teamId } = storeToRefs(teamStore)

const { retrospectiveId, columnId, item } = defineProps<{
  item: RetrospectiveItem
  retrospectiveId: string
  columnId: string
}>()

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = ref<MenuItem[]>([
  { label: 'Delete Item', icon: 'pi pi-trash', command: confirmDeleteRetrospectiveItem },
])

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

function confirmDeleteRetrospectiveItem() {
  confirm.require({
    header: 'Delete Item',
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

const queryCache = useQueryCache()
const confirm = useConfirm()

const { mutate: deleteRetrospectiveItemFn } = useMutation({
  mutation: () => deleteRetrospectiveItem(teamId.value!, retrospectiveId, columnId, item.id),
  onSuccess: () => {
    queryCache.invalidateQueries({
      key: cacheKeys.retrospectives.get(teamId.value!, retrospectiveId),
    })
  },
})
</script>

<template>
  <div class="relative card flex justify-between p-4 mb-0!">
    <div class="flex flex-col gap-2">
      <p class="text-surface-900 dark:text-surface-0 mb-4 text-wrap w-[200px]">
        {{ item.content }}
      </p>
      <p class="text-surface-600 dark:text-surface-200 leading-normal">
        {{ format(item.createdAtUtc, "MMMM d, yyyy 'at' HH:mm") }}
      </p>
    </div>

    <div class="absolute right-1 top-1">
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
