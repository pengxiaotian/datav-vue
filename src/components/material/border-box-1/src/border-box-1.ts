import { DatavComponent } from '@/components/datav-component'
import { setApiConfig, ApiConfigMap, ApiDataConfigMap } from '@/components/data-source'

import { merge, cloneDeep } from 'lodash'

/**
 * BorderBox1
 */
export class BorderBox1 extends DatavComponent {
  config = {
    title: '边框1',
    color: [],
    border: [],
    background: 'rgba(255, 255, 255, 0)',
  }

  apis: ApiConfigMap
  apiData: ApiDataConfigMap

  events: Record<string, any> = {}

  constructor() {
    super('BorderBox1', { w: 400, h: 250 })

    this.initData()
  }

  initData() {
    const defaultColor = ['#4fd2dd', '#235fa7']
    this.config.color = merge(cloneDeep(defaultColor), this.config.color || [])

    const defaultBorder = ['left-top', 'right-top', 'left-bottom', 'right-bottom']
    this.config.border = merge(cloneDeep(defaultBorder), this.config.border || [])

    this.apis = setApiConfig({} as any, null, {})

    return this
  }
}

export default BorderBox1
