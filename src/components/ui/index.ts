import type { App } from 'vue'
import { defineAsyncComponent } from 'vue'
import { loadAsyncComponent } from '@/utils/async-component'
import GLoading from './loading'
import NewInput from './input/src/new-input.vue'

import Focus from '@/directives/focus'

const plugins = [
  Focus,
]

const install = (app: App): void => {
  // sync register
  app.component('GLoading', GLoading)
  app.component('NewInput', NewInput)

  // async register
  app.component('GColorPicker', defineAsyncComponent(() => import('./color-picker')))
  app.component('GComIcon', defineAsyncComponent(() => import('./com-icon')))
  app.component('GField', defineAsyncComponent(() => import('./field')))
  app.component('GFieldCollapse', defineAsyncComponent(() => import('./field-collapse')))
  app.component('GInput', defineAsyncComponent(() => import('./input')))
  app.component('GInputNumber', defineAsyncComponent(() => import('./input-number')))
  app.component('GLangSelect', defineAsyncComponent(() => import('./lang-select')))
  app.component('GSelect', defineAsyncComponent(() => import('./select')))
  app.component('GSelectImage', defineAsyncComponent(() => import('./select-image')))
  app.component('GSelectShape', defineAsyncComponent(() => import('./select-shape')))
  app.component('GSelectSuggest', defineAsyncComponent(() => import('./select-suggest')))
  app.component('GSlider', defineAsyncComponent(() => import('./slider')))
  app.component('GSliderRange', defineAsyncComponent(() => import('./slider-range')))
  app.component('GSwitch', defineAsyncComponent(() => import('./switch')))
  app.component('GTooltipPopover', defineAsyncComponent(() => import('./tooltip-popover')))
  app.component('GUploadImage', defineAsyncComponent(() => import('./upload-image')))
  // -- prepend async register placeholder --

  // async registry with loading
  app.component('GMonacoEditor', loadAsyncComponent(() => import('./monaco-editor')))

  plugins.forEach(plugin => {
    app.use(plugin)
  })
}

export default {
  install,
}
