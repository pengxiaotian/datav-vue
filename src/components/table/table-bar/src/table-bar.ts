import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * TableBar
 */
export class TableBar extends DatavComponent {
  config = {
    global: {
      fontFamily: 'Microsoft Yahei',
      duration: 500,
      padding: 10,
      quantity: 5,
      loop: true,
      looptime: 5000,
    },
    index: {
      show: true,
      textarea: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'normal',
      },
      padding: 10,
      prefix: 'NO.',
      suffix: '',
    },
    content: {
      marquee: {
        show: true,
        duration: 8000,
      },
      textarea: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'normal',
      },
      padding: 5,
    },
    number: {
      show: false,
      color: '#fff',
      fontSize: 16,
      fontWeight: 'normal',
      padding: 10,
      decimal: 0,
      divisor: 0,
      prefix: '',
      suffix: '',
      separatingChart: true,
      real: true,
    },
    bar: {
      show: true,
      fillColorType: 'linear',
      color: '#00baff',
      fromColor: '#2d99f7',
      toColor: '#01f0ff',
      height: 10,
      radius: 10,
      threshold: {
        value: 90,
        fillColorType: 'linear',
        color: '#ffc925',
        fromColor: '#f87c0b',
        toColor: '#fad422',
      },
    },
    light: {
      show: true,
      color: '#fff',
      duration: 3000,
      height: 5,
      width: 70,
    },
    segment: {
      show: true,
      color: 'rgba(0,186,255,0.1)',
      height: 10,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('TableBar', { w: 300, h: 200 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('value', { description: '值说明' }),
      createField('content', { description: '内容说明' }),
    ]

    setApiConfig(this, {
      fields: Object.assign({}, ...fields),
    })

    setApiData(this)

    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      const path = 'table/table-bar'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default TableBar
