import { generateShortId } from '@/utils/util'
import { ComType } from '@/domains/enums/com-enums'
import { findByComName } from '@/data/system-components'

export class BaseComponent {
  id: string
  name: string
  type: ComType

  alias: string
  icon: string
  img: string

  locked: boolean
  hided: boolean
  selected: boolean
  hovered: boolean

  attr: {
    x: number
    y: number
    w: number
    h: number
    deg: number
    opacity: number
  }

  projectId: number
  parentId: string | null
  children: BaseComponent[] | null

  config: Record<string, any>

  data: Record<string, any>
  source: Record<string, any>
  events: Record<string, any>

  constructor(name: string, width = 100, height = 100, type = ComType.com) {
    this.id = generateShortId(name)
    this.name = `V${name}`
    this.type = type

    const obj = findByComName(this.name)!
    this.alias = obj.com.name
    this.img = obj.com.icon
    this.icon = obj.category.icon
    this.locked = false
    this.hided = false

    this.selected = false
    this.hovered = false

    this.attr = {
      x: 0,
      y: 0,
      w: width,
      h: height,
      deg: 0,
      opacity: 1,
    }

    this.projectId = 0
    this.parentId = null
    this.children = null

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
