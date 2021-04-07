import { BaseComponent } from './base-component'
// text
import MainTitle from './text/main-title'

/**
 * The factory of control
 */
class FactoryComponent {
  static create(name: string) {
    switch (name.substr(1)) {
      // text
      case 'MainTitle':
        return new MainTitle()
      default:
        return new BaseComponent(name)
    }
  }
}

export default FactoryComponent
