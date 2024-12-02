import type { App } from 'vue'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'

const primeVue = {
  install(app: App<Element>) {
    app.use(PrimeVue, {
      theme: {
        preset: Aura,
      },
    })
    app.use(ToastService)
  },
}

export default primeVue
