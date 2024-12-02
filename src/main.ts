import '@/assets/styles.scss'
import '@/assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import primeVue from '@/plugins/prime-vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(primeVue)

app.mount('#app')
