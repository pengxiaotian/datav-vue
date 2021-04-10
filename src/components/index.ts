import type { App } from 'vue'
import VMainTitle from './text/main-title'

const components = [
  VMainTitle,
]

const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  install,
}
