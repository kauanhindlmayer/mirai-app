<script setup lang="ts">
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object, string } from 'yup'
import type { Project } from '~/types/project'

const { project } = useProjectContext()

const toast = useAppToast()
const queryCache = useQueryCache()

const { isVisible } = useDrawer()

function getFormData() {
  return {
    id: project.value.id,
    name: project.value.name,
    description: project.value.description,
    organizationId: project.value.organizationId,
  }
}

const form = ref<Partial<Project> & { id: string }>(getFormData())

function showDrawer() {
  form.value = getFormData()
  isVisible.value = true
}

function hideDrawer() {
  isVisible.value = false
}

const updateProjectSchema = object({
  description: string().max(500, 'Description must not exceed 500 characters'),
})

const resolver = ref(yupResolver(updateProjectSchema))

const { mutate: updateProjectFn, isLoading } = useMutation({
  mutation: updateProject,
  onMutate: (projectInfo) => {
    const oldProject = queryCache.getQueryData<Project>(['project', projectInfo.id])!
    const newProject: Project = {
      ...oldProject,
      ...projectInfo,
    }
    queryCache.setQueryData<Project>(['project', newProject.id], newProject)
    queryCache.cancelQueries({ key: ['project', newProject.id] })
    hideDrawer()
    return { oldProject, newProject }
  },
  onSettled: (_data, _error, _vars, { newProject }) => {
    if (!newProject) return
    queryCache.invalidateQueries({ key: ['project', newProject.id] })
  },
  onError(_error, projectInfo, { newProject, oldProject }) {
    if (newProject === queryCache.getQueryData(['project', projectInfo.id])) {
      queryCache.setQueryData(['project', projectInfo.id], oldProject)
    }
    toast.showError({ detail: "An error occurred while updating the project's description" })
  },
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  updateProjectFn(form.value)
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
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">About this Project</span>
    </template>
    <Form :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="grow">
        <FormField v-slot="$field" name="description">
          <label for="description" class="font-medium text-surface-900 dark:text-surface-0">
            Description
          </label>
          <Textarea input-id="description" v-model="form.description" rows="5" class="w-full" />
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
