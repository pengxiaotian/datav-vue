import type { App } from 'vue'
import VMainTitle from './text/main-title'
import VNumberTitleFlop from './text/number-title-flop'
import VMarquee from './text/marquee'
import VParagraph from './text/paragraph'
import VTimer from './text/timer'

import VDatePicker from './other/date-picker'

import VBgBox from './media/bg-box'
import VBorderBox from './media/border-box'
import VDecoration from './media/decoration'

import VBasicBar from './bar/basic-bar'

import VFullScreen from './button/full-screen'

const components = [
  VMainTitle,
  VNumberTitleFlop,
  VDatePicker,
  VBgBox,
  VBorderBox,
  VDecoration,
  VBasicBar,
  VMarquee,
  VParagraph,
  VTimer,
  VFullScreen,
]

const install = (app: App): void => {
  components.forEach(component => {
    app.use(component)
  })
}

export default {
  install,
}
