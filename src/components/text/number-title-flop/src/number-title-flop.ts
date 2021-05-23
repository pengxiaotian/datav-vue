import { DatavComponent } from '@/components/datav-component'
import {
  DataConfigMap, createField, setDataConfig,
  SourceConfigMap, setSourceData,
} from '@/components/data-source'


/**
 * 数字翻牌器
 */
export class NumberTitleFlop extends DatavComponent {
  config = {
    arrangement: 'top',
    distance: 0,
    title: '我是标题',
    textStyle: {
      fontFamily: 'Microsoft Yahei',
      fontSize: 15,
      color: '#fff',
      fontWeight: 'lighter',
    },
    counter: {
      fontFamily: 'Microsoft Yahei',
      textAlign: 'left',
    },
    prefix: {
      content: '￥',
      textStyle: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'normal',
      },
    },
    suffix: {
      content: '元',
      textStyle: {
        fontSize: 30,
        color: '#fff',
        fontWeight: 'normal',
      },
    },
    numbers: {
      value: 1000,
      textStyle: {
        fontSize: 50,
        color: '#fff600',
        fontWeight: 'normal',
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
      sameDataFlip: false,
      duration: 1000,
    },
  }

  data: DataConfigMap
  source: SourceConfigMap

  events: Record<string, any> = {}

  constructor() {
    super('NumberTitleFlop', { w: 350, h: 100 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('title', {
        description: '标题',
        optional: true,
      }),
      createField('value', {
        map: 'numbers.value',
        description: '翻牌器数值',
      }),
      createField('prefix', {
        map: 'prefix.content',
        description: '翻牌器前缀',
        optional: true,
      }),
      createField('suffix', {
        map: 'suffix.content',
        description: '翻牌器后缀',
        optional: true,
      }),
    ]

    this.data = setDataConfig({} as any, 'source', {
      fields: Object.assign({}, ...fields),
    })

    this.source = setSourceData(this.id, {} as any, 'source', {
      title: '',
      value: '12345.67',
    })

    return this
  }
}

export default NumberTitleFlop
