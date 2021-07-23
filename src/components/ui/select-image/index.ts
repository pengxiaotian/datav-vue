import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import SelectImage from './src/index.vue'

SelectImage.install = (app: App): void => {
  app.component(SelectImage.name, SelectImage)
}

export default SelectImage as SFCWithInstall<typeof SelectImage>
