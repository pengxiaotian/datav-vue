import { DatavComponent } from '@/components/_models/datav-component'

const diff = 5

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
      top = attr.y * scale + 60
      intersected = true
    }

    if (isIntersectToBottom(target, com)) {
      bottom = (attr.y + attr.h) * scale + 60
      intersected = true
    }

    if (isIntersectToLeft(target, com)) {
      left = attr.x * scale + 60
      intersected = true
    }

    if (isIntersectToRight(target, com)) {
      right = (attr.x + attr.w) * scale + 60
      intersected = true
    }

    if (isIntersectToVertical(target, com)) {
      vertical = (attr.x + attr.w / 2) * scale + 60
      intersected = true
    }

    if (isIntersectToHorizontal(target, com)) {
      horizontal = (attr.y + attr.h / 2) * scale + 60
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
