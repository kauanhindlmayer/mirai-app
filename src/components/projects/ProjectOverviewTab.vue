<script setup lang="ts">
import { useMutation, useQueryCache } from '@pinia/colada'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { useConfirm } from 'primevue'
import { object, string } from 'yup'
import { deleteProject } from '~/api/projects'
import type { Project } from '~/types/project'

const toast = useAppToast()
const queryCache = useQueryCache()
const router = useRouter()
const confirm = useConfirm()

const { project } = useProjectContext()
const { organizationId } = useOrganizationContext()

const form = ref<Partial<Project> & { id: string }>({
  id: project.value.id,
  name: project.value.name,
  description: project.value.description,
  organizationId: project.value.organizationId,
})

const updateProjectSchema = object({
  name: string()
    .required('Project name is required')
    .min(2, 'Project name must be at least 2 characters')
    .max(100, 'Project name must not exceed 100 characters'),
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
    return { oldProject, newProject }
  },
  onSuccess: () => {
    toast.showSuccess({ detail: 'Project settings updated successfully' })
  },
  onSettled: (_data, _error, _vars, { newProject }) => {
    if (!newProject) return
    queryCache.invalidateQueries({ key: ['project', newProject.id] })
  },
  onError(_error, projectInfo, { newProject, oldProject }) {
    if (newProject === queryCache.getQueryData(['project', projectInfo.id])) {
      queryCache.setQueryData(['project', projectInfo.id], oldProject)
    }
    toast.showError({ detail: 'An error occurred while updating the project settings' })
  },
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  updateProjectFn(form.value)
}

const { mutate: deleteProjectFn, isLoading: isDeleting } = useMutation({
  mutation: () => deleteProject(project.value.id, organizationId.value),
  onSuccess: () => {
    toast.showSuccess({ detail: 'Project deleted successfully' })
    router.push('/projects')
  },
  onError: () => {
    toast.showError({ detail: 'An error occurred while deleting the project' })
  },
})

function onDeleteProject() {
  confirm.require({
    header: 'Delete Project',
    message: `This will permanently delete "${project.value.name}" and all its data. This action cannot be undone.`,
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      deleteProjectFn()
    },
  })
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4 mt-6">
    <div class="col-span-12 lg:col-span-8">
      <div class="card">
        <div class="font-semibold text-lg mb-6">Project Details</div>

        <Form :resolver :initial-values="form" @submit="onFormSubmit" class="space-y-6">
          <FormField v-slot="$field" name="name">
            <label for="name" class="font-medium text-surface-900 dark:text-surface-0 block mb-2">
              Name
            </label>
            <InputText
              input-id="name"
              v-model="form.name"
              class="w-full"
              placeholder="Enter project name"
            />
            <Message
              v-if="$field?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
            >
              {{ $field.error?.message }}
            </Message>
          </FormField>

          <FormField v-slot="$field" name="description">
            <label
              for="description"
              class="font-medium text-surface-900 dark:text-surface-0 block mb-2"
            >
              Description
            </label>
            <Textarea
              input-id="description"
              v-model="form.description"
              rows="5"
              class="w-full"
              placeholder="Describe your project to help others understand its purpose and goals"
            />
            <Message
              v-if="$field?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
            >
              {{ $field.error?.message }}
            </Message>
          </FormField>

          <div class="flex justify-end gap-2 pt-4">
            <Button type="submit" label="Save" :loading="isLoading" />
          </div>
        </Form>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-4">
      <div class="card">
        <div class="font-semibold text-lg mb-4">Delete Project</div>
        <p class="text-surface-600 dark:text-surface-400 mb-6">
          This will affect all content and members of this project.
          <a
            href="#"
            class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline transition-colors"
          >
            Learn more about deleting projects.
          </a>
        </p>
        <Button
          label="Delete"
          severity="danger"
          :loading="isDeleting"
          disabled
          @click="onDeleteProject"
        />
      </div>
    </div>
  </div>
  <ConfirmDialog style="width: 450px" />
</template>
