import { ComType, DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * China2dBubbles
 */
export class China2dBubbles extends DatavComponent {
  config = {
    defaultStyle: {
      effectType: 'ripple',
      sizeRange: [5, 20],
      offset: 5,
      opacity: 0.85,
      speed: 0.2,
    },
    typeSeries: [
      {
        bubbleType: '1',
        bubbleKey: 'circle',
        fillColor: 'rgba(191, 191, 191, 0.96)',
      },
      {
        bubbleType: '2',
        bubbleKey: 'circle',
        fillColor: 'rgba(26, 255, 140, 0.81)',
      },
    ],
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('China2dBubbles', {}, ComType.subCom)

    this.initData()
  }

  initData() {
    const fields = [
      createField('lng', { type: 'number',  description: '经度' }),
      createField('lat', { type: 'number', description: '纬度' }),
      createField('value', { type: 'number', description: '值' }),
      createField('type', { type: 'number',  description: '气泡类型' }),
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
      const path = 'map/china2d-bubbles'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default China2dBubbles
