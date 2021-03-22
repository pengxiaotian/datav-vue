import type { App } from 'vue'

export default {
  install(app: App) {
    app.directive('focus', {
      mounted(el: HTMLInputElement) {
        const defaultValue = el.getAttribute('default-value')
        if (defaultValue) {
          el.value = defaultValue
        }
        el.focus()
      },
    })
  },
}
