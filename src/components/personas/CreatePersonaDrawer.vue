<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import type { FileUploadSelectEvent } from 'primevue'
import { object, string } from 'yup'
import type { CreatePersonaRequest } from '~/types/persona'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const initialValues: CreatePersonaRequest = {
  name: '',
  category: '',
  description: '',
  file: undefined,
}

const form = ref<CreatePersonaRequest>({ ...initialValues })

const createPersonaSchema = object({
  name: string().required('Name is a required field'),
  category: string().optional().max(100, 'Category must not exceed 100 characters'),
  file: string().optional(),
  description: string()
    .required('Description is a required field')
    .max(500, 'Description must not exceed 500 characters'),
})

const resolver = ref(yupResolver(createPersonaSchema))

const queryCache = useQueryCache()

const { mutate: createPersonaFn, isLoading } = useMutation({
  mutation: (request: CreatePersonaRequest) => createPersona(project.value.id, request),
  onSuccess: () => {
    hideDrawer()
    queryCache.invalidateQueries({ key: ['personas', project.value.id] })
  },
  onError: displayError,
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  createPersonaFn(form.value)
}

function onFileSelect(event: FileUploadSelectEvent) {
  form.value.file = event.files[0]
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
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">Create Persona</span>
    </template>
    <Form :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="grow">
        <FormField v-slot="$field" name="name">
          <label for="name" class="font-medium text-surface-900 dark:text-surface-0">
            Name <small class="text-red-400">*</small>
          </label>
          <InputText input-id="name" v-model="form.name" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <div class="col-span-12 flex flex-col items-start mt-2">
          <label for="avatar" class="font-medium text-surface-900 dark:text-surface-0">
            Avatar
          </label>
          <FileUpload
            mode="basic"
            name="avatar"
            custom-upload
            accept="image/*"
            :max-file-size="1000000"
            chooseLabel="Upload Image"
            class="w-unset text-surface-600! dark:text-surface-200! hover:text-primary! bg-surface-200/20! hover:bg-surface-200/30! dark:bg-surface-700/20! hover:!dark-bg-surface-700/30 border border-surface-300! dark:border-surface-500! p-2!"
            @select="onFileSelect"
          />
        </div>

        <FormField v-slot="$field" name="category" class="mt-2">
          <label for="category" class="font-medium text-surface-900 dark:text-surface-0">
            Category
          </label>
          <InputText input-id="category" v-model="form.category" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="description" class="mt-2">
          <label for="description" class="font-medium text-surface-900 dark:text-surface-0">
            Description <small class="text-red-400">*</small>
          </label>
          <Textarea input-id="description" v-model="form.description" rows="5" class="w-full" />
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
