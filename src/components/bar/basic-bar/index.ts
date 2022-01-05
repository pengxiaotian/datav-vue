import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BasicBar from './src/index.vue'

BasicBar.install = (app: App): void => {
  app.component('VBasicBar', BasicBar)
  app.component('VBasicBarProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BasicBar as SFCWithInstall<typeof BasicBar>
