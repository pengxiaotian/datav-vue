import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import SliderRange from './src/index.vue'

SliderRange.install = (app: App): void => {
  app.component(SliderRange.name, SliderRange)
}

export default SliderRange as SFCWithInstall<typeof SliderRange>
