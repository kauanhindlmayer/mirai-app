/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" /> //

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'primevue/toasteventbus' {
  import type { EventBus } from 'primevue/utils'
  export default {} as ReturnType<typeof EventBus>
}
