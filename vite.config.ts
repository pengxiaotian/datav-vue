import type { ConfigEnv } from 'vite'

import { loadEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/alexlafroscia/vite-plugin-handlebars#requirements
// nodejs >= 14
import handlebars from 'vite-plugin-handlebars'
import MonacoEditorNlsPlugin from 'vite-plugin-monaco-editor-nls'

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
      handlebars({
        partialDirectory: pathResolve('./handlebars/partials'),
        // helperDirectory: pathResolve('./handlebars/helpers'),
        runtimeOptions: {
          helpers: {
            eq: (a, b) => a === b,
            neq: (a, b) => a !== b,
          },
        },
      }),
      MonacoEditorNlsPlugin(),
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
        'particles.js',
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
      outDir: 'site',
    },
    esbuild: {
    },
  })
}
