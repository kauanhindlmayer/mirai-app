<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object, string } from 'yup'

const userStore = useUserStore()
const router = useRouter()

const form = ref<LoginUserRequest>({
  email: '',
  password: '',
})
const shouldRememberUser = ref(false)

const loginUserSchema = object({
  email: string().email().required('Email is a required field'),
  password: string().required('Password is a required field'),
})

const resolver = ref(yupResolver(loginUserSchema))

const { mutate: loginUserFn, isLoading } = useMutation({
  mutation: async (request: LoginUserRequest) => {
    const response = await loginUser(request)
    localStorage.setItem('accessToken', response.accessToken)
    return await getCurrentUser()
  },
  onSuccess: (user: User) => {
    userStore.setUser(user)
    router.push('/projects')
  },
  onError: displayError,
})

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return
  loginUserFn(form.value)
}
</script>

<template>
  <section
    class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto"
  >
    <div class="flex w-full h-full justify-center gap-12">
      <div class="flex flex-col py-20 lg:min-w-[30rem]">
        <RouterLink to="/" class="flex items-center justify-center lg:justify-start mb-8 ml-2">
          <AppLogo />
        </RouterLink>
        <div class="flex flex-col justify-center grow">
          <div class="max-w-md mx-auto w-full">
            <h5 class="title-h5 text-center lg:text-left">Login</h5>
            <p class="body-small mt-3.5 text-center lg:text-left">Please enter your details</p>
            <!-- <button class="button-button mt-8"><Google /> Sign in with Google</button>
            <button class="button-button mt-4"><GitHub /> Sign in with GitHub</button>
            <div class="flex items-center gap-3.5 my-7">
              <span class="flex-1 h-[1px] bg-surface-200 dark:bg-surface-800" />
              <span class="body-small text-surface-400 dark:text-surface-600">or</span>
              <span class="flex-1 h-[1px] bg-surface-200 dark:bg-surface-800" />
            </div> -->
            <Form :resolver @submit="onFormSubmit">
              <FormField v-slot="$field" name="email">
                <InputText
                  type="text"
                  v-model="form.email"
                  class="w-full"
                  placeholder="Email"
                  data-testid="email-input"
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
                  data-testid="password-input"
                />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                  {{ $field.error?.message }}
                </Message>
              </FormField>
              <div class="my-8 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Checkbox input-id="remember" v-model="shouldRememberUser" binary />
                  <label for="remember" class="body-small"> Remember me </label>
                </div>
                <RouterLink
                  to="/forgot-password"
                  class="body-small text-primary-500 hover:underline"
                >
                  Forgot password?
                </RouterLink>
              </div>
              <Button
                type="submit"
                class="body-button w-full"
                :loading="isLoading"
                data-testid="login-button"
              >
                Login
              </Button>
            </Form>
            <div class="mt-8 body-small text-center lg:text-left">
              Not registered?
              <RouterLink to="/register" class="text-primary-500 hover:underline">
                Create an Account
              </RouterLink>
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
