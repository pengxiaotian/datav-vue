import { ComponentAttr, DatavComponent } from '@/components/_models/datav-component'

const diff = 5
const offsetX = 60
const offsetY = 60

const isIntersectToTop = (from: DatavComponent, to: DatavComponent) => {
  return Math.abs(to.attr.y - from.attr.y) < diff
   || Math.abs(to.attr.y + to.attr.h - from.attr.y) < diff
    || Math.abs(to.attr.y + to.attr.h / 2 - from.attr.y) < diff
}

const isIntersectToBottom = (from: DatavComponent, to: DatavComponent) => {
  return Math.abs(to.attr.y - from.attr.y - from.attr.h) < diff
  || Math.abs(to.attr.y + to.attr.h - from.attr.y - from.attr.h) < diff
  || Math.abs(to.attr.y + to.attr.h / 2 - from.attr.y - from.attr.h) < diff
}

const isIntersectToLeft = (from: DatavComponent, to: DatavComponent) => {
  return Math.abs(to.attr.x - from.attr.x) < diff
  || Math.abs(to.attr.x + to.attr.w - from.attr.x) < diff
  || Math.abs(to.attr.x + to.attr.w / 2 - from.attr.x) < diff
}

const isIntersectToRight = (from: DatavComponent, to: DatavComponent) => {
  return Math.abs(to.attr.x - from.attr.x - from.attr.w) < diff
  || Math.abs(to.attr.x + to.attr.w - from.attr.x - from.attr.w) < diff
  || Math.abs(to.attr.x + to.attr.w / 2 - from.attr.x - from.attr.w) < diff
}

const isIntersectToVertical = (from: DatavComponent, to: DatavComponent) => {
  return Math.abs(to.attr.x - from.attr.x - from.attr.w / 2) < diff
  || Math.abs(to.attr.x + to.attr.w - from.attr.x - from.attr.w / 2) < diff
  || Math.abs(to.attr.x + to.attr.w / 2 - from.attr.x - from.attr.w / 2) < diff
}

const isIntersectToHorizontal = (from: DatavComponent, to: DatavComponent) => {
  return Math.abs(to.attr.y - from.attr.y - from.attr.h / 2) < diff
  || Math.abs(to.attr.y + to.attr.h - from.attr.y - from.attr.h / 2) < diff
  || Math.abs(to.attr.y + to.attr.h / 2 - from.attr.y - from.attr.h / 2) < diff
}

export const calcIntersectingLines = (target: DatavComponent, coms: DatavComponent[], scale: number) => {
  let intersected = false
  let [top, bottom, left, right, vertical, horizontal] = Array(6).fill(-1)
  for (let i = 0, len = coms.length; i < len; i++) {
    const com = coms[i]
    if (com.id === target.id || com.hided) {
      continue
    }

    intersected = false

    const { attr } = target
    if (isIntersectToTop(target, com)) {
      top = attr.y * scale + offsetY
      intersected = true
    }

    if (isIntersectToBottom(target, com)) {
      bottom = (attr.y + attr.h) * scale + offsetY
      intersected = true
    }

    if (isIntersectToLeft(target, com)) {
      left = attr.x * scale + offsetX
      intersected = true
    }

    if (isIntersectToRight(target, com)) {
      right = (attr.x + attr.w) * scale + offsetX
      intersected = true
    }

    if (isIntersectToVertical(target, com)) {
      vertical = (attr.x + attr.w / 2) * scale + offsetY
      intersected = true
    }

    if (isIntersectToHorizontal(target, com)) {
      horizontal = (attr.y + attr.h / 2) * scale + offsetX
      intersected = true
    }

    com.hovered = intersected
  }

  return {
    top,
    right,
    bottom,
    left,
    vertical,
    horizontal,
  }
}

export const angleToRadian = (angle: number) => {
  return angle * Math.PI / 180
}

export const sin = (rotate: number) => {
  return Math.abs(Math.sin(angleToRadian(rotate)))
}

export const cos = (rotate: number) => {
  return Math.abs(Math.cos(angleToRadian(rotate)))
}

/**
 * 获取一个组件旋转 rotate 后的样式
 */
export const getComponentRotatedStyle = (attr: ComponentAttr) => {
  const style = {
    w: attr.w,
    h: attr.h,
    top: attr.y,
    left: attr.x,
    right: 0,
    bottom: 0,
  }
  if (attr.deg !== 0) {
    const newWidth = style.w * cos(attr.deg) + style.h * sin(attr.deg)
    const diffX = (style.w - newWidth) / 2 // 旋转后范围变小是正值，变大是负值
    style.left += diffX
    style.right = style.left + newWidth

    const newHeight = style.h * cos(attr.deg) + style.w * sin(attr.deg)
    const diffY = (newHeight - style.h) / 2 // 始终是正
    style.top -= diffY
    style.bottom = style.top + newHeight

    style.w = newWidth
    style.h = newHeight
  } else {
    style.bottom = style.top + style.h
    style.right = style.left + style.w
  }

  return style
}

interface RectDto {
  x: number
  y: number
  w: number
  h: number
}

/**
 * 判断两个矩形是否相交
 */
export const checkRectIntersect = (rect1: RectDto, rect2: RectDto) => {
  const maxX = rect1.x + rect1.w >= rect2.x + rect2.w ? rect1.x + rect1.w : rect2.x + rect2.w
  const maxY = rect1.y + rect1.h >= rect2.y + rect2.h ? rect1.y + rect1.h : rect2.y + rect2.h
  const minX = rect1.x <= rect2.x ? rect1.x : rect2.x
  const minY = rect1.y <= rect2.y ? rect1.y : rect2.y
  return (maxX - minX <= rect1.w + rect2.w) && (maxY - minY <= rect1.h + rect2.h)
}
