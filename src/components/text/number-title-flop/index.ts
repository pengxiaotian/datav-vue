import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import NumberTitleFlop from './src/index.vue'

NumberTitleFlop.install = (app: App): void => {
  app.component(NumberTitleFlop.name, NumberTitleFlop)
}

export default NumberTitleFlop as SFCWithInstall<typeof NumberTitleFlop>
