<script setup lang="ts">
import { useMutation } from '@pinia/colada'
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { object, string } from 'yup'
import { registerUser } from '~/api/users'
import LazyImage from '~/components/common/LazyImage.vue'
import { displayError } from '~/composables/displayError'
import type { RegisterUserRequest } from '~/types/user'

const router = useRouter()

const form = ref<RegisterUserRequest>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})
const hasAcceptedTerms = ref(false)

const registerUserSchema = object({
  firstName: string()
    .required('First Name is a required field')
    .matches(/^[a-zA-Z]+$/, 'First Name must contain only letters'),
  lastName: string()
    .required('Last Name is a required field')
    .matches(/^[a-zA-Z]+$/, 'Last Name must contain only letters'),
  email: string().email('Please enter a valid email address').required('Email is a required field'),
  password: string()
    .required('Password is a required field')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .min(8, 'Password must be at least 8 characters long'),
  hasAcceptedTerms: string().required('Please accept the Terms and Conditions'),
})

const resolver = ref(yupResolver(registerUserSchema))

function redirectToLogin() {
  router.push('/login')
}

const { mutate: registerUserFn, isLoading } = useMutation({
  mutation: registerUser,
  onSuccess: redirectToLogin,
  onError: displayError,
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  registerUserFn(form.value)
}
</script>

<template>
  <section
    class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto"
  >
    <div class="flex w-full h-full justify-center gap-12">
      <div class="flex flex-col py-20 lg:min-w-[30rem]">
        <RouterLink to="/" class="flex items-center justify-center lg:justify-start mb-8">
          <!-- <AppLogo /> -->
          <span class="app-name title-h7">MIRAI</span>
        </RouterLink>
        <div class="flex flex-col justify-center flex-grow">
          <div class="max-w-md mx-auto w-full">
            <h5 class="title-h5 text-center lg:text-left">Register</h5>
            <p class="body-small mt-3.5 text-center lg:text-left">Let's get started</p>
            <Form :resolver @submit="onFormSubmit">
              <FormField v-slot="$field" name="firstName">
                <InputText
                  type="text"
                  v-model="form.firstName"
                  class="w-full"
                  placeholder="First Name"
                />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                  {{ $field.error?.message }}
                </Message>
              </FormField>
              <FormField v-slot="$field" name="lastName">
                <InputText
                  type="text"
                  v-model="form.lastName"
                  class="w-full mt-4"
                  placeholder="Last Name"
                />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                  {{ $field.error?.message }}
                </Message>
              </FormField>
              <FormField v-slot="$field" name="email">
                <InputText
                  type="text"
                  v-model="form.email"
                  class="w-full mt-4"
                  placeholder="Email"
                />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                  {{ $field.error?.message }}
                </Message>
              </FormField>
              <FormField v-slot="$field" name="password">
                <InputText
                  type="password"
                  v-model="form.password"
                  class="w-full mt-4"
                  placeholder="Password"
                />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                  {{ $field.error?.message }}
                </Message>
              </FormField>
              <FormField v-slot="$field" name="hasAcceptedTerms" class="my-8">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Checkbox
                      inputId="hasAcceptedTerms"
                      v-model="hasAcceptedTerms"
                      :binary="true"
                    />
                    <label for="hasAcceptedTerms" class="body-small">
                      <span class="label-small text-surface-950 dark:text-surface-0">
                        I have read the
                      </span>
                      Terms and Conditions
                    </label>
                  </div>
                </div>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                  {{ $field.error?.message }}
                </Message>
              </FormField>

              <button type="submit" class="body-button w-full" :loading="isLoading">
                Register
              </button>
            </Form>
            <div class="mt-8 body-small text-center lg:text-left">
              Already have an account?
              <RouterLink to="/login" class="text-primary-500 hover:underline"> Login </RouterLink>
            </div>
          </div>
        </div>
        <div
          class="mt-8 text-center lg:text-start block relative text-surface-400 dark:text-surface-500 text-sm"
        >
          ©{{ new Date().getFullYear() }} Mirai Technologies
        </div>
      </div>
      <div class="hidden lg:flex h-full py-20">
        <div
          class="h-full w-full lg:max-w-[32.5rem] xl:max-w-[60.5rem] mx-auto flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] rounded-3xl border border-surface overflow-hidden"
        >
          <LazyImage
            class="w-auto h-full object-contain object-left"
            src="/layout/images/auth-image.svg"
            alt="Auth Image"
          />
        </div>
      </div>
    </div>
  </section>
</template>
