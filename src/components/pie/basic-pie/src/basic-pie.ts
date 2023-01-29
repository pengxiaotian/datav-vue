import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * BasicPie
 */
export class BasicPie extends DatavComponent {
  config = {
    margin: {
      show: false,
      top: 40,
      bottom: 30,
      left: 30,
      right: 20,
    },
    radius: {
      inner: 75,
      outer: 80,
    },
    fill: {
      mapping: true,
      fixed: {
        type: 'flat',
        value: '#1c81ff',
      },
      scale: {
        type: 'ordinal',
        scheme: 'cat-7',
        range: [
          '#32FFA1',
          '#50BA58',
          '#00CEFF',
          '#E7E342',
          '#FF6A00',
          '#8C57E4',
          '#1C81FF',
        ],
        pin: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
        custom: false,
        domain: [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        abnormal: 'transparent',
      },
    },
    line: {
      lineStyle: 'solid',
      lineWidth: 1,
      lineColor: 'rgba(255, 255, 255, 0.25)',
      dashedLength: 3,
      dashedSpace: 8,
      dottedLength: 2,
      dottedSpace: 4,
    },
    isCombine: {
      show: true,
      piecesCount: 20,
      defineType: '其他',
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('BasicPie', { w: 400, h: 240 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('value', { description: '', optional: true }),
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
      const path = 'pie/basic-pie'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default BasicPie
