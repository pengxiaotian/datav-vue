import type { App } from 'vue'
import { loadAsyncComponent } from '@/utils/async-component'
import DatePicker from './src/index.vue'

DatePicker.install = (app: App): void => {
  app.component('VDatePicker', DatePicker)
  app.component('VDatePickerProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default DatePicker as SFCWithInstall<typeof DatePicker>
