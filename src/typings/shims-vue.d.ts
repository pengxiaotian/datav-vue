declare module '*.vue' {
  import type { App, defineComponent } from 'vue'

  const component: ReturnType<typeof defineComponent> & {
    install(app: App): void
  }

  export default component
}

declare module 'particles.vue3'

declare module '*.hbs' {
  const plainText: string

  export {
    plainText,
  }
}
