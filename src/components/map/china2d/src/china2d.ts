import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'

/**
 * China2d
 */
export class China2d extends DatavComponent {
  config = {
    global: {
      bgColor: 'rgba(0,0,0,0)',
      scaleLimit: {
        min: 0,
        max: 18,
      },
      zoom: 1,
      center: {
        lng: 108,
        lat: 38,
      },
    },
    tooltip: {
      textStyle: {
        fontFamily: 'Microsoft Yahei',
        fontWeight: 'normal',
        fontSize: 14,
        color: '#fff',
      },
      lineHeight: 1.4,
      borderRadius: 5,
      padding: {
        bottom: 10,
        left: 20,
        right: 20,
        top: 10,
      },
      bgColor: 'rgba(6, 75, 199, 0.8)',
    },
    interactive: {
      dragging: true,
      scrollWheelZoom: true,
      isInteractive: true,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('China2d', { w: 800, h: 600 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('zoom', {
        type: 'number',
        description: '缩放级别',
        optional: true,
      }),
      createField('lng', {
        type: 'number',
        description: '经度',
        optional: true,
      }),
      createField('lat', {
        type: 'number',
        description: '纬度',
        optional: true,
      }),
    ]

    setApiConfig(this, {
      fields: Object.assign({}, ...fields),
    })

    setApiData(this)

    this.events = {
      'map-move': {
        description: '地图移动时',
        fields: Object.assign({}, ...fields),
      },
      'map-moveend': {
        description: '地图移动结束时',
        fields: Object.assign({}, ...fields),
      },
    }
    this.actions = {}

    this.children = []

    return this
  }

  async loadData() {
    try {
      this.apiData.source.config.data = '[]'
    } catch (error) {
      throw error
    }
  }
}

export default China2d
