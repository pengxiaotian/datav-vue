import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BasicLine from './src/index.vue'

BasicLine.install = (app: App): void => {
  app.component('VBasicLine', BasicLine)
  app.component('VBasicLineProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BasicLine as SFCWithInstall<typeof BasicLine>
