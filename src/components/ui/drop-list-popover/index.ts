import { App } from 'vue'
import DropListPopover from './src/index.vue'

DropListPopover.install = (app: App): void => {
  app.component(DropListPopover.name, DropListPopover)
}

export default DropListPopover
