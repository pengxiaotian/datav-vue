import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import MainImg from './src/index.vue'

MainImg.install = (app: App): void => {
  app.component('VMainImg', MainImg)
  app.component('VMainImgProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default MainImg as SFCWithInstall<typeof MainImg>
