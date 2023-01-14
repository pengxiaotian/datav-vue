import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import TableBar from './src/index.vue'

TableBar.install = (app: App): void => {
  app.component('VTableBar', TableBar)
  app.component('VTableBarProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default TableBar as SFCWithInstall<typeof TableBar>
