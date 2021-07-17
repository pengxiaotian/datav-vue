import { generateId } from '@/utils/util'
import { findComByName } from '@/data/system-components'
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
  selected = false
  hovered = false
  renameing = false

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
  parentId?: string
  // children: DatavComponent[] | null = null

  abstract config: Record<string, any>

  abstract apis: ApiConfigMap
  abstract apiData: ApiDataConfigMap

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

    const obj = findComByName(this.name)!
    this.alias = obj.com.alias
    this.icon = obj.category.icon
    this.img = obj.com.thum

    this.attr = { ...this.attr, ...attr }
  }

  /**
   * 初始化数据
   */
   abstract initData(): this
}
