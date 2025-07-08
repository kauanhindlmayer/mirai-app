import { fileURLToPath, URL } from 'node:url'

import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    noDiscovery: true,
    include: ['quill', 'yup'],
  },
  plugins: [
    vue(),
    VueRouter(),
    Components({
      resolvers: [PrimeVueResolver()],
      dirs: ['src/components', 'src/layout'],
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.vue\.[tj]sx?\?vue/, /\.md$/],
      imports: [
        'vue',
        VueRouterAutoImports,
        {
          pinia: ['defineStore', 'storeToRefs', 'acceptHMRUpdate'],
        },
        {
          '@pinia/colada': ['useQuery', 'useQueryCache', 'useMutation'],
        },
        {
          'vue-meta': ['useMeta'],
        },
      ],
      dts: true,
      viteOptimizeDeps: true,
      dirs: ['src/api', 'src/composables', 'src/queries', 'src/stores', 'src/types', 'src/utils'],
      vueTemplate: true,
    }),
    tailwindcss(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['import'],
      },
    },
  },
  server: {
    host: true,
    port: parseInt(process.env.PORT ?? '5173'),
    proxy: {
      '/api': {
        target:
          process.env['services__mirai-api__https__0'] ||
          process.env['services__mirai-api__http__0'],
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
})
