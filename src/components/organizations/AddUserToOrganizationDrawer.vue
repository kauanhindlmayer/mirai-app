<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object, string } from 'yup'
import { addUserToOrganization } from '~/api/organizations'
import type { AddUserToOrganizationRequest } from '~/types/organization'

const { organizationId } = useOrganizationContext()

const form = ref<AddUserToOrganizationRequest>({
  email: '',
})

const addUserSchema = object({
  email: string().email('Please enter a valid email address').required('Email is required'),
})

const resolver = ref(yupResolver(addUserSchema))

const toast = useAppToast()
const queryCache = useQueryCache()

const { mutate: addUser, isLoading } = useMutation({
  mutation: (request: AddUserToOrganizationRequest) =>
    addUserToOrganization(organizationId.value, request),
  onSuccess: () => {
    toast.showSuccess({ summary: 'Success', detail: 'User added to organization successfully' })
    queryCache.invalidateQueries({ key: ['organization-users'] })
    hideDrawer()
  },
  onError: () => {
    toast.showError({ summary: 'Error', detail: 'Failed to add user to organization' })
  },
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  addUser(form.value)
}

const { isVisible, showDrawer } = useDrawer()

function hideDrawer() {
  isVisible.value = false
  form.value.email = ''
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
    @hide="hideDrawer"
  >
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">Add User</span>
    </template>
    <Form :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="grow space-y-4">
        <FormField v-slot="$field" name="email">
          <label for="email" class="font-medium text-surface-900 dark:text-surface-0">
            User Email <span class="text-red-500">*</span>
          </label>
          <InputText
            input-id="email"
            v-model="form.email"
            placeholder="name@example.com"
            class="w-full"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
      </div>

      <div class="flex justify-end mt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="hideDrawer" />
        <Button type="submit" label="Add" :loading="isLoading" />
      </div>
    </Form>
  </Drawer>
</template>
