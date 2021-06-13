import type { ConfigEnv } from 'vite'

import { loadEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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
      plainText(/\.hbs$/),
    ],
    server: {
      host: '0.0.0.0',
      port: 9090,
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
    },
    optimizeDeps: {
      include: [
        'accounting',
        'axios',
        'crypto-js',
        'dayjs',
        'echarts',
        'element-plus',
        'gsap',
        'html2canvas',
        'js-cookie',
        'lodash-es',
        'monaco-editor/esm/vs/editor/editor.worker',
        'monaco-editor/esm/vs/language/json/json.worker',
        'monaco-editor/esm/vs/language/css/css.worker',
        'monaco-editor/esm/vs/language/html/html.worker',
        'monaco-editor/esm/vs/language/typescript/ts.worker',
        'particles.vue3',
        'shortid',
        'vue',
        'vue-class-component',
        'vue-i18n',
        'vue-router',
        'vuex',
        'vuex-module-decorators',
      ],
      exclude: [],
    },
    build: {
      sourcemap: false,
      outDir: 'website',
    },
    esbuild: {
    },
  })
}
