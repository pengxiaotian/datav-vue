import type { App } from 'vue'
import type { SFCWithInstall } from '@/utils/types'
import NumberTitleFlop from './src/index.vue'
import NumberTitleFlopProp from './src/config.vue'

NumberTitleFlop.install = (app: App): void => {
  app.component(NumberTitleFlop.name, NumberTitleFlop)
  app.component(NumberTitleFlopProp.name, NumberTitleFlopProp)
}

export default NumberTitleFlop as SFCWithInstall<typeof NumberTitleFlop>
