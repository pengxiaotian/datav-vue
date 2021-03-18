import { App } from 'vue'
import DropListItem from '../drop-list/src/drop-list-item.vue'

DropListItem.install = (app: App): void => {
  app.component(DropListItem.name, DropListItem)
}

export default DropListItem
