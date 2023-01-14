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
      animation: true,
      duration: 1000,
      padding: 8,
      quantity: 5,
      loop: true,
      looptime: 5000,
      sort: {
        show: true,
        sort: 'desc',
      },
    },
    index: {
      show: true,
      textarea: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'normal',
      },
      width: 'auto',
      padding: 10,
      format: '1',
    },
    content: {
      textarea: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'normal',
      },
      marquee: {
        show: true,
        duration: 8000,
      },
    },
    number: {
      show: false,
      fontSize: 16,
      color: '#fff',
      fontWeight: 'normal',
      padding: 10,
      percentage: false,
      separatingChart: true,
      decimal: 2,
      symbol: {
        prefix: '',
        suffix: '',
        marginLeft: 0,
        marginRight: 0,
      },
    },
    bar: {
      show: true,
      fillColorType: 'solid',
      color: 'rgb(10, 115, 255)',
      fromColor: '#2d99f7',
      toColor: '#01f0ff',
      height: 8,
      radius: 8,
      threshold: {
        show: true,
        value: 80,
        fillColorType: 'gradient',
        color: '#ffc925',
        fromColor: '#f87c0b',
        toColor: '#fad422',
      },
    },
    light: {
      show: true,
      color: 'rgb(121, 218, 255)',
      width: 70,
      height: 2,
      duration: 3000,
    },
    segment: {
      show: true,
      color: 'rgba(255, 255, 255, 0.1)',
      height: 8,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('TableBar', { w: 300, h: 230 })

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
