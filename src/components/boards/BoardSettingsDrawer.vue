<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import type { Menu } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { number, object, string } from 'yup'
import type { Board, Column, CreateBoardColumnRequest } from '~/types/board'

const { board } = defineProps<{
  board: Board
}>()

const columns = ref<Column[]>([])
const selectedColumnId = ref<string>('')
const newColumnId = ref(1)

function addColumn() {
  columns.value.splice(1, 0, {
    id: newColumnId.value.toString(),
    name: `New Column ${newColumnId.value}`,
    position: 1,
    isDefault: false,
    cards: [],
    hasMoreCards: false,
    totalCardCount: 0,
  })
  newColumnId.value++
}

function initializeBoardSettings() {
  columns.value = board.columns ? [...board.columns] : []
  selectedColumnId.value = columns.value[0]?.id || ''
}

initializeBoardSettings()

watch(() => board, initializeBoardSettings)

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
      command: () => removeColumn(),
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

const { mutate: removeColumn } = useMutation({
  mutation: () => deleteColumn(board.id, selectedColumnId.value),
  onSuccess: () => {
    const index = columns.value.findIndex((column) => column.id === selectedColumnId.value)
    if (index === -1) return
    columns.value.splice(index, 1)
    hideDrawer()
  },
  onError: displayError,
})

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
    position: 1,
    isDefault: false,
    cards: [],
    hasMoreCards: false,
    totalCardCount: 0,
  })
  newColumnId.value++
}

const createBoardColumnSchema = object({
  name: string().required('Name is required'),
  wipLimit: number().nullable().min(0, 'WIP Limit must be greater than or equal to 0'),
  definitionOfDone: string()
    .nullable()
    .max(500, 'Definition of Done must not exceed 500 characters'),
})

const resolver = ref(yupResolver(createBoardColumnSchema))

const toast = useAppToast()
const queryCache = useQueryCache()

const { mutate: createColumnFn } = useMutation({
  mutation: (payload: CreateBoardColumnRequest) => createColumn(board.id, payload),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['board', board.id] })
    toast.showSuccess({ detail: 'Column created successfully' })
    hideDrawer()
  },
  onError: displayError,
})

async function onFormSubmit({ valid, values }: FormSubmitEvent) {
  if (!valid) return
  createColumnFn({
    name: values.name,
    wipLimit: values.wipLimit,
    definitionOfDone: values.definitionOfDone || '',
    position: 1,
  })
}

const { isVisible, showDrawer, hideDrawer } = useDrawer()

defineExpose({
  showDrawer,
  hideDrawer,
})
</script>

<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    class="w-full! sm:w-[48rem]!"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">Settings</span>
    </template>
    <div class="h-full">
      <div class="grow">
        <h3 class="text-surface-900 dark:text-surface-0 font-medium text-xl">Columns</h3>
        <p class="m-0 p-0 text-surface-600 dark:text-surface-200 leading-normal">
          Columns visualize the flow of work across the board.
        </p>
        <Button
          label="Add Column"
          icon="pi pi-plus"
          severity="secondary"
          class="my-4"
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
                class="flex flex-col h-full mt-4"
              >
                <div class="grow">
                  <FormField v-slot="$field" name="name">
                    <label for="name" class="font-medium text-surface-900 dark:text-surface-0">
                      Name <small class="text-red-400">*</small>
                    </label>
                    <InputText input-id="name" v-model="columns[index].name" class="w-full" />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                      {{ $field.error?.message }}
                    </Message>
                  </FormField>

                  <FormField v-slot="$field" name="wipLimit" class="mt-2">
                    <label for="wipLimit" class="font-medium text-surface-900 dark:text-surface-0">
                      WIP Limit
                    </label>
                    <InputNumber
                      input-id="wipLimit"
                      v-model="columns[index].wipLimit"
                      class="w-full"
                    />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                      {{ $field.error?.message }}
                    </Message>
                  </FormField>

                  <FormField v-slot="$field" name="definitionOfDone" class="mt-2">
                    <label
                      for="definitionOfDone"
                      class="font-medium text-surface-900 dark:text-surface-0"
                    >
                      Definition of Done
                    </label>
                    <Textarea
                      input-id="definitionOfDone"
                      v-model="columns[index].definitionOfDone"
                      class="w-full"
                    />
                    <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                      {{ $field.error?.message }}
                    </Message>
                  </FormField>
                </div>
                <div class="flex justify-end mt-4 gap-2">
                  <Button type="button" label="Cancel" severity="secondary" @click="hideDrawer" />
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
