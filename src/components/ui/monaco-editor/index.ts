import { App } from 'vue'
import MonacoEditor from './src/index.vue'

MonacoEditor.install = (app: App): void => {
  app.component(MonacoEditor.name, MonacoEditor)
}

export default MonacoEditor
