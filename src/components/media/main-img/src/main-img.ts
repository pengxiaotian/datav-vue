import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/_models/data-source'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * MainImg
 */
export class MainImg extends DatavComponent {
  config = {
    imageType: 'bitmap',
    backgroundImage: 'https://files.pengxiaotian.com/datav/main-img.png',
    vectorImage: 'https://files.pengxiaotian.com/datav/datav-vue-logo.svg',
    vectorFill: '#38ae70',
    repeat: 'no-repeat',
    radius: 1,
    urlConfig: {
      url: '',
      ifBlank: false,
    },
    cursor: true,
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('MainImg', { w: 300, h: 180 })

    this.initData()
  }

  initData() {
    this.apis = {}
    this.apiData = {}
    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      // 组件静态数据来源，当前项目统一管理目录：public/data/*
      // 如：public/data/demo/data.json 简写为 => demo/data
      const path = ''
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default MainImg
