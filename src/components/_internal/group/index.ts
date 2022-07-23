import { ComponentGroupAttr, ComType, DatavComponent } from '@/components/_models/datav-component'
import {
  ApiConfigMap, ApiDataConfigMap,
} from '@/components/_models/data-source'
import { DataEventConfig } from '@/components/_models/data-event'


export interface GroupTransform3d {
  _id: string
  _label: string
  _icon: string
  rotate3d: {
    deg: number
    x: number
    y: number
    z: number
  }
  scale3d: {
    x: number
    y: number
    lock: boolean
  }
  translate3d: {
    x: number
    y: number
    z: number
  }
}

/**
 * Group
 */
export class Group extends DatavComponent {
  attr: ComponentGroupAttr = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    deg: 0,
    opacity: 1,
    filpV: false,
    filpH: false,
    apply3d: false,
    perspective: 500,
    perspectiveOrigin: {
      x: 50,
      y: 50,
    },
  }

  fold = true

  config: {
    transform3d: GroupTransform3d
  }[] = []

  apis: Partial<ApiConfigMap>
  apiData: Partial<ApiDataConfigMap>
  events: Record<string, DataEventConfig>
  actions: Record<string, DataEventConfig>

  constructor(attr: Partial<ComponentGroupAttr>) {
    super('Group', attr, ComType.layer)

    this.alias = '组'
    this.icon = 'group'
    this.img = `${import.meta.env.VITE_APP_CDN}/com-thum/group-200-200.png`,
    this.attr = { ...this.attr, ...attr }

    this.initData()
  }

  initData() {
    this.children = []
    return this
  }

  async loadData() {}
}

export default Group
