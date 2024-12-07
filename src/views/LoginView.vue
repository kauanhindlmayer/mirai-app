<script setup>
import Logo from '@/components/Logo.vue';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const remember = ref(false);
</script>

<template>
    <section
        class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto"
    >
        <div class="flex w-full h-full justify-center gap-12">
            <div class="flex flex-col py-20 lg:min-w-[30rem]">
                <router-link
                    to="/"
                    class="flex items-center justify-center lg:justify-start mb-8"
                >
                    <Logo />
                </router-link>
                <div class="flex flex-col justify-center flex-grow">
                    <div class="max-w-md mx-auto w-full">
                        <h5 class="title-h5 text-center lg:text-left">
                            Login
                        </h5>
                        <p class="body-small mt-3.5 text-center lg:text-left">
                            Please enter your details
                        </p>
                        <form>
                            <InputText
                                type="text"
                                v-model="email"
                                class="w-full"
                                placeholder="Email"
                            />
                            <InputText
                                type="password"
                                v-model="password"
                                class="w-full mt-4"
                                placeholder="Password"
                            />
                            <div
                                class="my-8 flex items-center justify-between"
                            >
                                <div class="flex items-center gap-2">
                                    <Checkbox
                                        inputId="remember"
                                        v-model="remember"
                                        :binary="true"
                                    />
                                    <label for="remember" class="body-small">
                                        Remember me
                                    </label>
                                </div>
                                <router-link
                                    to="/auth/forgot-password"
                                    class="body-small text-primary-500 hover:underline"
                                >
                                    Forgot password?
                                </router-link>
                            </div>
                            <button type="submit" class="body-button w-full">
                                Login
                            </button>
                        </form>
                        <div class="mt-8 body-small text-center lg:text-left">
                            Not registered?
                            <router-link
                                to="/register"
                                class="text-primary-500 hover:underline"
                            >
                                Create an Account
                            </router-link>
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
