import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Marquee from './src/index.vue'

Marquee.install = (app: App): void => {
  app.component('VMarquee', Marquee)
  app.component('VMarqueeProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Marquee as SFCWithInstall<typeof Marquee>
