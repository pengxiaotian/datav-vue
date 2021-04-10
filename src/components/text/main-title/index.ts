import { App } from 'vue'
import MainTitle from './src/index.vue'

MainTitle.install = (app: App): void => {
  app.component(MainTitle.name, MainTitle)
}

export default MainTitle
