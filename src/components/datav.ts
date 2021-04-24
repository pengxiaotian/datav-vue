// text
import { MainTitle } from './text/main-title/src/main-title'

export function createComponent(name: string) {
  switch (name.substr(1)) {
    // text
    case 'MainTitle':
      return new MainTitle()
    default:
      throw Error(`Unknown component type: ${name}.`)
  }
}
