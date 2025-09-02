<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { updateUserProfile, updateAvatar, getCurrentUser } from '~/api/users'
import type { UpdateUserProfileRequest, User } from '~/types/user'
import { object, string } from 'yup'

const { layoutState } = useLayout()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const toast = useAppToast()

const profileForm = reactive<UpdateUserProfileRequest>({
  firstName: '',
  lastName: '',
})

const originalProfileData = ref<UpdateUserProfileRequest>({
  firstName: '',
  lastName: '',
})

const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const fileInput = useTemplateRef<InstanceType<typeof HTMLInputElement>>('fileInput')

const hasUnsavedChanges = computed(() => {
  return (
    profileForm.firstName !== originalProfileData.value.firstName ||
    profileForm.lastName !== originalProfileData.value.lastName
  )
})

const isLoading = computed(() => isUpdatingProfile.value || isUpdatingAvatar.value)

const profileSchema = object({
  firstName: string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(
      /^[\p{L}\p{M}\s'-]+$/u,
      'First name can only contain letters, spaces, hyphens, and apostrophes',
    ),
  lastName: string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must be less than 100 characters')
    .matches(
      /^[\p{L}\p{M}\s'-]+$/u,
      'Last name can only contain letters, spaces, hyphens, and apostrophes',
    ),
})

const resolver = ref(yupResolver(profileSchema))

const { mutate: updateProfileFn, isLoading: isUpdatingProfile } = useMutation({
  mutation: async (data: UpdateUserProfileRequest) => {
    await updateUserProfile(data)
    return await getCurrentUser()
  },
  onSuccess: (user: User) => {
    userStore.setUser(user)
    originalProfileData.value.firstName = profileForm.firstName
    originalProfileData.value.lastName = profileForm.lastName
    toast.showSuccess({ detail: 'Profile updated successfully' })
  },
  onError: displayError,
})

const { mutate: updateAvatarFn, isLoading: isUpdatingAvatar } = useMutation({
  mutation: async (file: File) => {
    await updateAvatar(file)
    return await getCurrentUser()
  },
  onSuccess: (user: User) => {
    userStore.setUser(user)
    resetAvatarSelection()
    toast.showSuccess({ detail: 'Avatar updated successfully' })
  },
  onError: displayError,
})

watchEffect(() => {
  if (!user.value) return
  profileForm.firstName = user.value.firstName
  profileForm.lastName = user.value.lastName
  originalProfileData.value.firstName = user.value.firstName
  originalProfileData.value.lastName = user.value.lastName
})

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.showError({ detail: 'Please select a valid image file' })
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.showError({ detail: 'Image size must be less than 5MB' })
    return
  }
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function handleUpdateProfile({ valid }: FormSubmitEvent) {
  if (!valid) return
  updateProfileFn(profileForm)
}

async function handleUpdateAvatar() {
  if (!avatarFile.value) return
  updateAvatarFn(avatarFile.value)
}

function resetAvatarSelection() {
  avatarFile.value = null
  avatarPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <Drawer
    v-model:visible="layoutState.isProfileSidebarVisible"
    position="right"
    header="Edit Profile"
    class="layout-profile-sidebar"
    :style="{ width: '340px' }"
    :pt="{
      pcCloseButton: { root: 'ml-auto' },
    }"
  >
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-surface-0/30 dark:bg-surface-900/30 z-50 flex items-center justify-center"
    >
      <ProgressSpinner size="small" />
    </div>
    <div class="flex flex-col gap-8 mb-6">
      <section>
        <h3 class="text-lg font-medium text-surface-900 dark:text-surface-0 mb-3">
          Profile Picture
        </h3>

        <div class="flex items-center gap-3">
          <Avatar
            :image="avatarPreview || user?.imageUrl || undefined"
            :icon="!avatarPreview && !user?.imageUrl ? 'pi pi-user' : undefined"
            size="large"
            pt:image:class="rounded-lg!"
            class="flex-shrink-0"
          />
          <div class="flex-1">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileSelect"
            />
            <Button
              label="Change Avatar"
              icon="pi pi-upload"
              severity="secondary"
              outlined
              size="small"
              class="w-full"
              @click="fileInput?.click()"
            />
            <p class="text-xs text-surface-500 dark:text-surface-400 mt-1">
              Accepts PNG or JPG files up to 5MB
            </p>
          </div>
        </div>

        <div v-if="avatarFile" class="flex gap-2 mt-3">
          <Button
            label="Save"
            icon="pi pi-check"
            :loading="isUpdatingAvatar"
            size="small"
            class="flex-1"
            @click="handleUpdateAvatar"
          />
          <Button
            icon="pi pi-times"
            severity="secondary"
            outlined
            :disabled="isUpdatingAvatar"
            size="small"
            @click="resetAvatarSelection"
          />
        </div>
      </section>
    </div>

    <section>
      <h3 class="text-lg font-medium text-surface-900 dark:text-surface-0 mb-3">
        Personal Information
      </h3>
      <Form
        :resolver
        :initial-values="profileForm"
        class="flex flex-col gap-3"
        validate-on="blur"
        @submit="handleUpdateProfile"
      >
        <FormField v-slot="$field" name="firstName">
          <label for="firstName" class="text-sm font-medium text-surface-700 dark:text-surface-200">
            First Name <small class="text-red-400">*</small>
          </label>
          <InputText
            input-id="firstName"
            v-model="profileForm.firstName"
            placeholder="Enter your first name"
            :disabled="isLoading"
            class="w-full"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="lastName">
          <label for="lastName" class="text-sm font-medium text-surface-700 dark:text-surface-200">
            Last Name <small class="text-red-400">*</small>
          </label>
          <InputText
            input-id="lastName"
            v-model="profileForm.lastName"
            placeholder="Enter your last name"
            :disabled="isLoading"
            class="w-full"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-surface-700 dark:text-surface-200">
            Email Address
          </label>
          <InputText :value="user?.email" disabled class="w-full" />
          <small class="text-xs text-surface-500 dark:text-surface-400">
            Contact support to change email
          </small>
        </div>

        <Button
          v-if="hasUnsavedChanges"
          type="submit"
          label="Save Changes"
          :loading="isUpdatingProfile"
          class="mt-2"
        />
      </Form>
    </section>
  </Drawer>
</template>
