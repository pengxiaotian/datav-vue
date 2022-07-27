import type { CSSProperties } from 'vue'
import { DatavComponent, ComponentAttr, ComType } from '@/components/_models/datav-component'
import { on, off } from '@/utils/dom'
import { angleToRadian } from '@/utils/editor'

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

export type ControlPoint = {
  [k in Direction]: {
    name: string
    style: Partial<CSSProperties>
    rotateStyle?: Partial<CSSProperties>
  }
}

interface IPoint {
  x: number
  y: number
}

// 八个方位点对应的初始角度和光标
const initialDirectionAngle: {
  direction: Direction
  angle: number
  cursor: BidirectionalCursor
  singleCursor: DirectionCursor
}[] = [
  { direction: 'lt', angle: 0, cursor: 'nwse-resize', singleCursor: 'nw-resize' },
  { direction: 't', angle: 45, cursor: 'ns-resize', singleCursor: 'n-resize' },
  { direction: 'rt', angle: 90, cursor: 'nesw-resize', singleCursor: 'ne-resize' },
  { direction: 'r', angle: 135, cursor: 'ew-resize', singleCursor: 'e-resize' },
  { direction: 'rb', angle: 180, cursor: 'nwse-resize', singleCursor: 'se-resize' },
  { direction: 'b', angle: 225, cursor: 'ns-resize', singleCursor: 's-resize' },
  { direction: 'lb', angle: 270, cursor: 'nesw-resize', singleCursor: 'sw-resize' },
  { direction: 'l', angle: 315, cursor: 'ew-resize', singleCursor: 'w-resize' },
]

// 每个范围的角度对应的光标
const angleToCursor: {
  start: number
  end: number
  cursor: BidirectionalCursor
  singleCursor: DirectionCursor
}[] = [
  { start: 338, end: 23, cursor: 'nwse-resize', singleCursor: 'nw-resize' },
  { start: 23, end: 68, cursor: 'ns-resize', singleCursor: 'n-resize' },
  { start: 68, end: 113, cursor: 'nesw-resize', singleCursor: 'ne-resize' },
  { start: 113, end: 158, cursor: 'ew-resize', singleCursor: 'e-resize' },
  { start: 158, end: 203, cursor: 'nwse-resize', singleCursor: 'se-resize' },
  { start: 203, end: 248, cursor: 'ns-resize', singleCursor: 's-resize' },
  { start: 248, end: 293, cursor: 'nesw-resize', singleCursor: 'sw-resize' },
  { start: 293, end: 338, cursor: 'ew-resize', singleCursor: 'w-resize' },
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

  return result
}

function getCenterPoint(p1: IPoint, p2: IPoint): IPoint {
  return {
    x: p1.x + ((p2.x - p1.x) / 2),
    y: p1.y + ((p2.y - p1.y) / 2),
  }
}

/**
 * 计算根据圆心旋转后的点的坐标
 * ```
 * // https://github.com/woai3c/Front-end-articles/issues/20
 * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
 * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
 * ```
 * @param point 旋转前的点坐标
 * @param center 旋转中心
 * @param rotate 旋转的角度
 * @returns 旋转后的坐标
 */
function calcRotatedPoint(point: IPoint, center: IPoint, rotate: number): IPoint {
  const rad = angleToRadian(rotate)
  return {
    x: (point.x - center.x) * Math.cos(rad) - (point.y - center.y) * Math.sin(rad) + center.x,
    y: (point.x - center.x) * Math.sin(rad) + (point.y - center.y) * Math.cos(rad) + center.y,
  }
}

/**
 * 拖拽角时计算缩放后位置大小
 * @param direction 拖拽方向
 * @param attr 开始时的基本信息
 * @param curPositon 当前拖拽位置
 * @param symmetricPoint 对称点坐标
 * @param scale 缩放比例
 */
function calcResizeForCorner(direction: Direction, attr: ComponentAttr, curPositon: IPoint, symmetricPoint: IPoint, scale: number, pos: Partial<ComponentAttr>) {
  const newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  const newCornerPoint = calcRotatedPoint(symmetricPoint, newCenterPoint, -attr.deg)
  const newDiagonalPoint = calcRotatedPoint(curPositon, newCenterPoint, -attr.deg)

  if (direction[0] === 'l') {
    pos.x = Math.round(newDiagonalPoint.x / scale)
    pos.w = Math.round((newCornerPoint.x - newDiagonalPoint.x) / scale)
  } else if (direction[0] === 'r') {
    pos.x = Math.round(newCornerPoint.x / scale)
    pos.w = Math.round((newDiagonalPoint.x - newCornerPoint.x) / scale)
  }

  if (direction[1] === 't') {
    pos.y = Math.round(newDiagonalPoint.y / scale)
    pos.h = Math.round((newCornerPoint.y - newDiagonalPoint.y) / scale)
  } else if (direction[1] === 'b') {
    pos.y = Math.round(newCornerPoint.y / scale)
    pos.h = Math.round((newDiagonalPoint.y - newCornerPoint.y) / scale)
  }
}

/**
 * 拖拽边时计算缩放后位置大小
 * @param direction 拖拽方向
 * @param attr 开始时的基本信息
 * @param curPositon 当前拖拽位置
 * @param startPoint 拖拽起始点位置
 * @param symmetricPoint 对称点坐标
 * @param scale 缩放比例
 */
function calcResizeForEdge(dir: Direction, attr: ComponentAttr, startPoint: IPoint, curPositon: IPoint, symmetricPoint: IPoint, scale: number, pos: Partial<ComponentAttr>) {
  const newDiagonalPoint = calcRotatedPoint(curPositon, startPoint, -attr.deg)
  if (dir === 't' || dir === 'b') {
    const newCornerPoint = calcRotatedPoint({ x: startPoint.x, y: newDiagonalPoint.y }, startPoint, attr.deg)
    // 勾股定理
    const height = Math.sqrt((newCornerPoint.x - symmetricPoint.x) ** 2 + (newCornerPoint.y - symmetricPoint.y) ** 2)
    if (height > 0) {
      const center = {
        x: newCornerPoint.x - (newCornerPoint.x - symmetricPoint.x) / 2,
        y: newCornerPoint.y + (symmetricPoint.y - newCornerPoint.y) / 2,
      }
      pos.h = Math.round(height / scale)
      pos.x = Math.round(center.x / scale - attr.w / 2)
      pos.y = Math.round((center.y - height / 2) / scale)
    }
  }

  if (dir === 'l' || dir === 'r') {
    const newCornerPoint = calcRotatedPoint({ x: newDiagonalPoint.x, y: startPoint.y }, startPoint, attr.deg)
    const width = Math.sqrt((newCornerPoint.x - symmetricPoint.x) ** 2 + (newCornerPoint.y - symmetricPoint.y) ** 2)
    if (width > 0) {
      const center = {
        x: newCornerPoint.x - (newCornerPoint.x - symmetricPoint.x) / 2,
        y: newCornerPoint.y + (symmetricPoint.y - newCornerPoint.y) / 2,
      }
      pos.w = Math.round(width / scale)
      pos.x = Math.round((center.x - width / 2) / scale)
      pos.y = Math.round(center.y / scale - attr.h / 2)
    }
  }
}

/**
 * 计算缩放后位置大小 - 自然模式
 * @param dir 拖拽方向
 * @param attr 开始时的基本信息
 * @param startPoint 拖拽起始点位置
 * @param curPositon 当前拖拽位置
 * @param scale 缩放比例
 */
function calcResizeForNormal(dir: Direction, attr: ComponentAttr, startPoint: IPoint, curPositon: IPoint, scale: number, pos: Partial<ComponentAttr>) {
  if (dir === 't') {
    pos.h = Math.round(attr.h + (startPoint.y - curPositon.y) / scale)
    pos.y = Math.round(attr.y + (curPositon.y - startPoint.y) / scale)
  } else if (dir === 'rt') {
    pos.h = Math.round(attr.h + (startPoint.y - curPositon.y) / scale)
    pos.w = Math.round(attr.w + (curPositon.x - startPoint.x) / scale)
    pos.y = Math.round(attr.y + (curPositon.y - startPoint.y) / scale)
  } else if (dir === 'r') {
    pos.w = Math.round(attr.w + (curPositon.x - startPoint.x) / scale)
  } else if (dir === 'rb') {
    pos.h = Math.round(attr.h + (curPositon.y - startPoint.y) / scale)
    pos.w = Math.round(attr.w + (curPositon.x - startPoint.x) / scale)
  } else if (dir === 'b') {
    pos.h = Math.round(attr.h + (curPositon.y - startPoint.y) / scale)
  } else if (dir === 'lb') {
    pos.h = Math.round(attr.h + (curPositon.y - startPoint.y) / scale)
    pos.w = Math.round(attr.w + (startPoint.x - curPositon.x) / scale)
    pos.x = Math.round(attr.x + (curPositon.x - startPoint.x) / scale)
  } else if (dir === 'l') {
    pos.w = Math.round(attr.w + (startPoint.x - curPositon.x) / scale)
    pos.x = Math.round(attr.x + (curPositon.x - startPoint.x) / scale)
  } else if (dir === 'lt') {
    pos.h = Math.round(attr.h + (startPoint.y - curPositon.y) / scale)
    pos.w = Math.round(attr.w + (startPoint.x - curPositon.x) / scale)
    pos.x = Math.round(attr.x + (curPositon.x - startPoint.x) / scale)
    pos.y = Math.round(attr.y + (curPositon.y - startPoint.y) / scale)
  }
}

export const handleZoom = (
  ev: MouseEvent,
  dir: Direction,
  com: DatavComponent,
  scale: number,
  isNormalResizeMode: boolean,
  moveCallback: () => void,
  upCallback: () => void,
) => {
  const attr = { ...com.attr }
  const pos = Object.create(null) as Partial<ComponentAttr>

  let layoutRect: DOMRect // 画布位移信息
  let startPoint: IPoint // 当前点击坐标
  let symmetricPoint: IPoint // 对称点的坐标
  const curPositon: IPoint = { x: 0, y: 0 } // 当前位置坐标
  if (isNormalResizeMode) {
    startPoint = { x: ev.clientX, y: ev.clientY }
  } else {
    const center = { x: (attr.x + attr.w / 2) * scale, y: (attr.y + attr.h / 2) * scale }
    layoutRect = document.getElementById('canvas-coms').getBoundingClientRect()
    startPoint = { x: ev.clientX - layoutRect.left, y: ev.clientY - layoutRect.top }
    symmetricPoint = { x: center.x - (startPoint.x - center.x), y: center.y - (startPoint.y - center.y) }
  }

  const move = (e: MouseEvent) => {
    if (isNormalResizeMode) {
      curPositon.x = e.clientX
      curPositon.y = e.clientY
      calcResizeForNormal(dir, attr, startPoint, curPositon, scale, pos)
    } else {
      curPositon.x = e.clientX - layoutRect.left
      curPositon.y = e.clientY - layoutRect.top
      if (dir.length === 1) {
        calcResizeForEdge(dir, attr, startPoint, curPositon, symmetricPoint, scale, pos)
      } else {
        calcResizeForCorner(dir, attr, curPositon, symmetricPoint, scale, pos)
      }
    }

    if (pos.x != undefined) {
      com.attr.x = pos.x
    }

    if (pos.y != undefined) {
      com.attr.y = pos.y
    }

    if (pos.w != undefined) {
      com.scaling.w = Math.max(10, pos.w)
    }

    if (pos.h != undefined) {
      com.scaling.h = Math.max(10, pos.h)
    }

    moveCallback()
  }

  const up = () => {
    off(document, 'mousemove', move)
    off(document, 'mouseup', up)
    upCallback()
  }

  on(document, 'mousemove', move)
  on(document, 'mouseup', up)
}

export const handleMove = (
  ev: MouseEvent,
  com: DatavComponent,
  scale: number,
  grid: number,
  moveCallback: () => void,
  upCallback: () => void,
) => {
  const { x, y } = com.attr
  const move = (e: MouseEvent) => {
    // 每次移动固定格数
    com.attr.x = x + Math.round((e.clientX - ev.clientX) / scale / grid) * grid
    com.attr.y = y + Math.round((e.clientY - ev.clientY) / scale / grid) * grid
    moveCallback()
  }

  const up = () => {
    off(document, 'mousemove', move)
    off(document, 'mouseup', up)
    upCallback()
  }

  on(document, 'mousemove', move)
  on(document, 'mouseup', up)
}

export const handleRotate = (
  ev: MouseEvent,
  el: HTMLElement,
  com: DatavComponent,
  upCallback: (deg: number) => void,
) => {
  // 获取元素中心点位置
  const rect = el.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  let deg = 0
  const startAngle = Math.atan2(
    centerY - ev.clientY,
    centerX - ev.clientX,
  ) * 180 / Math.PI - com.attr.deg

  const move = (e: MouseEvent) => {
    const angle = Math.atan2(
      centerY - e.clientY,
      centerX - e.clientX,
    ) * 180 / Math.PI - startAngle
    deg = Math.round(angle % 360)
    com.attr.deg = deg < 0 ? deg + 360 : deg
  }

  const up = () => {
    off(document, 'mousemove', move)
    off(document, 'mouseup', up)
    upCallback(deg)
  }

  on(document, 'mousemove', move)
  on(document, 'mouseup', up)
}

export const handleChildrenRotate = (parentCom: DatavComponent, deg: number) => {
  parentCom.attr.deg = 0
  parentCom.children.forEach(com => {
    if (com.type === ComType.layer) {
      handleChildrenRotate(com, deg)
    } else {
      const angle = Math.round((com.attr.deg + deg) % 360)
      com.attr.deg = angle < 0 ? angle + 360 : angle
    }
  })
}
