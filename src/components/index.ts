import type { App } from 'vue'
import VMainTitle from './text/main-title'
import VNumberTitleFlop from './text/number-title-flop'
import VDatePicker from './other/date-picker'

const components = [
  VMainTitle,
  VNumberTitleFlop,
  VDatePicker,
]

const install = (app: App): void => {
  components.forEach(component => {
    app.use(component)
  })
}

export default {
  install,
}
