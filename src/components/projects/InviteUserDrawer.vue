<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object, string } from 'yup'

const form = ref({
  email: '',
})

const inviteUserSchema = object({
  email: string().email('Please enter a valid email address').required('Email is required'),
})

const resolver = ref(yupResolver(inviteUserSchema))

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
}

const { teams, isLoading } = useTeams()
const selectedTeam = ref<Team | null>(null)

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
    class="w-full! sm:w-[36rem]!"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">Invite Users</span>
    </template>
    <Form :resolver @submit="onFormSubmit" class="flex flex-col h-full">
      <div class="grow space-y-4">
        <FormField v-slot="$field" name="email">
          <label for="email" class="font-medium text-surface-900 dark:text-surface-0">
            Users
          </label>
          <InputText
            input-id="email"
            v-model="form.email"
            placeholder="Enter email address"
            class="w-full"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="email">
          <label for="email" class="font-medium text-surface-900 dark:text-surface-0">
            Team(s)
          </label>
          <Select
            v-model="selectedTeam"
            :options="teams"
            :loading="isLoading"
            option-label="name"
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
        <Button type="submit" label="Add" :loading="isLoading" :disabled="isLoading" />
      </div>
    </Form>
  </Drawer>
</template>
