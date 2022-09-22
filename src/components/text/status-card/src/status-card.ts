import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * StatusCard
 */
export class StatusCard extends DatavComponent {
  config: Config = {
    global: {
      manualArrangement: true,
      layout: 'row',
      rowNum: 4,
      colNum: 1,
    },
    /** 间距 */
    spacing: {
      vertical: 20,
      horizontal: 10,
    },
    /** 文本样式 */
    textStyle: {
      fontFamily: 'Microsoft Yahei',
      fontSize: 12,
      color: '#fff',
      fontWeight: 'normal',
    },
    statusArray: [
      {
        value: '1',
        color: 'rgb(10, 115, 255)',
      },
      {
        value: '2',
        color: 'rgb(61, 171, 255)',
      },
      {
        value: '3',
        color: '#79daff',
      },
      {
        value: '4',
        color: '#a3f6ff',
      },
    ],
    /** 圆点样式 */
    pointStyle: {
      position: 'left',
      width: 10,
      height: 10,
      borderRadius: 50,
      spacing: 4,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('StatusCard', { w: 210, h: 18 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('value', { description: '', optional: true }),
    ]

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
    })

    this.apiData = initApiData(this.id)

    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      // 组件静态数据来源，当前项目统一管理目录：public/data/*
      // 如：public/data/demo/data.json 简写为 => demo/data
      const path = 'text/status-card'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

type Config = {
  /** 全局 */
  global: {
    /** 是否手动控制布局 */
    manualArrangement: boolean
    layout: 'row' | 'column'
    rowNum: number
    colNum: number
  }
  /** 间距 */
  spacing: {
    vertical: number
    horizontal: number
  }
  /** 文本样式 */
  textStyle: {
    fontFamily: string
    fontSize: number
    color: string
    fontWeight: 'normal'
  }
  /** 状态类型 */
  statusArray: {
    value: string
    color: string
  }[]
  /** 圆点样式 */
  pointStyle: {
    position: 'left' | 'right'
    width: number
    height: number
    borderRadius: number
    spacing: number
  }
}

export type Data = |
{
  value: string
  name: string
}[]
| [string, string][]

export default StatusCard
