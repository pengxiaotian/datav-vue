import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import Slider from './src/index.vue'

Slider.install = (app: App): void => {
  app.component(Slider.name, Slider)
}

export default Slider as SFCWithInstall<typeof Slider>
