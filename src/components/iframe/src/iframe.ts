import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * Iframe
 */
export class Iframe extends DatavComponent {
  config = {
    url: 'https://www.baidu.com',
    closeButton: true,
    alwaysShowCloseButton: false,
    noScrolling: false,
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor() {
    super('Iframe', { w: 300, h: 180 })

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

  /** 加载静态数据 */
  async loadStaticData() {
    try {
      // 组件静态数据来源，当前项目统一管理目录：public/elementStaticData/*
      // 如：public/elementStaticData/demo/data.json 简写为 => demo/data
      const path = 'iframe'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default Iframe

export type Data = {
  url: string
}[]
