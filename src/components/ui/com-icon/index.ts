import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import ComIcon from './src/index.vue'

ComIcon.install = (app: App): void => {
  app.component(ComIcon.name, ComIcon)
}

export default ComIcon as SFCWithInstall<typeof ComIcon>
