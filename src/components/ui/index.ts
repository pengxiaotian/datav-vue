import type { App } from 'vue'
import { loadAsyncComponent } from '@/utils/async-component'
import GDropList from './drop-list'
import GDropListItem from './drop-list-item'
import GDropListPopover from './drop-list-popover'
import GTooltipPopover from './tooltip-popover'
import GLoading from './loading'
import GInput from './input'
import GInputNumber from './input-number'
import GField from './field'
import GColorPicker from './color-picker'
import GUploadImage from './upload-image'
import GLangSelect from './lang-select'
import GFieldCollapse from './field-collapse'

import Focus from '@/directives/focus'

const components = [
  GDropList,
  GDropListItem,
  GDropListPopover,
  GTooltipPopover,
  GLoading,
  GInput,
  GInputNumber,
  GField,
  GColorPicker,
  GUploadImage,
  GLangSelect,
  GFieldCollapse,
]

const plugins = [
  Focus,
]

const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component)
  })

  app.component('GMonacoEditor', loadAsyncComponent(() => import('./monaco-editor')))

  plugins.forEach(plugin => {
    app.use(plugin)
  })
}

export default {
  install,
}
