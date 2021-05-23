import { App } from 'vue'
import NumberTitleFlop from './src/index.vue'

NumberTitleFlop.install = (app: App): void => {
  app.component(NumberTitleFlop.name, NumberTitleFlop)
}

export default NumberTitleFlop
