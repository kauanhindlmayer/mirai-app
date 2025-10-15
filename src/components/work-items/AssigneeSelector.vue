<script setup lang="ts">
import type { VirtualScrollerProps } from 'primevue'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { getProjectUsers } from '~/api/projects'
import type { AssigneeResponse, ProjectUserResponse } from '~/types/work-item'

defineProps<{ disabled?: boolean }>()

const assignee = defineModel<AssigneeResponse | null>()

const organizationStore = useOrganizationStore()
const { project } = useProjectContext()

const { organization } = storeToRefs(organizationStore)

const searchTerm = ref('')
const page = ref(1)
const allUsers = ref<ProjectUserResponse[]>([])
const hasNextPage = ref(true)

const {
  data: usersResponse,
  isLoading,
  refetch,
} = useQuery({
  key: () => ['project-users', project.value.id, searchTerm.value, page.value],
  query: () =>
    getProjectUsers(organization.value.id, project.value.id, searchTerm.value, page.value, 10),
  enabled: () => false,
})

watch(
  usersResponse,
  (response) => {
    if (!response) return
    if (page.value === 1) {
      allUsers.value = response.items
    } else {
      allUsers.value.push(...response.items)
    }
    hasNextPage.value = response.hasNextPage
  },
  { immediate: true },
)

function handleSearch(event: AutoCompleteCompleteEvent) {
  searchTerm.value = event.query
  page.value = 1
  refetch()
}

function onLazyLoad() {
  if (isLoading.value || !hasNextPage.value) return
  page.value += 1
  refetch()
}

const virtualScrollerOptions: VirtualScrollerProps = {
  lazy: true,
  onLazyLoad,
  itemSize: 56,
}
</script>

<template>
  <AutoComplete
    v-model="assignee"
    :suggestions="allUsers"
    :disabled="disabled"
    :loading="isLoading"
    option-label="fullName"
    placeholder="Assign to..."
    class="w-full"
    dropdown
    dropdown-mode="blank"
    @complete="handleSearch"
    :virtual-scroller-options="virtualScrollerOptions"
  >
    <template #option="{ option }">
      <div class="flex items-center gap-2">
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
