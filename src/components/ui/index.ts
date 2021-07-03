import type { App } from 'vue'
import { defineAsyncComponent } from 'vue'
import { loadAsyncComponent } from '@/utils/async-component'
import GLoading from './loading'

import Focus from '@/directives/focus'

const components = [
  GLoading,
]

const plugins = [
  Focus,
]

const install = (app: App): void => {
  // sync register
  components.forEach(component => {
    app.component(component.name, component)
  })

  // async register
  app.component('GDropList', defineAsyncComponent(() => import('./drop-list')))
  app.component('GDropListItem', defineAsyncComponent(() => import('./drop-list-item')))
  app.component('GDropListPopover', defineAsyncComponent(() => import('./drop-list-popover')))
  app.component('GTooltipPopover', defineAsyncComponent(() => import('./tooltip-popover')))
  app.component('GInput', defineAsyncComponent(() => import('./input')))
  app.component('GInputNumber', defineAsyncComponent(() => import('./input-number')))
  app.component('GField', defineAsyncComponent(() => import('./field')))
  app.component('GColorPicker', defineAsyncComponent(() => import('./color-picker')))
  app.component('GUploadImage', defineAsyncComponent(() => import('./upload-image')))
  app.component('GLangSelect', defineAsyncComponent(() => import('./lang-select')))
  app.component('GFieldCollapse', defineAsyncComponent(() => import('./field-collapse')))

  // async registry with loading
  app.component('GMonacoEditor', loadAsyncComponent(() => import('./monaco-editor')))

  plugins.forEach(plugin => {
    app.use(plugin)
  })
}

export default {
  install,
}
