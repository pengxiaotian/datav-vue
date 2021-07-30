import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import SelectShape from './src/index.vue'

SelectShape.install = (app: App): void => {
  app.component(SelectShape.name, SelectShape)
}

export default SelectShape as SFCWithInstall<typeof SelectShape>
