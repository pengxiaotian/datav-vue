import type { App } from 'vue'

import {
  ElAside,
  ElAutocomplete,
  ElAvatar,
  ElButton,
  ElButtonGroup,
  ElCard,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElCollapseTransition,
  ElColorPicker,
  ElContainer,
  ElDialog,
  ElDrawer,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElFooter,
  ElForm,
  ElFormItem,
  ElHeader,
  ElInput,
  ElInputNumber,
  ElMain,
  ElOption,
  ElOptionGroup,
  ElPopconfirm,
  ElPopover,
  ElPopper,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTabPane,
  ElTabs,
  ElTag,
  ElTooltip,
  ElUpload,

  ElInfiniteScroll,
  ElLoading,
  ElMessage,
  ElMessageBox,

  locale,
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'

const components = [
  ElAside,
  ElAutocomplete,
  ElAvatar,
  ElButton,
  ElButtonGroup,
  ElCard,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElCollapseTransition,
  ElColorPicker,
  ElContainer,
  ElDialog,
  ElDrawer,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElFooter,
  ElForm,
  ElFormItem,
  ElHeader,
  ElInput,
  ElInputNumber,
  ElMain,
  ElOption,
  ElOptionGroup,
  ElPopconfirm,
  ElPopover,
  ElPopper,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTabPane,
  ElTabs,
  ElTag,
  ElTooltip,
  ElUpload,
]

const plugins = [
  ElInfiniteScroll,
  ElLoading,
  ElMessage,
  ElMessageBox,
]

const install = (app: App): void => {
  locale(lang)

  app.config.globalProperties.$ELEMENT = { size: 'medium' }

  components.forEach(component => {
    app.component(component.name, component)
  })

  plugins.forEach(plugin => {
    app.use(plugin)
  })
}

export default {
  install,
}
