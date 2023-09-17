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
          '{"stops":[{"offset":1,"color":"rgba(36, 131, 255, 0.97)"},{"offset":100,"color":"#88bafe"}],"angle":90}',
          '{"stops":[{"offset":0,"color":"rgb(77, 177, 86)"},{"offset":100,"color":"rgb(128, 252, 139)"}],"angle":90}',
          '{"stops":[{"offset":0,"color":"rgb(5, 186, 242)"},{"offset":99,"color":"rgb(68, 239, 242)"}],"angle":90}',
          '{"stops":[{"offset":0,"color":"#f2ed29"},{"offset":99,"color":"#f9f68a"}],"angle":90}',
          '{"stops":[{"offset":0,"color":"rgb(239, 81, 9)"},{"offset":98,"color":"rgb(249, 135, 1)"}],"angle":90}',
          '{"stops":[{"offset":2,"color":"#8c57e4"},{"offset":100,"color":"rgba(224, 131, 255, 0.97)"}],"angle":90}',
          '{"stops":[{"offset":0,"color":"rgba(36, 131, 255, 0.97)"},{"offset":99,"color":"rgb(131, 183, 252)"}],"angle":90}',
        ],
        domain: ['', '', '', '', '', '', ''],
        pin: [false, false, false, false, false, false, false],
        custom: false,
        excepted: 'yellow',
        abnormal: '#808080',
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
