import primeVue from '@/plugins/prime-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/styles.scss'
import '@/assets/tailwind.css'
import gatewayRegistry from '@/plugins/gateway-registry'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(primeVue)
app.use(pinia)
app.use(gatewayRegistry)

app.mount('#app')
