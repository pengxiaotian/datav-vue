import { generateShortId } from '@/utils/util'
import { ComType } from '@/domains/enums/com-enums'
import { findComByName } from '@/data/system-components'

export interface ComponentAttr {
  x: number
  y: number
  w: number
  h: number
  deg: number
  opacity: number
}

export class BaseComponent {
  id: string
  name: string
  type: ComType

  alias: string
  icon: string
  img: string

  locked: boolean
  hided: boolean

  // 以下几个状态可以不进行持久化，为了操作方便在此声明
  selected: boolean
  hovered: boolean
  renameing: boolean

  attr: ComponentAttr

  projectId: number
  parentId?: string
  // children: BaseComponent[] | null

  config: Record<string, any>

  data: Record<string, any>
  source: Record<string, any>
  events: Record<string, any>

  constructor(name: string, width = 100, height = 100, type = ComType.com) {
    this.id = generateShortId(name)
    this.name = `V${name}`
    this.type = type

    const obj = findComByName(this.name)!
    this.alias = obj.com.alias
    this.icon = obj.category.icon
    this.img = obj.com.img
    this.locked = false
    this.hided = false

    this.selected = false
    this.hovered = false
    this.renameing = false

    this.attr = {
      x: 0,
      y: 0,
      w: width,
      h: height,
      deg: 0,
      opacity: 1,
    }

    this.projectId = 0
    // this.children = null

    this.config = {}
    this.data = {}
    this.source = {}
    this.events = []
  }

  /**
   * 初始化数据
   */
  initData() {
    return this
  }
}
