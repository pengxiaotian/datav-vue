import { generateId } from '@/utils/util'
import { findComByName } from '@/data/system-components'
import { ComType } from '@/utils/enums/com-enums'
import { DataConfigMap, SourceConfigMap } from './data-source'

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

  abstract data: DataConfigMap
  abstract source: SourceConfigMap

  abstract events: Record<string, any>

  constructor(name: string, attr: Partial<ComponentAttr>, type = ComType.com) {
    this.id = generateId(name)
    this.name = `V${name}`
    this.type = type

    const obj = findComByName(this.name)!
    this.alias = obj.com.alias
    this.icon = obj.category.icon
    this.img = obj.com.img

    this.attr = { ...this.attr, ...attr }
  }

  /**
   * 初始化数据
   */
   abstract initData(): this
}
