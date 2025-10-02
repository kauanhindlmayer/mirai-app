<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import type { SelectFilterEvent } from 'primevue/select'
import { object, string } from 'yup'
import { addUserToProject } from '~/api/projects'
import { useAvailableProjectUsers } from '~/queries/organizations'

const organizationStore = useOrganizationStore()
const { organization } = storeToRefs(organizationStore)

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const { isVisible, showDrawer, hideDrawer } = useDrawer()

const inviteUserSchema = object({
  userId: string().required('User is required'),
  teamId: string().nullable(),
})

const resolver = ref(yupResolver(inviteUserSchema))

const form = ref({
  userId: '',
  teamId: null as string | null,
})

const {
  users: availableUsers,
  isLoading: isLoadingAvailableUsers,
  filters,
} = useAvailableProjectUsers()

const selectedUser = computed(() =>
  availableUsers.value?.items.find((u) => u.id === form.value.userId),
)

function onUserFilter(event: SelectFilterEvent) {
  filters.value.searchTerm = event.value
}

const { teams, isLoading: isLoadingTeams } = useTeams()

const toast = useAppToast()

const { mutate: addUserToProjectFn } = useMutation({
  mutation: (userId: string) => addUserToProject(organization.value.id, project.value.id, userId),
  onSuccess: () => {
    toast.showSuccess({ detail: 'User added to project successfully' })
    form.value.userId = ''
    form.value.teamId = null
    hideDrawer()
  },
  onError: () => {
    toast.showError({ detail: 'Failed to add user to project' })
  },
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  addUserToProjectFn(form.value.userId)
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
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">Add User</span>
    </template>
    <Form :initial-values="form" :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="grow space-y-4">
        <FormField v-slot="$field" name="userId">
          <label for="userId" class="font-medium text-surface-900 dark:text-surface-0">
            User
          </label>
          <Select
            input-id="userId"
            v-model="form.userId"
            :options="availableUsers?.items"
            :loading="isLoadingAvailableUsers"
            option-value="id"
            placeholder="Select a user"
            class="w-full"
            filter
            @filter="onUserFilter"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <Avatar
                  v-if="option.imageUrl"
                  :image="option.imageUrl"
                  pt:image:class="rounded-lg!"
                />
                <Avatar
                  v-else
                  :label="option.fullName.charAt(0)"
                  class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-avatar"
                />
                <div class="flex flex-col">
                  <span class="font-medium">{{ option.fullName }}</span>
                  <span class="text-sm text-surface-500">{{ option.email }}</span>
                </div>
              </div>
            </template>
            <template #value>
              <div v-if="selectedUser" class="flex items-center gap-2">
                <Avatar
                  v-if="selectedUser.imageUrl"
                  :image="selectedUser.imageUrl"
                  pt:image:class="rounded-lg!"
                />
                <Avatar
                  v-else
                  :label="selectedUser.fullName.charAt(0)"
                  class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-avatar"
                />
                <span>{{ selectedUser.fullName }}</span>
              </div>
            </template>
          </Select>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="teamId">
          <label for="teamId" class="font-medium text-surface-900 dark:text-surface-0">
            Team(s)
          </label>
          <Select
            input-id="teamId"
            v-model="form.teamId"
            :options="teams"
            :loading="isLoadingTeams"
            option-label="name"
            option-value="id"
            placeholder="Select a team (optional)"
            class="w-full"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>

      <div class="flex justify-end mt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="hideDrawer" />
        <Button
          type="submit"
          label="Add"
          :loading="isLoadingAvailableUsers"
          :disabled="!form.userId"
        />
      </div>
    </Form>
  </Drawer>
</template>
