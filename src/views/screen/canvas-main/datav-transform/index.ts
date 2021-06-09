import { DatavComponent, ComponentAttr } from '@/components/datav-component'
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

export const setHover = (com: DatavComponent, hovered: boolean) => {
  com.hovered = hovered
}

/**
 * 角度转弧度
 * Math.PI = 180 度
 * @param angle
 * @returns {number}
 */
function angleToRadian(angle) {
  return angle * Math.PI / 180
}
/**
 * 计算根据圆心旋转后的点的坐标
 * @param   {Object}  point  旋转前的点坐标
 * @param   {Object}  center 旋转中心
 * @param   {Number}  rotate 旋转的角度
 * @return  {Object}         旋转后的坐标
 * https://www.zhihu.com/question/67425734/answer/252724399 旋转矩阵公式
 */
export function calculateRotatedPointCoordinate(point, center, rotate) {
  /**
   * 旋转公式：
   *  点a(x, y)
   *  旋转中心c(x, y)
   *  旋转后点n(x, y)
   *  旋转角度θ                tan ??
   * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
   * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
   */
  return {
    x: (point.x - center.x) * Math.cos(angleToRadian(rotate)) - (point.y - center.y) * Math.sin(angleToRadian(rotate)) + center.x,
    y: (point.x - center.x) * Math.sin(angleToRadian(rotate)) + (point.y - center.y) * Math.cos(angleToRadian(rotate)) + center.y,
  }
}

export function getCenterPoint(p1, p2) {
  return {
    x: p1.x + ((p2.x - p1.x) / 2),
    y: p1.y + ((p2.y - p1.y) / 2),
  }
}

/**
 * 计算缩放后位置大小
 * @param direction 拖拽方向
 * @param style 当前位置和大小
 * @param startPoint 拖拽起始点位置
 * @param symmetricPoint 对称点坐标
 * @param endPoint 当前拖拽位置
 * @returns {{}|any}
 */
export function calcResizeInfo(direction, style, startPoint, symmetricPoint, endPoint) {
  // 拖拽角上的点
  if (direction.length === 2) {
    const newCenter = getCenterPoint(endPoint, symmetricPoint)
    const thatPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenter, -style.rotate)
    const thisPoint = calculateRotatedPointCoordinate(endPoint, newCenter, -style.rotate)
    const newStyle = {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
    }
    // 判断: 左或者右
    if (direction[0] === 'l') {
      newStyle.x = Math.round(thisPoint.x / style.scale)
      newStyle.width = Math.round((thatPoint.x - thisPoint.x) / style.scale)
    } else if (direction[0] === 'r') {
      newStyle.x = Math.round(thatPoint.x / style.scale)
      newStyle.width = Math.round((thisPoint.x - thatPoint.x) / style.scale)
    }
    // 判断: 上或者下
    if (direction[1] === 't') {
      newStyle.y = Math.round(thisPoint.y / style.scale)
      newStyle.height = Math.round((thatPoint.y - thisPoint.y) / style.scale)
    } else if (direction[1] === 'b') {
      newStyle.y = Math.round(thatPoint.y / style.scale)
      newStyle.height = Math.round((thisPoint.y - thatPoint.y) / style.scale)
    }
    return newStyle
  }

  // 拖拽边上的点
  if (direction.length === 1) {
    const newStyle = JSON.parse(JSON.stringify(style))
    const thisPoint = calculateRotatedPointCoordinate(endPoint, startPoint, -style.rotate)

    // 拖拽上下两边
    if (direction === 't' || direction === 'b') {
      const thatPoint = calculateRotatedPointCoordinate({ x: startPoint.x, y: thisPoint.y }, startPoint, style.rotate)
      const height = Math.sqrt((thatPoint.x - symmetricPoint.x) ** 2 + (thatPoint.y - symmetricPoint.y) ** 2)
      if (height > 0) {
        const center = { x: thatPoint.x - (thatPoint.x - symmetricPoint.x) / 2, y: thatPoint.y + (symmetricPoint.y - thatPoint.y) / 2 }
        newStyle.width = Math.round(style.width / style.scale)
        newStyle.height = Math.round(height / style.scale)
        newStyle.x = Math.round((center.x - (style.width / 2)) / style.scale)
        newStyle.y = Math.round((center.y - (height / 2)) / style.scale)
      }
    }

    // 拖拽左右两边
    if (direction === 'l' || direction === 'r') {
      const thatPoint = calculateRotatedPointCoordinate({ x: thisPoint.x, y: startPoint.y }, startPoint, style.rotate)
      const width = Math.sqrt((thatPoint.x - symmetricPoint.x) ** 2 + (thatPoint.y - symmetricPoint.y) ** 2)
      if (width > 0) {
        const center = { x: thatPoint.x - (thatPoint.x - symmetricPoint.x) / 2, y: thatPoint.y + (symmetricPoint.y - thatPoint.y) / 2 }
        newStyle.width = Math.round(width / style.scale)
        newStyle.height = Math.round(style.height / style.scale)
        newStyle.x = Math.round((center.x - (width / 2)) / style.scale)
        newStyle.y = Math.round((center.y - (style.height / 2)) / style.scale)
      }
    }
    return newStyle
  }
}

const setAttr = (ev: MouseEvent, dir: Direction | null, com: DatavComponent, scale: number, grid: number) => {
  const attr = { ...com.attr }
  const pos = Object.create(null) as Partial<ComponentAttr>

  const style = {
    x: Math.round(attr.x * scale),
    y: Math.round(attr.y * scale),
    width: Math.round(attr.w * scale),
    height: Math.round(attr.h * scale),
    rotate: attr.deg,
    scale: scale,
  }
  // 组件中心点
  const center = { x: style.x + style.width / 2, y: style.y + style.height / 2 }
  // 获取画布位移信息
  const layoutRect = document.querySelector('#canvas-coms').getBoundingClientRect()
  // 当前点击坐标
  const startPoint = { x: ev.clientX - layoutRect.left, y: ev.clientY - layoutRect.top }
  // 获取对称点的坐标
  const symmetricPoint = { x: center.x - (startPoint.x - center.x), y: center.y - (startPoint.y - center.y) }
  const move = (e: MouseEvent) => {
    if (dir !== null) {
      const endPoint = { x: e.clientX - layoutRect.left, y: e.clientY - layoutRect.top }
      const newPosition = calcResizeInfo(dir, style, startPoint, symmetricPoint, endPoint)
      pos.x = newPosition.x
      pos.y = newPosition.y
      pos.w = newPosition.width
      pos.h = newPosition.height
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

export const handleZoom = (ev: MouseEvent, dir: Direction, com: DatavComponent, scale: number) => {
  setAttr(ev, dir, com, scale, 0)
}

export const handleMove = (ev: MouseEvent, com: DatavComponent, scale: number, grid: number) => {
  setAttr(ev, null, com, scale, grid)
}

export const handleRotate = (ev: MouseEvent, el: HTMLElement, com: DatavComponent) => {
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
    const deg = Math.round(angle % 360)
    com.attr.deg = deg < 0 ? deg + 360 : deg
  }

  const up = () => {
    off(document, 'mousemove', move)
    off(document, 'mouseup', up)
  }

  on(document, 'mousemove', move)
  on(document, 'mouseup', up)
}
