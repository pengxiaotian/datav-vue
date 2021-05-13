import { App } from 'vue'
import LangSelect from './src/index.vue'

LangSelect.install = (app: App): void => {
  app.component(LangSelect.name, LangSelect)
}

export default LangSelect
