<script setup lang="ts">
import { displayError } from '@/composables/displayError'
import { useBoardStore } from '@/stores/board'
import type { Column } from '@/types/board'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { storeToRefs } from 'pinia'
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { number, object, string } from 'yup'

const boardStore = useBoardStore()
const { board } = storeToRefs(boardStore)

const columns = ref<Column[]>([])
const selectedColumnId = ref<string>('')
const newColumnId = ref(1)

function addColumn() {
  columns.value.splice(1, 0, {
    id: newColumnId.value.toString(),
    name: `New Column ${newColumnId.value}`,
    position: 0,
    cards: [],
  })
  newColumnId.value++
}

watch(board, () => {
  columns.value = board.value?.columns ? [...board.value.columns] : []
  selectedColumnId.value = columns.value[0]?.id || ''
})

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menu')
const menuItems = computed<MenuItem[]>(() => {
  const index = columns.value.findIndex((column) => column.id === selectedColumnId.value)
  if (index === -1) return []
  const isFirstColumn = index === 0
  const isSecondColumn = index === 1
  const isSecondLastColumn = index === columns.value.length - 2
  const isLastColumn = index === columns.value.length - 1

  const items = [
    {
      label: 'Remove',
      icon: 'pi pi-trash',
      command: removeColumn,
      visible: !isFirstColumn && !isLastColumn,
    },
    {
      label: 'Move Left',
      icon: 'pi pi-arrow-left',
      command: moveColumnLeft,
      visible: !isFirstColumn && !isSecondColumn && !isLastColumn,
    },
    {
      label: 'Move Right',
      icon: 'pi pi-arrow-right',
      command: moveColumnRight,
      visible: !isFirstColumn && !isSecondLastColumn && !isLastColumn,
    },
    {
      label: 'Insert Left',
      icon: 'pi pi-plus',
      command: insertColumnLeft,
      visible: !isFirstColumn,
    },
    {
      label: 'Insert Right',
      icon: 'pi pi-plus',
      command: insertColumnRight,
      visible: !isLastColumn,
    },
  ]
  return items
})

function toggleMenuItems(event: MouseEvent) {
  menuRef.value?.toggle(event)
}

async function removeColumn() {
  const index = columns.value.findIndex((column) => column.id === selectedColumnId.value)
  if (index === -1) return
  try {
    await boardStore.deleteColumn(selectedColumnId.value)
    columns.value.splice(index, 1)
    closeDrawer()
  } catch (error) {
    displayError(error)
  }
}

function moveColumnLeft() {
  const index = columns.value.findIndex((column) => column.id === selectedColumnId.value)
  if (index === -1) return
  const column = columns.value[index]
  columns.value.splice(index, 1)
  columns.value.splice(index - 1, 0, column)
}

function moveColumnRight() {
  const index = columns.value.findIndex((column) => column.id === selectedColumnId.value)
  if (index === -1) return
  const column = columns.value[index]
  columns.value.splice(index, 1)
  columns.value.splice(index + 1, 0, column)
}

function insertColumnLeft() {
  const index = columns.value.findIndex((column) => column.id === selectedColumnId.value)
  if (index === -1) return
  insertColumn(index)
}

function insertColumnRight() {
  const index = columns.value.findIndex((column) => column.id === selectedColumnId.value)
  if (index === -1) return
  insertColumn(index + 1)
}

function insertColumn(position: number) {
  columns.value.splice(position, 0, {
    id: newColumnId.value.toString(),
    name: `New Column ${newColumnId.value}`,
    position: 0,
    cards: [],
  })
  newColumnId.value++
}

const resolver = ref(
  yupResolver(
    object({
      name: string().required('Name is required'),
      wipLimit: number()
        .optional()
        .min(0, 'WIP Limit must be greater than or equal to 0')
        .default(undefined),
      definitionOfDone: string()
        .optional()
        .max(500, 'Definition of Done must not exceed 500 characters')
        .default(undefined),
    }),
  ),
)

async function onFormSubmit({ valid, values }: FormSubmitEvent) {
  if (!valid) return
  try {
    boardStore.createColumn({
      name: values.name,
      wipLimit: values.wipLimit,
      definitionOfDone: values.definitionOfDone || '',
      position: 1,
    })
    closeDrawer()
  } catch (error) {
    displayError(error)
  }
}

const isVisible = ref(false)

function openDrawer() {
  isVisible.value = true
}

function closeDrawer() {
  isVisible.value = false
}

defineExpose({
  openDrawer,
  closeDrawer,
})
</script>

<template>
  <Drawer
    v-model:visible="isVisible"
    header="Settings"
    position="right"
    class="!w-full sm:!w-[48rem]"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <div class="h-full">
      <div class="flex-grow">
        <h3 class="text-lg font-semibold">Columns</h3>
        <p class="text-gray-500">Columns visualize the flow of work across the board.</p>
        <Button
          label="Add Column"
          icon="pi pi-plus"
          severity="secondary"
          class="mt-4"
          @click="addColumn"
        />
        <Tabs v-model:value="selectedColumnId" scrollable>
          <TabList>
            <Tab
              v-for="column in columns"
              :key="column.id"
              :value="column.id"
              class="flex justify-between items-center group"
            >
              <p class="mr-4">{{ column.name }}</p>
              <Button
                icon="pi pi-ellipsis-v"
                severity="secondary"
                class="group-hover:visible"
                size="small"
                :class="{
                  visible: selectedColumnId === column.id,
                  invisible: !(selectedColumnId === column.id),
                }"
                text
                rounded
                @click="toggleMenuItems"
              />
            </Tab>
            <Menu ref="menu" popup :model="menuItems" />
          </TabList>
          <TabPanels>
            <TabPanel v-for="(column, index) in columns" :key="column.id" :value="column.id">
              <Form
                :initial-values="{ ...column }"
                :resolver
                @submit="onFormSubmit"
                class="flex flex-col h-full"
              >
                <div class="flex-grow">
                  <FormField v-slot="$field" name="name">
                    <label for="name">Name</label>
                    <InputText inputId="name" v-model="columns[index].name" class="w-full" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                      {{ $field.error?.message }}
                    </Message>
                  </FormField>

                  <FormField v-slot="$field" name="wipLimit" class="mt-2">
                    <label for="wipLimit">WIP Limit</label>
                    <InputNumber
                      inputId="wipLimit"
                      v-model="columns[index].wipLimit"
                      class="w-full"
                    />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                      {{ $field.error?.message }}
                    </Message>
                  </FormField>

                  <FormField v-slot="$field" name="definitionOfDone" class="mt-2">
                    <label for="definitionOfDone">Definition of Done</label>
                    <Textarea
                      inputId="definitionOfDone"
                      v-model="columns[index].definitionOfDone"
                      class="w-full"
                    />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                      {{ $field.error?.message }}
                    </Message>
                  </FormField>
                </div>
                <div class="flex justify-end mt-4 gap-2">
                  <Button type="button" label="Cancel" severity="secondary" @click="closeDrawer" />
                  <Button type="submit" label="Save" />
                </div>
              </Form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </Drawer>
</template>
