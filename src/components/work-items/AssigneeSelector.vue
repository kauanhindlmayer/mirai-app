<script setup lang="ts">
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { getProjectUsers } from '~/api/projects'
import type { AssigneeResponse } from '~/types/work-item'

const organizationStore = useOrganizationStore()
const { organization } = storeToRefs(organizationStore)

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

defineProps<{ disabled?: boolean }>()

const assignee = defineModel<AssigneeResponse | null>()
const searchTerm = ref('')

const { data: projectUsers, refetch: refetchProjectUsers } = useQuery({
  key: () => ['project-users', project.value.id, searchTerm.value],
  query: () => getProjectUsers(organization.value.id, project.value.id, searchTerm.value),
  enabled: () => !!project.value.id,
})

function handleSearch(event: AutoCompleteCompleteEvent) {
  searchTerm.value = event.query
  refetchProjectUsers()
}
</script>

<template>
  <AutoComplete
    v-model="assignee"
    :suggestions="projectUsers"
    :disabled="disabled"
    option-label="fullName"
    placeholder="Assign to..."
    class="w-full"
    dropdown
    dropdown-mode="blank"
    @complete="handleSearch"
  >
    <template #option="{ option }">
      <div class="flex items-center gap-2 p-2">
        <Avatar
          :image="option.imageUrl || undefined"
          :icon="option.imageUrl ? undefined : 'pi pi-user'"
          :label="option.imageUrl ? undefined : option.fullName?.charAt(0)"
          shape="circle"
        />
        <div class="flex flex-col">
          <span>{{ option.fullName }}</span>
          <small v-if="option.email" class="text-surface-500">{{ option.email }}</small>
        </div>
      </div>
    </template>
  </AutoComplete>
</template>
