import type { App } from 'vue'
import { defineAsyncComponent } from 'vue'
import { loadAsyncComponent } from '@/utils/async-component'
import GLoading from './loading'
import NewInput from './input/src/new-input.vue'

import Focus from '@/directives/focus'

const components = [
  GLoading,
  NewInput,
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
  app.component('GTooltipPopover', defineAsyncComponent(() => import('./tooltip-popover')))
  app.component('GInput', defineAsyncComponent(() => import('./input')))
  app.component('GInputNumber', defineAsyncComponent(() => import('./input-number')))
  app.component('GSelect', defineAsyncComponent(() => import('./select')))
  app.component('GField', defineAsyncComponent(() => import('./field')))
  app.component('GColorPicker', defineAsyncComponent(() => import('./color-picker')))
  app.component('GUploadImage', defineAsyncComponent(() => import('./upload-image')))
  app.component('GLangSelect', defineAsyncComponent(() => import('./lang-select')))
  app.component('GFieldCollapse', defineAsyncComponent(() => import('./field-collapse')))
  app.component('GSelectImage', defineAsyncComponent(() => import('./select-image')))
  app.component('GSlider', defineAsyncComponent(() => import('./slider')))
  app.component('GSelectSuggest', defineAsyncComponent(() => import('./select-suggest')))
  app.component('GSelectShape', defineAsyncComponent(() => import('./select-shape')))
  app.component('GComIcon', defineAsyncComponent(() => import('./com-icon')))

  // async registry with loading
  app.component('GMonacoEditor', loadAsyncComponent(() => import('./monaco-editor')))

  plugins.forEach(plugin => {
    app.use(plugin)
  })
}

export default {
  install,
}
