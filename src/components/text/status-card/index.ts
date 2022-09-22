import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import StatusCard from './src/index.vue'

StatusCard.install = (app: App): void => {
  app.component('VStatusCard', StatusCard)
  app.component('VStatusCardProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default StatusCard as SFCWithInstall<typeof StatusCard>
