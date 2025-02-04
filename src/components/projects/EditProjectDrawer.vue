<script setup lang="ts">
import { updateProject } from '@/api/projects'
import { displayError } from '@/composables/displayError'
import { useDrawer } from '@/composables/useDialog'
import { useOrganizationStore } from '@/stores/organization'
import { useProjectStore } from '@/stores/project'
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { object, string } from 'yup'

const organizationStore = useOrganizationStore()
const { organization } = storeToRefs(organizationStore)
const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const form = ref({
  name: project.value.name,
  description: project.value.description,
})

const updateProjectSchema = object({
  description: string().max(500, 'Description must not exceed 500 characters'),
})

const resolver = ref(yupResolver(updateProjectSchema))

const queryCache = useQueryCache()

const { mutate: updateProjectFn, isLoading } = useMutation({
  mutation: () => updateProject(organization.value.id, project.value.id, form.value),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['project', project.value.id] })
    hideDrawer()
  },
  onError: displayError,
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  updateProjectFn()
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
        <Button type="button" label="Cancel" severity="secondary" @click="hideDrawer" />
        <Button type="submit" label="Save" :disabled="isLoading" />
      </div>
    </Form>
  </Drawer>
</template>
