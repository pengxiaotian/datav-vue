// text
import { MainTitle } from './text/main-title/src/main-title'
import { NumberTitleFlop } from './text/number-title-flop/src/number-title-flop'

export function createComponent(name: string) {
  switch (name.substr(1)) {
    // text
    case 'MainTitle':
      return new MainTitle()
    case 'NumberTitleFlop':
      return new NumberTitleFlop()
    default:
      throw Error(`Unknown component type: ${name}.`)
  }
}
