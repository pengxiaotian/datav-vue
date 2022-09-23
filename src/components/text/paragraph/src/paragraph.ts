import { DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  initApiConfig, initApiData,
} from '@/components/_models/data-source'
import { createField } from '@/components/_models/data-field'
import { DataEventConfig } from '@/components/_models/data-event'
import { getStaticData } from '@/api/data'

/**
 * Paragraph
 */
export class Paragraph extends DatavComponent {
  config = {
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eius fuga soluta at recusandae voluptas nulla natus officia perferendis enim dolorem nemo distinctio totam voluptate, et nobis ratione impedit fugiat!',
    textStyle: {
      fontFamily: 'Microsoft Yahei',
      fontSize: 16,
      color: '#fff',
      fontWeight: 'normal',
    },
    scroll: {
      duration: 5000,
      overScroll: false,
    },
    lineHeight: 36,
    textAlign: 'left',
    textIndent: 32,
  }

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>

  events: Record<string, DataEventConfig>

  actions: Record<string, DataEventConfig>

  constructor() {
    super('Paragraph', { w: 300, h: 180 })

    this.initData()
  }

  initData() {
    const fields = [
      createField('value', { description: '值' }),
    ]

    this.apis = initApiConfig({
      fields: Object.assign({}, ...fields),
      description: '多行文本接口',
    })

    this.apiData = initApiData(this.id)

    this.events = {}
    this.actions = {}

    return this
  }

  async loadData() {
    try {
      const path = 'text/paragraph'
      const res = await getStaticData(this.id, path)
      this.apiData.source.config.data = JSON.stringify(res.data)
    } catch (error) {
      throw error
    }
  }
}

export default Paragraph
