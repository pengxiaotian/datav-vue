import { App } from 'vue'
import Field from './src/index.vue'

Field.install = (app: App): void => {
  app.component(Field.name, Field)
}

export default Field
