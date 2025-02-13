import { PiniaColada } from '@pinia/colada'
import { PiniaColadaDelay } from '@pinia/colada-plugin-delay'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import App from '~/App.vue'
import primeVue from '~/plugins/prime-vue'
import router from '~/router'

import '~/assets/styles.scss'
import '~/assets/tailwind.css'

const app = createApp(App)

app.use(router)
app.use(primeVue)
app.use(createMetaManager())
app.use(createPinia())
app.use(PiniaColada, {
  plugins: [
    PiniaColadaDelay({
      delay: 200,
    }),
  ],
})

app.mount('#app')
