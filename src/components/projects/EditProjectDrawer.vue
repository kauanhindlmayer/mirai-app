<script setup lang="ts">
import { displayError } from '@/composables/displayError'
import { useProjectStore } from '@/stores/project'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { object, string } from 'yup'

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const form = ref({
  name: project.value?.name || '',
  description: project.value?.description || '',
})

const resolver = ref(
  yupResolver(
    object({
      description: string().max(500, 'Description must not exceed 500 characters'),
    }),
  ),
)

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  try {
    await projectStore.updateProject(project.value!.id, form.value)
    await projectStore.getProject(project.value!.id)
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
    position="right"
    class="!w-full sm:!w-[36rem]"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">About this Project</span>
    </template>
    <Form :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="flex-grow">
        <FormField v-slot="$field" name="description">
          <label for="description" class="font-medium text-surface-900 dark:text-surface-0">
            Description
          </label>
          <Textarea inputId="description" v-model="form.description" rows="5" class="w-full" />
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
  </Drawer>
</template>
