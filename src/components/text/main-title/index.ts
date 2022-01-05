import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import MainTitle from './src/index.vue'

MainTitle.install = (app: App) => {
  app.component('VMainTitle', MainTitle)
  app.component('VMainTitleProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default MainTitle as SFCWithInstall<typeof MainTitle>
