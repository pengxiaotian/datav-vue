import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import BorderBox1 from './src/index.vue'
import BorderBox1Prop from './src/config.vue'

BorderBox1.install = (app: App): void => {
  app.component(BorderBox1.name, BorderBox1)
  app.component(BorderBox1Prop.name, BorderBox1Prop)
}

export default BorderBox1 as SFCWithInstall<typeof BorderBox1>
