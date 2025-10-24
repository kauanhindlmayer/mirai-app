<script setup lang="ts">
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { date, object, string } from 'yup'
import type { CreateSprintRequest } from '~/types/sprint'

const { team } = useTeamContext()

const toast = useAppToast()
const queryCache = useQueryCache()

const initialValues: CreateSprintRequest = {
  name: '',
  startDate: null,
  endDate: null,
}

const form = ref<CreateSprintRequest>({ ...initialValues })

const createSprintSchema = object({
  name: string().required('Name is a required field'),
  startDate: date().required('Start date is a required field'),
  endDate: date().required('End date is a required field'),
})

const resolver = ref(yupResolver(createSprintSchema))

const { mutate: createSprintFn, isLoading } = useMutation({
  mutation: (request: CreateSprintRequest) => createSprint(team.value.id, request),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['sprints', team.value.id] })
    toast.showSuccess({ detail: 'Sprint created successfully' })
    hideDialog()
  },
  onError: displayError,
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  createSprintFn(form.value)
}

const { isVisible, showDialog } = useDialog()

function hideDialog() {
  isVisible.value = false
  Object.assign(form.value, initialValues)
}

defineExpose({
  showDialog,
})
</script>

<template>
  <Dialog v-model:visible="isVisible" :style="{ width: '450px' }" modal @hide="hideDialog">
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">Create Sprint</span>
    </template>
    <Form :resolver class="flex flex-col h-full" @submit="onFormSubmit">
      <FormField v-slot="$field" name="name">
        <label for="name" class="font-medium text-surface-900 dark:text-surface-0">
          Name <small class="text-red-400">*</small>
        </label>
        <InputText input-id="name" v-model="form.name" class="w-full" />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <div class="flex items-center gap-4 mt-2">
        <FormField v-slot="$field" name="startDate">
          <label for="startDate" class="font-medium text-surface-900 dark:text-surface-0">
            Start <small class="text-red-400">*</small>
          </label>
          <DatePicker input-id="startDate" v-model="form.startDate" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="endDate">
          <label for="endDate" class="font-medium text-surface-900 dark:text-surface-0">
            End <small class="text-red-400">*</small>
          </label>
          <DatePicker input-id="endDate" v-model="form.endDate" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancel" severity="secondary" @click="hideDialog" />
        <Button type="submit" label="Create" :disabled="isLoading" />
      </div>
    </Form>
  </Dialog>
</template>

<style>
.p-dialog {
  border-radius: 0.5rem !important;
}
</style>
