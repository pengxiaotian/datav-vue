import type { App } from 'vue'
import { loadAsyncComponent } from '@/utils/async-component'
import Decoration from './src/index.vue'

Decoration.install = (app: App): void => {
  app.component('VDecoration', Decoration)
  app.component('VDecorationProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Decoration as SFCWithInstall<typeof Decoration>
