import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Timer from './src/index.vue'

Timer.install = (app: App): void => {
  app.component('VTimer', Timer)
  app.component('VTimerProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Timer as SFCWithInstall<typeof Timer>
