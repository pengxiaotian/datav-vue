import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  setApiConfig, setApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * MainTitle
 */
export class MainTitle extends DatavComponent {
  config = {
    title: '我是标题数据',
    textStyle: {
      fontFamily: 'Microsoft Yahei',
      fontSize: 24,
      color: '#fff',
      fontWeight: 'normal',
    },
    textAlign: 'center',
    writingMode: 'horizontal-tb',
    letterSpacing: 0,
    backgroundStyle: {
      show: false,
      bgColor: '#008bff',
      borderRadius: 15,
      borderColor: '#fff',
      borderStyle: 'solid',
      borderWidth: 1,
    },
    ellipsis: false,
    urlConfig: {
      url: '',
      isBlank: false,
    },
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('MainTitle', { w: 300, h: 56 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('title', { description: '标题值', optional: true }),
      createField('url', { description: '超链接', optional: true }),
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
      const path = 'text/main-title'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default MainTitle
