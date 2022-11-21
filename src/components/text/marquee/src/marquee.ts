import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * Marquee
 */
export class Marquee extends DatavComponent {
  config = {
    textStyle: {
      fontFamily: 'Microsoft Yahei',
      fontSize: 18,
      color: '#fff',
      fontWeight: 'normal',
    },
    loop: true,
    ifSpeed: false,
    duration: 8000,
    speed: 1000,
    timeout: 1000,
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('Marquee', { w: 300, h: 56 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('value', { description: '值' }),
    ]

    setApiConfig(this, {
      fields: Object.assign({}, ...fields),
      description: '跑马灯接口',
    })

    setApiData(this)

    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      const path = 'text/marquee'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default Marquee
