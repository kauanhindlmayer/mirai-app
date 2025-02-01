import primeVue from '@/plugins/prime-vue'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import App from './App.vue'
import router from './router'

import '@/assets/styles.scss'
import '@/assets/tailwind.css'
import gatewayRegistry from '@/plugins/gateway-registry'

const metaManager = createMetaManager()
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(metaManager)
app.use(primeVue)
app.use(pinia)
app.use(PiniaColada)
app.use(gatewayRegistry)

app.mount('#app')
