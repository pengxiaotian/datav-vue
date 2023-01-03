import path from 'path'
import plainText from 'vite-plugin-plain-text'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
          'naive-ui',
          'vueuc',
          '@css-render/vue3-ssr',
          '@juggle/resize-observer',
        ]
        : ['@juggle/resize-observer'],
  },
  vite: {
    plugins: [
      plainText(/\.hbs$/),
    ],
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : [],
    },
  },
})
