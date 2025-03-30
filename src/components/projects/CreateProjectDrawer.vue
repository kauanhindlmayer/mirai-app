<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object, string } from 'yup'
import type { Project } from '~/types/project'

const organizationStore = useOrganizationStore()
const { organization } = storeToRefs(organizationStore)

const initialValues = {
  name: '',
  description: '',
}

const form = ref<Partial<Project>>({ ...initialValues })

const createProjectSchema = object({
  name: string()
    .min(3, 'Name must be at least 3 characters long')
    .max(255, 'Name must not exceed 255 characters')
    .required('Name is a required field'),
  description: string().max(500, 'Description must not exceed 500 characters'),
})

const resolver = ref(yupResolver(createProjectSchema))
const queryCache = useQueryCache()

const { mutate: createProjectFn, isLoading } = useMutation({
  mutation: createProject,
  onSuccess: () => {
    hideDrawer()
    queryCache.invalidateQueries({ key: ['projects', organization.value.id] })
  },
  onError: displayError,
})

function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  createProjectFn({ ...form.value, organizationId: organization.value.id })
}

const { isVisible, showDrawer } = useDrawer()

function hideDrawer() {
  isVisible.value = false
  Object.assign(form.value, initialValues)
}

defineExpose({
  showDrawer,
  hideDrawer,
})
</script>

<template>
  <Drawer
    v-model:visible="isVisible"
    position="right"
    class="w-full! sm:w-[36rem]!"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">Create New Project</span>
    </template>
    <Form :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="grow">
        <FormField v-slot="$field" name="name">
          <label for="name" class="font-medium text-surface-900 dark:text-surface-0">
            Name <small class="text-red-400">*</small>
          </label>
          <InputText input-id="name" type="text" v-model="form.name" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="description" class="mt-2">
          <label for="description" class="font-medium text-surface-900 dark:text-surface-0">
            Description
          </label>
          <Textarea input-id="description" v-model="form.description" rows="3" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <div class="flex justify-end mt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="hideDrawer" />
        <Button type="submit" label="Create" :loading="isLoading" />
      </div>
    </Form>
  </Drawer>
</template>
