import { App } from 'vue'
import DropList from './src/index.vue'

DropList.install = (app: App): void => {
  app.component(DropList.name, DropList)
}

export default DropList
