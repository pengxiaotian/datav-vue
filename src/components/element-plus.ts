import type { App } from 'vue'

import {
  ElTabPane,
  ElTabs,
} from 'element-plus'

const components = [
  ElTabPane,
  ElTabs,
]

const install = (app: App): void => {
  app.config.globalProperties.$ELEMENT = { size: 'medium' }

  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  install,
}
