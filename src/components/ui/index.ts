import type { App } from 'vue'
import GDropList from './drop-list'
import GDropListItem from './drop-list-item'
import GDropListPopover from './drop-list-popover'
import GTooltipPopover from './tooltip-popover'

const components = [
  GDropList,
  GDropListItem,
  GDropListPopover,
  GTooltipPopover,
]

const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export {
  GDropList,
  GDropListItem,
  GDropListPopover,
  GTooltipPopover,
  install,
}

export default {
  install,
}
