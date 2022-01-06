import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import FullScreen from './src/index.vue'

FullScreen.install = (app: App): void => {
  app.component('VFullScreen', FullScreen)
  app.component('VFullScreenProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default FullScreen as SFCWithInstall<typeof FullScreen>
