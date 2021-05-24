import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import MainTitle from './src/index.vue'
import MainTitleProp from './src/config.vue'

MainTitle.install = (app: App) => {
  app.component(MainTitle.name, MainTitle)
  app.component(MainTitleProp.name, MainTitleProp)
}

export default MainTitle as SFCWithInstall<typeof MainTitle>
