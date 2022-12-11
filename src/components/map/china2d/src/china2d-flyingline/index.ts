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
      k: 1,
      trailLength: 0.2,
      trailSize: 2,
      curveness: -0.3,
      constantSpeed: 50,
      period: 4,
      lineWidth: 1,
      opacity: 0,
    },
    flareStyle: {
      show: true,
      type: 'circle',
      color: '#0eff90',
      size: 1,
      lineWidth: 1, // 用来修复 echarts 中修改图标不立刻生效bug
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

export const flareTypes = [
  { id: 'circle', value: '圆形', icon: 'shape-circle' },
  { id: 'rect', value: '矩形', icon: 'shape-rect' },
  { id: 'triangle', value: '三矩形', icon: 'shape-triangle' },
  { id: 'diamond', value: '菱形', icon: 'shape-diamond' },
  { id: 'arrow', value: '箭头', icon: 'shape-arrow' },
  { id: 'airplane', value: '飞机',  icon: 'shape-airplane' },
]

export const flareIcons = {
  airplane: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
}

export default China2dFlyingline
