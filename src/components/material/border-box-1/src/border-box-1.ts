import { DatavComponent } from '@/components/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
  createField, setApiConfig, setApiData,
} from '@/components/data-source'

import { merge, cloneDeep } from 'lodash'

/**
 * BorderBox_1
 */
export class BorderBox_1 extends DatavComponent {
  config = {
    title: '边框1',
    color: [],
    border: [],
    backgroundStyle: {
      bgColor: 'transparent',
    },
  }

  apis: ApiConfigMap
  apiData: ApiDataConfigMap

  events: Record<string, any> = {}

  constructor() {
    super('BorderBox_1', { w: 400, h: 250 })

    this.initData()
  }

  initData() {
    const defaultColor = ['#4fd2dd', '#235fa7']
    this.config.color = merge(cloneDeep(defaultColor), this.config.color || [])

    const defaultBorder = ['left-top', 'right-top', 'left-bottom', 'right-bottom']
    this.config.border = merge(cloneDeep(defaultBorder), this.config.border || [])

    const fields = [
      createField('value', { description: '', optional: true }),
    ]

    this.apis = setApiConfig({} as any, 'source', {
      fields: Object.assign({}, ...fields),
    })

    this.apiData = setApiData(this.id, {} as any, 'source', {
      value: 'api data',
    })

    return this
  }
}

export default BorderBox_1
