import type { App } from 'vue'
import DatavWrapper from './_internal/datav-wrapper.vue'

import VMainTitle from './text/main-title'
import VNumberTitleFlop from './text/number-title-flop'
import VMarquee from './text/marquee'
import VParagraph from './text/paragraph'
import VTimer from './text/timer'

import VBgBox from './media/bg-box'
import VBorderBox from './media/border-box'
import VDecoration from './media/decoration'
import VMainImg from './media/main-img'

import VBasicBar from './bar/basic-bar'

import VBasicLine from './line/basic-line'

import VChina2d from './map/china2d'

import VWordCloud from './chart/word-cloud'

import VFullScreen from './button/full-screen'

import VDatePicker from './other/date-picker'

const components = [
  VMainTitle,
  VNumberTitleFlop,
  VMarquee,
  VParagraph,
  VTimer,
  VBgBox,
  VBorderBox,
  VDecoration,
  VMainImg,
  VBasicBar,
  VBasicLine,
  VChina2d,
  VWordCloud,
  VFullScreen,
  VDatePicker,
]

const install = (app: App): void => {
  app.component('DatavWrapper', DatavWrapper)

  components.forEach(component => {
    app.use(component)
  })
}

export default {
  install,
}
