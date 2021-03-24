import { App } from 'vue'
import Loading from './src/index.vue'

Loading.install = (app: App): void => {
  app.component(Loading.name, Loading)
}

export default Loading
