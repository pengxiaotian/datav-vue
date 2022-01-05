import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import BorderBox from './src/index.vue'

BorderBox.install = (app: App): void => {
  app.component('VBorderBox', BorderBox)
  app.component('VBorderBoxProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default BorderBox as SFCWithInstall<typeof BorderBox>
