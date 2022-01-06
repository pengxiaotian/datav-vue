import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import { loadAsyncComponent } from '@/utils/async-component'
import Paragraph from './src/index.vue'

Paragraph.install = (app: App): void => {
  app.component('VParagraph', Paragraph)
  app.component('VParagraphProp', loadAsyncComponent(() => import('./src/config.vue')))
}

export default Paragraph as SFCWithInstall<typeof Paragraph>
