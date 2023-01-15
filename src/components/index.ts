import type { App } from 'vue'
import DatavWrapper from './_internal/datav-wrapper.vue'

import VBasicBar from './bar/basic-bar'
import VBasicLine from './line/basic-line'
import VChina2d from './map/china2d'
import VWordCloud from './chart/word-cloud'
import VMainTitle from './text/main-title'
import VMarquee from './text/marquee'
import VNumberTitleFlop from './text/number-title-flop'
import VParagraph from './text/paragraph'
import VTimer from './text/timer'
import VCarouselTable from './table/carousel-table'
import VFullScreen from './button/full-screen'
import VBgBox from './media/bg-box'
import VBorderBox from './media/border-box'
import VDecoration from './media/decoration'
import VMainImg from './media/main-img'
import VDatePicker from './other/date-picker'
import VTableBar from './table/table-bar'
import VBasicPie from './pie/basic-pie'
// -- prepend placeholder 1 --

const components = [
  VBasicBar,
  VBasicLine,
  VChina2d,
  VWordCloud,
  VMainTitle,
  VMarquee,
  VNumberTitleFlop,
  VParagraph,
  VTimer,
  VCarouselTable,
  VFullScreen,
  VBgBox,
  VBorderBox,
  VDecoration,
  VMainImg,
  VDatePicker,
  VTableBar,
  VBasicPie,
// -- prepend placeholder 2 --
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
