import type { ConfigEnv } from 'vite'
import { loadEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import plainText from 'vite-plugin-plain-text'

import { resolve } from 'path'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  const dirRoot = process.cwd()

  const env = loadEnv(mode, dirRoot)

  return defineConfig({
    base: env.VITE_PUBLIC_PATH,
    plugins: [
      vue(),
      ElementPlus(),
      plainText(/\.hbs$/),
    ],
    server: {
      host: '0.0.0.0',
      port: 9096,
    },
    resolve: {
      alias: {
        '@': pathResolve('./src'),
        'vue-i18n': pathResolve('./node_modules/vue-i18n/dist/vue-i18n.cjs.js'),
      },
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __DEV__: process.env.NODE_ENV !== 'production',
      __PROD__: process.env.NODE_ENV === 'production',
    },
    optimizeDeps: {
      include: [
        '@monaco-editor/loader',
        'accounting',
        'axios',
        'axios-mock-adapter',
        'crypto-js',
        'dayjs',
        'echarts',
        'echarts-wordcloud',
        'element-plus',
        'gsap',
        'html2canvas',
        'js-cookie',
        'lodash-es',
        'mockjs',
        'monaco-editor',
        'naive-ui',
        'number-precision',
        'particles.vue3',
        'shortid',
        'vue',
        'vue-echarts',
        'vue-i18n',
        'vue-router',
      ],
      exclude: [],
    },
    build: {
      sourcemap: false,
      outDir: 'website',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          share: resolve(__dirname, 'index.share.html'),
        },
      },
    },
    esbuild: {
    },
  })
}
