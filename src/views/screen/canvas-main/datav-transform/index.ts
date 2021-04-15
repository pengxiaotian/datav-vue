import { BaseComponent, ComponentAttr } from '@/domains/base-component'
import { on, off } from '@/utils/dom'
import { EditorModule } from '@/store/modules/editor'

/**
 * 方位
 */
export type Direction = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l'

/**
 * 双向指示
 */
export type BidirectionalCursor = 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize'
/**
 * 单向指示
 */
export type DirectionCursor = 'nw-resize' | 'n-resize' | 'ne-resize' | 'e-resize' | 'se-resize' | 's-resize' | 'sw-resize' | 'w-resize'

// 八个方位点对应的初始角度
const initialDirectionAngle: {
  direction: Direction
  angle: number
}[] = [
  { direction: 'lt', angle: 0 },
  { direction: 't', angle: 45 },
  { direction: 'rt', angle: 90 },
  { direction: 'r', angle: 135 },
  { direction: 'rb', angle: 180 },
  { direction: 'b', angle: 225 },
  { direction: 'lb', angle: 270 },
  { direction: 'l', angle: 315 },
]

// 每个范围的角度对应的光标
const angleToCursor: {
  start: number
  end: number
  cursor: BidirectionalCursor
}[] = [
  { start: 338, end: 23, cursor: 'nwse-resize' },
  { start: 23, end: 68, cursor: 'ns-resize' },
  { start: 68, end: 113, cursor: 'nesw-resize' },
  { start: 113, end: 158, cursor: 'ew-resize' },
  { start: 158, end: 203, cursor: 'nwse-resize' },
  { start: 203, end: 248, cursor: 'ns-resize' },
  { start: 248, end: 293, cursor: 'nesw-resize' },
  { start: 293, end: 338, cursor: 'ew-resize' },
]

export const getCursors = (startAngle: number) => {
  const rotate = (startAngle + 360) % 360 // 防止角度有负数，所以 + 360
  const result: Record<string, BidirectionalCursor> = {}
  let lastMatchIndex = -1 // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度
  initialDirectionAngle.forEach(point => {
    const angle = (point.angle + rotate) % 360
    const len = angleToCursor.length
    const i = 0
    while (i < len) {
      lastMatchIndex = (lastMatchIndex + 1) % len
      const angleLimit = angleToCursor[lastMatchIndex]
      if (angle < 23 || angle >= 338) {
        result[point.direction] = 'nwse-resize'
        break
      }

      if (angleLimit.start <= angle && angle < angleLimit.end) {
        result[point.direction] = angleLimit.cursor
        break
      }
    }
  })

  return result as Record<Direction, BidirectionalCursor>
}

export const setHover = (com: BaseComponent, hovered: boolean) => {
  com.hovered = hovered
}

const setAttr = (ev: MouseEvent, dir: Direction | null, com: BaseComponent, scale: number, grid: number) => {
  const attr = { ...com.attr }
  const pos = Object.create(null) as Partial<ComponentAttr>
  const move = (e: MouseEvent) => {
    if (dir === 't') {
      pos.h = Math.round(attr.h + (ev.clientY - e.clientY) / scale)
      pos.y = Math.round(attr.y + (e.clientY - ev.clientY) / scale)
    } else if (dir === 'rt') {
      pos.h = Math.round(attr.h + (ev.clientY - e.clientY) / scale)
      pos.w = Math.round(attr.w + (ev.clientX - e.clientX) / scale)
      pos.x = Math.round(attr.x + (e.clientX - ev.clientX) / scale)
      pos.y = Math.round(attr.y + (e.clientY - ev.clientY) / scale)
    } else if (dir === 'r') {
      pos.w = Math.round(attr.w + (e.clientX - ev.clientX) / scale)
    } else if (dir === 'rb') {
      pos.h = Math.round(attr.h + (e.clientY - ev.clientY) / scale)
      pos.w = Math.round(attr.w + (e.clientX - ev.clientX) / scale)
    } else if (dir === 'b') {
      pos.h = Math.round(attr.h + (e.clientY - ev.clientY) / scale)
    } else if (dir === 'lb') {
      pos.h = Math.round(attr.h + (e.clientY - ev.clientY) / scale)
      pos.w = Math.round(attr.w + (ev.clientX - e.clientX) / scale)
      pos.x = Math.round(attr.x + (e.clientX - ev.clientX) / scale)
    } else if (dir === 'l') {
      pos.w = Math.round(attr.w + (ev.clientX - e.clientX) / scale)
      pos.x = Math.round(attr.x + (e.clientX - ev.clientX) / scale)
    } else if (dir === 'lt') {
      pos.h = Math.round(attr.h + (ev.clientY - e.clientY) / scale)
      pos.w = Math.round(attr.w + (ev.clientX - e.clientX) / scale)
      pos.x = Math.round(attr.x + (e.clientX - ev.clientX) / scale)
      pos.y = Math.round(attr.y + (e.clientY - ev.clientY) / scale)
    } else {
      // grid 是每次移动固定格数
      pos.x = attr.x + Math.round((e.clientX - ev.clientX) / scale / grid) * grid
      pos.y = attr.y + Math.round((e.clientY - ev.clientY) / scale / grid) * grid
    }

    com.attr = { ...com.attr, ...pos }

    EditorModule.calcAlignLine(com)
  }

  const up = () => {
    off(document, 'mousemove', move)
    off(document, 'mouseup', up)

    EditorModule.hideAlignLine(com.id)
  }

  on(document, 'mousemove', move)
  on(document, 'mouseup', up)
}

export const handleZoom = (ev: MouseEvent, dir: Direction, com: BaseComponent, scale: number) => {
  setAttr(ev, dir, com, scale, 0)
}

export const handleMove = (ev: MouseEvent, com: BaseComponent, scale: number, grid: number) => {
  setAttr(ev, null, com, scale, grid)
}

export const handleRotate = (ev: MouseEvent, el: HTMLElement, com: BaseComponent) => {
  // 获取元素中心点位置
  const rect = el.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const startAngle = Math.atan2(
    centerY - ev.clientY,
    centerX - ev.clientX,
  ) * 180 / Math.PI - com.attr.deg

  const move = (e: MouseEvent) => {
    const angle = Math.atan2(
      centerY - e.clientY,
      centerX - e.clientX,
    ) * 180 / Math.PI - startAngle
    const deg = ~~angle % 360
    com.attr.deg = Math.max(deg, deg + 360)
  }

  const up = () => {
    off(document, 'mousemove', move)
    off(document, 'mouseup', up)
  }

  on(document, 'mousemove', move)
  on(document, 'mouseup', up)
}
