import type { App } from 'vue'
import PropsConfigForm from './props-config-form/index'

const components = [
  PropsConfigForm,
]

const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  install,
}
