import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { Tooltip } from 'primevue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import type { App } from 'vue'

const preset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
})

const primeVue = {
  install(app: App<Element>) {
    app.use(PrimeVue, {
      theme: {
        preset,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
    })
    app.use(ToastService)
    app.use(ConfirmationService)
    app.directive('tooltip', Tooltip)
  },
}

export default primeVue
