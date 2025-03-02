<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object, string } from 'yup'

const form = ref({
  name: '',
  category: '',
  description: '',
})

const createPersonaSchema = object({
  name: string().required('Name is a required field'),
  description: string()
    .required('Description is a required field')
    .max(500, 'Description must not exceed 500 characters'),
})

const resolver = ref(yupResolver(createPersonaSchema))

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  hideDrawer()
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
          <InputText inputId="name" v-model="form.name" class="w-full" />
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
            customUpload
            accept="image/*"
            :maxFileSize="1000000"
            chooseLabel="Upload Image"
            class="w-unset text-surface-600! dark:text-surface-200! hover:text-primary! bg-surface-200/20! hover:bg-surface-200/30! dark:bg-surface-700/20! hover:!dark-bg-surface-700/30 border border-surface-300! dark:border-surface-500! p-2!"
          />
        </div>

        <FormField v-slot="$field" name="category" class="mt-2">
          <label for="category" class="font-medium text-surface-900 dark:text-surface-0">
            Category
          </label>
          <InputText inputId="category" v-model="form.category" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="description" class="mt-2">
          <label for="description" class="font-medium text-surface-900 dark:text-surface-0">
            Description <small class="text-red-400">*</small>
          </label>
          <Textarea inputId="description" v-model="form.description" rows="5" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>

      <div class="flex justify-end mt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="hideDrawer" />
        <Button type="submit" label="Create" />
      </div>
    </Form>
  </Drawer>
</template>
