import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import DatePicker from './src/index.vue'
import DatePickerProp from './src/config.vue'

DatePicker.install = (app: App): void => {
  app.component(DatePicker.name, DatePicker)
  app.component(DatePickerProp.name, DatePickerProp)
}

export default DatePicker as SFCWithInstall<typeof DatePicker>
