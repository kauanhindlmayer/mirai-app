import axios from '@/plugins/axios';
import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('users', () => {
    const router = useRouter();
    const toast = useToast();

    async function login(email, password, remember) {
        try {
            const { accessToken } = await axios.post('/users/login', {
                email,
                password
            });

            if (remember) {
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
        login,
        logout
    };
});
