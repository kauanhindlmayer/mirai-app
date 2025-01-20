<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Board } from '@/types/board'
import { onMounted, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import WorkItemDialog from '../common/WorkItemDialog.vue'
import BoardColumn from './BoardColumn.vue'

defineProps<{
  board: Board
}>()

type WorkItemDialogType = InstanceType<typeof WorkItemDialog>
const workItemDialogRef = useTemplateRef<WorkItemDialogType>('workItemDialog')

const route = useRoute()

watch(
  () => route.query.workItemId,
  (newWorkItemId) => {
    if (!newWorkItemId) return
    workItemDialogRef.value?.openDialog(newWorkItemId as string)
  },
)

onMounted(() => {
  const workItemId = route.query.workItemId as string
  if (!workItemId) return
  workItemDialogRef.value?.openDialog(workItemId)
})
</script>

<template>
  <div class="p-4 h-full overflow-auto">
    <div class="flex flex-row items-start">
      <BoardColumn v-for="column in board.columns" :key="column.id" :column="column" />
    </div>
    <WorkItemDialog ref="workItemDialog" />
  </div>
</template>
