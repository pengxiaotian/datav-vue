import { BaseComponent } from '../base-component'

/**
 * 通用标题
 */
export default class MainTitle extends BaseComponent {
  constructor() {
    super('MainTitle', 300, 56)

    this.config = {
      title: '',
      textStyle: {
        fontFamily: 'Microsoft Yahei',
        fontSize: 32,
        color: '#fff',
        fontWeight: 'normal',
      },
      textAlign: 'center',
      urlConfig: {
        url: '',
        isBlank: false,
      },
      writingMode: 'horizontal-tb',
    }
  }
}
