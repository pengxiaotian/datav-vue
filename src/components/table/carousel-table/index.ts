import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import CarouselTable from './src/index.vue'

CarouselTable.install = (app: App): void => {
  app.component('VCarouselTable', CarouselTable)
  app.component('VCarouselTableProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default CarouselTable as SFCWithInstall<typeof CarouselTable>
