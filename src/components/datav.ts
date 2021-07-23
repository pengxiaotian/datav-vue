import { MainTitle } from './text/main-title/src/main-title'

import { NumberTitleFlop } from './text/number-title-flop/src/number-title-flop'
import { DatePicker } from './other/date-picker/src/date-picker'

import { BgBox } from './media/bg-box/src/bg-box'
import { BorderBox } from './media/border-box/src/border-box'
import { Decoration } from './media/decoration/src/decoration'

export function createComponent(name: string) {
  switch (name.substr(1)) {
    case 'MainTitle':
      return new MainTitle()
    case 'NumberTitleFlop':
      return new NumberTitleFlop()
    case 'DatePicker':
      return new DatePicker()
    case 'BgBox':
      return new BgBox()
    case 'BorderBox':
      return new BorderBox()
    case 'Decoration':
      return new Decoration()
    default:
      throw Error(`Unknown component type: ${name}.`)
  }
}
