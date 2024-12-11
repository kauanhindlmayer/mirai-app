import axios from '@/plugins/axios'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('users', () => {
  const router = useRouter()
  const toast = useToast()

  async function register(form: Record<string, string>) {
    try {
      await axios.post('/users/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
      router.push({ name: 'login' })
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email already exists',
        life: 3000,
      })
    }
  }

  async function login(form: Record<string, string>) {
    try {
      const response = await axios.post('/users/login', {
        email: form.email,
        password: form.password,
      })
      localStorage.setItem('accessToken', response.data.accessToken)
      router.push({ name: 'projects-home' })
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid credentials',
        life: 3000,
      })
    }
  }

  function logout() {
    localStorage.removeItem('accessToken')
    router.push({ name: 'login' })
  }

  return {
    register,
    login,
    logout,
  }
})
