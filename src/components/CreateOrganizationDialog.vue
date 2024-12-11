<script setup lang="ts">
import { useOrganizationStore } from '@/stores/organization'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { ref } from 'vue'
import { object, string } from 'yup'

const isVisible = ref(false)

function openDialog() {
  isVisible.value = true
}

function closeDialog() {
  isVisible.value = false
}

const form = ref({
  name: '',
  description: '',
})

const resolver = ref(
  yupResolver(
    object({
      name: string()
        .min(3, 'Name must be at least 3 characters long')
        .max(255, 'Name must not exceed 255 characters')
        .required('Name is a required field'),
      description: string().max(500, 'Description must not exceed 500 characters'),
    }),
  ),
)

const organizationStore = useOrganizationStore()

function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  organizationStore.createOrganization(form.value)
}

defineExpose({
  openDialog,
  closeDialog,
})
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    header="Create New Organization"
    :style="{
      width: '45rem',
      height: '98%',
      maxHeight: '98%',
    }"
    position="topright"
    :modal="true"
    :draggable="false"
  >
    <Form :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="flex-grow">
        <FormField v-slot="$field" name="name">
          <label for="name"> Name <small class="text-red-400">*</small> </label>
          <InputText inputId="name" type="text" v-model="form.name" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="description" class="mt-4">
          <label for="description">Description</label>
          <Textarea inputId="description" v-model="form.description" rows="3" class="w-full" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>
      <div class="flex justify-end mt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="closeDialog" />
        <Button type="submit" label="Create" />
      </div>
    </Form>
  </Dialog>
</template>

<style>
.p-dialog-content {
  height: calc(100% - 4rem);
  overflow-y: auto;
}
</style>
