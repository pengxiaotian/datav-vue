import { generateId } from '@/utils/util'
import { findComByName } from '@/data/system-components'
import { AnimationEasing } from '@/utils/types'
import { ApiConfigMap, ApiDataConfigMap } from './data-source'
import { DataEventConfig } from './data-event'

export enum ComType {
  com = 'com',
  subCom = 'subCom',
  layer = 'layer',
}

export interface ComponentAttr {
  x: number
  y: number
  w: number
  h: number
  deg: number
  opacity: number
  filpV: boolean
  filpH: boolean
}

export interface ComponentGroupAttr extends ComponentAttr {
  apply3d: boolean
  perspective: number
  perspectiveOrigin: {
    x: number
    y: number
  }
}

export abstract class DatavComponent {
  id: string
  readonly name: string
  readonly type: ComType

  alias: string
  icon: string
  img: string

  locked = false
  hided = false

  // 以下几个状态可以不进行持久化，为了操作方便在此声明
  selected? = false
  hovered? = false
  renameing? = false
  tag? = 0
  fold?: boolean
  scaling? = {
    zoom: false,
    w: 0,
    h: 0,
    sx: 1,
    sy: 1,
  }

  attr: ComponentAttr = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    deg: 0,
    opacity: 1,
    filpV: false,
    filpH: false,
  }

  projectId = 0
  // 用于组合组件，如：底图和图层关系
  parentId?: string
  // group 的子组件
  children?: DatavComponent[]

  abstract config: Record<string, any>

  abstract apis: Partial<ApiConfigMap>
  abstract apiData: Partial<ApiDataConfigMap>

  /**
   * 事件
   */
  abstract events: Record<string, DataEventConfig>

  /**
   * 动作
   */
  abstract actions: Record<string, DataEventConfig>

  constructor(name: string, attr: Partial<ComponentAttr>, type = ComType.com) {
    this.id = generateId(name)
    this.name = `V${name}`
    this.type = type

    if (type !== ComType.layer) {
      const obj = findComByName(this.name)
      this.alias = obj.com.alias
      this.icon = obj.category.icon
      this.img = obj.com.thum
    }

    this.attr = { ...this.attr, ...attr }
    this.scaling.w = attr.w
    this.scaling.h = attr.h
  }

  /**
   * 初始化数据
   */
  abstract initData(): this

  /**
   * 将静态数据和配置分离 减少 bundle size
   */
  abstract loadData(): Promise<void>
}

export abstract class DatavChartSeries {
  readonly type: string
  id: string
  name: string

  constructor (type: string, name: string) {
    this.type = type
    this.id = generateId(name)
    this.name = name
  }
}

export abstract class DatavEChartsComponent extends DatavComponent {
  abstract config: Record<string, any> & {
    legend?: Record<string, any>
    tooltip?: Record<string, any>
    series?: DatavChartSeries | DatavChartSeries[]
    animation?: {
      enabled: boolean
      duration?: number
      easing?: AnimationEasing
      delay?: number
      threshold?: number
      durationUpdate?: number
      easingUpdate?: string
      delayUpdate?: number
    }
  }
}

export const checkComponentAttr = (com: DatavComponent) => {
  if (!com.scaling) {
    com.scaling = {
      zoom: false,
      w: com.attr.w,
      h: com.attr.h,
      sx: 1,
      sy: 1,
    }
  }
}
