import type { App } from 'vue'
import { loadAsyncComponent } from '@/utils/async-component'
import BasicPie from './src/index.vue'

BasicPie.install = (app: App): void => {
  app.component('VBasicPie', BasicPie)
  app.component('VBasicPieProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BasicPie as SFCWithInstall<typeof BasicPie>
