<script setup lang="ts">
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { format } from 'date-fns'
import { storeToRefs } from 'pinia'
import { number, object, string } from 'yup'
import { createRetrospective } from '~/api/retrospectives'
import { useDialog } from '~/composables/useDialog'
import { useTeamStore } from '~/stores/team'
import { ProcessTemplate, type Retrospective } from '~/types/retrospective'

const teamStore = useTeamStore()
const { teamId } = storeToRefs(teamStore)

const initialValues = {
  title: '',
  maxVotesPerUser: 5,
  template: ProcessTemplate.Classic,
}

const form = ref<Partial<Retrospective>>({ ...initialValues })

const templates = Object.keys(ProcessTemplate)
const titlePlaceholder = `Example: Retrospective ${format(new Date(), 'MMM d, yyyy')}`

const createRetrospectiveSchema = object({
  title: string().required('Name is a required field'),
  maxVotesPerUser: number().min(3).max(12).required('Max Votes Per User is a required field'),
  template: string().required('Template is a required field'),
})

const resolver = ref(yupResolver(createRetrospectiveSchema))
const queryCache = useQueryCache()

const { mutate: createRetrospectiveFn } = useMutation({
  mutation: createRetrospective,
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['retrospectives', teamId.value!] })
    hideDialog()
  },
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  createRetrospectiveFn({ ...form.value, teamId: teamId.value! })
}

const { isVisible, showDialog } = useDialog()

function hideDialog() {
  isVisible.value = false
  Object.assign(form.value, initialValues)
}

defineExpose({
  showDialog,
  hideDialog,
})
</script>

<template>
  <Dialog v-model:visible="isVisible" :style="{ width: '450px' }" modal>
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">
        Create Retrospective
      </span>
    </template>
    <Form
      :initial-values="initialValues"
      :resolver
      class="flex flex-col h-full"
      @submit="onFormSubmit"
    >
      <FormField v-slot="$field" name="title">
        <label for="title" class="font-medium text-surface-900 dark:text-surface-0">
          Title <small class="text-red-400">*</small>
        </label>
        <InputText
          input-id="title"
          v-model="form.title"
          :placeholder="titlePlaceholder"
          class="w-full"
        />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField v-slot="$field" name="maxVotesPerUser" class="mt-2">
        <label for="maxVotesPerUser" class="font-medium text-surface-900 dark:text-surface-0">
          Max Votes Per User
          <small class="text-red-400">*</small>
        </label>
        <InputNumber
          input-id="maxVotesPerUser"
          v-model="form.maxVotesPerUser"
          show-buttons
          :min="3"
          :max="12"
          fluid
        />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField v-slot="$field" name="template" class="mt-2">
        <label for="template" class="font-medium text-surface-900 dark:text-surface-0">
          Template
          <small class="text-red-400">*</small>
        </label>
        <Select
          v-model="form.template"
          class="w-full"
          :options="templates"
          placeholder="Select a template"
        />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancel" severity="secondary" @click="hideDialog" />
        <Button type="submit" label="Create" />
      </div>
    </Form>
  </Dialog>
</template>

<style>
.p-dialog {
  border-radius: 0.5rem !important;
}
</style>
