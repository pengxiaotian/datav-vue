import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/data-source'
import { createField } from '@/components/data-field'
import { DataEventConfig } from '@/components/data-event'

/**
 * NumberTitleFlop
 */
export class NumberTitleFlop extends DatavComponent {
  config = {
    global: {
      fontFamily: 'Microsoft Yahei',
      arrangement: 'top',
      distance: 0,
    },
    title: {
      content: 'Typesomething',
      textStyle: {
        fontSize: 18,
        color: '#79daff',
        fontWeight: 'normal',
        textAlign: 'flex-start',
      },
    },
    counter: {
      fontFamily: 'Microsoft Yahei',
      justifyContent: 'flex-start',
      margin: {
        preNum: 0,
        numSuff: 0,
      },
      prefix: {
        content: '￥',
        textStyle: {
          fontSize: 36,
          color: '#0a73ff',
          fontWeight: 'bolder',
        },
      },
      suffix: {
        content: '',
        textStyle: {
          fontSize: 30,
          color: '#fff',
          fontWeight: 'bolder',
        },
      },
    },
    numbers: {
      textStyle: {
        fontSize: 36,
        color: '#0a73ff',
        fontWeight: 'bolder',
      },
      marginRight: 0,
      bgColor: 'rgba(51,51,51,0)',
      bgRadius: 6,
      bgSeparating: false,
      digit: 0,
      decimal: 0,
      divisor: 0,
      separatingChart: true,
      separatingSymbol: ',',
      decimalSymbol: '.',
      fixedWidth: 0,
      increment: true,
      animation: true,
      sameDataFlip: false,
      duration: 1000,
    },
  }

  apis: ApiConfigMap
  apiData: ApiDataConfigMap

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('NumberTitleFlop', { w: 350, h: 64 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('title', {
        description: '标题',
        optional: true,
      }),
      createField('value', {
        description: '翻牌器数值',
      }),
      createField('prefix', {
        description: '翻牌器前缀',
        optional: true,
      }),
      createField('suffix', {
        description: '翻牌器后缀',
        optional: true,
      }),
    ]

    this.apis = setApiConfig({}, 'source', {
      fields: Object.assign({}, ...fields),
    })

    this.apiData = setApiData(this.id, {}, 'source', {
      title: '',
      value: '123456.7',
    })

    this.events = {}

    this.actions = {}

    return this
  }
}

export default NumberTitleFlop
