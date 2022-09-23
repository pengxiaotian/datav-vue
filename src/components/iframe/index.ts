import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Iframe from './src/index.vue'

Iframe.install = (app: App): void => {
  app.component('VIframe', Iframe)
  app.component('VIframeProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Iframe as SFCWithInstall<typeof Iframe>
