import type { App } from 'vue'
import VMainTitle from './text/main-title'
import VNumberTitleFlop from './text/number-title-flop'
import VBorderBox1 from './material/border-box-1'

const textComponents = [
  VMainTitle,
  VNumberTitleFlop,
]

const materialComponents = [
  VBorderBox1,
]
const components = [
  ...textComponents,
  ...materialComponents,
]

const install = (app: App): void => {
  components.forEach(component => {
    app.use(component)
  })
}

export default {
  install,
}
