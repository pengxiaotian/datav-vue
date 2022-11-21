import { ComType, DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * China2dFlyingline
 */
export class China2dFlyingline extends DatavComponent {
  config = {
    flyinglineStyle: {
      fromColor: '#0ea7ff',
      toColor: '#4affac',
      k: 2,
      step: 120,
      lineWidth: 4,
      ptsN: 100,
      height: 3,
      outSpeed: 1,
      speed: 2.5,
    },
    flareStyle: {
      show: true,
      color: '#0eff90',
      size: 1,
    },
    circleStyle: {
      show: false,
      color: '#a8ebf7',
      radius: 20,
      speed: 0.3,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('China2dFlyingline', {}, ComType.subCom)

    this.initData()
  }

  initData() {
    const fields = [
      createField('from', { description: '飞线出发位置' }),
      createField('to', { description: '飞线结束位置' }),
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
      const path = 'map/china2d-flyingline'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default China2dFlyingline
