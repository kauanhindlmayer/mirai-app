import axios from '@/plugins/axios';
import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('users', () => {
    const router = useRouter();
    const toast = useToast();

    async function register({ firstName, lastName, email, password }) {
        try {
            await axios.post('/users/register', {
                firstName,
                lastName,
                email,
                password
            });
            router.push({ name: 'login' });
        } catch {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Email already exists',
                life: 3000
            });
        }
    }

    async function login({ email, password, shouldRememberCredentials }) {
        try {
            const { accessToken } = await axios.post('/users/login', {
                email,
                password
            });

            if (shouldRememberCredentials) {
                localStorage.setItem('accessToken', accessToken);
            }

            router.push({ name: 'empty' });
        } catch {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Invalid credentials',
                life: 3000
            });
        }
    }

    function logout() {
        localStorage.removeItem('accessToken');
        router.push({ name: 'login' });
    }

    return {
        register,
        login,
        logout
    };
});
