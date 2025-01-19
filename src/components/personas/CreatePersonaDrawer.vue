<script setup lang="ts">
import { displayError } from '@/composables/displayError'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { ref } from 'vue'
import { object, string } from 'yup'

const form = ref({
  name: '',
  category: '',
  description: '',
})

const resolver = ref(
  yupResolver(
    object({
      name: string().required('Name is a required field'),
      description: string()
        .required('Description is a required field')
        .max(500, 'Description must not exceed 500 characters'),
    }),
  ),
)

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  try {
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
    header="Create Persona"
    position="right"
    class="!w-full sm:!w-[36rem]"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <Form :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="flex-grow">
        <FormField v-slot="$field" name="name">
          <label for="name">Name</label>
          <InputText inputId="name" v-model="form.name" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="category" class="mt-2">
          <label for="category">Category</label>
          <InputText inputId="category" v-model="form.category" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="description" class="mt-2">
          <label for="description">Description</label>
          <Textarea inputId="description" v-model="form.description" rows="5" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <div class="flex justify-end mt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="closeDrawer" />
        <Button type="submit" label="Create" />
      </div>
    </Form>
  </Drawer>
</template>
