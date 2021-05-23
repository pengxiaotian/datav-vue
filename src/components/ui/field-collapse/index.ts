import { App } from 'vue'
import FieldCollapse from './src/index.vue'

FieldCollapse.install = (app: App): void => {
  app.component(FieldCollapse.name, FieldCollapse)
}

export default FieldCollapse
