import { App } from 'vue'
import PropsConfigForm from './src/index.vue'

PropsConfigForm.install = (app: App): void => {
  app.component(PropsConfigForm.name, PropsConfigForm)
}

export default PropsConfigForm
