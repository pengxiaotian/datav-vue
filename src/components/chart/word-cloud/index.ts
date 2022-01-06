import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import WordCloud from './src/index.vue'

WordCloud.install = (app: App): void => {
  app.component('VWordCloud', WordCloud)
  app.component('VWordCloudProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default WordCloud as SFCWithInstall<typeof WordCloud>
