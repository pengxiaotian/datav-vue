import { addClass, removeClass } from '@/utils/dom'

type LayoutDirection = 'LR' | 'TB'

interface RulerOption {
  direction: LayoutDirection
  rulerWidth: number
  rulerHeight: number
  bgColor: string
  fontFamily: string
  fontSize: string
  fontColor: string
  strokeStyle: string
  lineWidth: number
  enableMouseTracking: boolean
  enableToolTip: boolean
  scale: number
  offset: number
  ratio: number
}

const pixelize = (val: number | string) => {
  return val + 'px'
}

class GuideLine {
  dragContainer: HTMLDivElement

  constructor(
    private el: HTMLDivElement,
    public guideLine: HTMLDivElement,
    private options: RulerOption,
    private event: MouseEvent,
  ) {
    this.dragContainer = el.querySelector('.ruler-wrapper') as HTMLDivElement

    guideLine.addEventListener('mousedown', this.mousedown)
    guideLine.addEventListener('mouseup', this.stopMoving)
    guideLine.addEventListener('dblclick', this.dblclick)

    this.startMoving(event)
  }

  startMoving(e: MouseEvent) {
    const { el, guideLine, dragContainer, options } = this
    addClass(guideLine, 'rul_line_dragged')

    const divTop = parseInt(guideLine.style.top) || 0,
      divLeft = parseInt(guideLine.style.left) || 0,
      eWi = guideLine.offsetWidth,
      eHe = guideLine.offsetHeight,
      cWi = dragContainer.offsetWidth,
      cHe = dragContainer.offsetHeight,
      cursor = options.direction == 'TB' ? 'ns-resize' : 'ew-resize'

    el.style.cursor = cursor
    guideLine.style.cursor = cursor
    const diffX = e.clientX - divLeft,
      diffY = e.clientY - divTop
    document.onmousemove = evt => {
      const aX = Math.min(Math.max(evt.clientX - diffX, 0), cWi - eWi)
      const aY = Math.min(Math.max(evt.clientY - diffY, 0), cHe - eHe)
      guideLine.style.left = pixelize(aX)
      guideLine.style.top = pixelize(aY)
      this.updateToolTip(aX, aY)
    }
    this.showToolTip()
  }

  stopMoving() {
    this.el.style.cursor = ''
    this.guideLine.style.cursor = ''
    document.onmousemove = null
    this.hideToolTip()
    removeClass(this.guideLine, 'rul_line_dragged')
  }

  showToolTip() {
    if (!this.options.enableToolTip) {
      return
    }
    addClass(this.guideLine, 'rul_tooltip')
  }

  updateToolTip(x: number, y: number) {
    const { guideLine, options } = this
    const { rulerHeight, offset, scale } = options
    if (y) {
      guideLine.dataset.tip = 'Y: ' + Math.round((y - rulerHeight - 1 - offset) * scale) + ' px'
    } else {
      guideLine.dataset.tip = 'X: ' + Math.round((x - rulerHeight - 1 - offset) * scale) + ' px'
    }
  }

  hideToolTip() {
    removeClass(this.guideLine, 'rul_tooltip')
  }

  show() {
    this.guideLine.style.display = 'block'
  }

  hide() {
    this.guideLine.style.display = 'none'
  }

  mousedown(e: MouseEvent) {
    e.stopPropagation()
    this.startMoving(e)
  }

  dblclick(e: any) {
    e.stopPropagation()
    this.destroy()
  }

  destroy() {
    const { guideLine } = this
    this.stopMoving()
    guideLine.removeEventListener('mousedown', this.mousedown)
    guideLine.removeEventListener('mouseup', this.stopMoving)
    guideLine.removeEventListener('dblclick', this.dblclick)
    guideLine.parentNode && guideLine.parentNode.removeChild(guideLine)
  }
}

// 创建高分辨率画布
const createCanvas = (el: HTMLCanvasElement | null, width: number, height: number, ratio: number) => {
  const canvas = el ?? document.createElement('canvas')
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = pixelize(width)
  canvas.style.height = pixelize(height)

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  }
  return canvas
}

export class RulerBuilder {
  el: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  ruler = {
    orgPos: 0,
    thickness: 0,
    width: 0,
    height: 0,
  }

  guides: GuideLine[] = []

  options: RulerOption = {
    direction: 'TB',
    rulerWidth: 20,
    rulerHeight: 20,
    bgColor: '',
    fontFamily: 'sans-serif',
    fontSize: '10px',
    fontColor: '#a1aeb3',
    strokeStyle: 'rgba(161, 174, 179, 0.8)',
    lineWidth: 0.5,
    enableMouseTracking: true,
    enableToolTip: true,
    scale: 1,
    offset: 0,
    ratio: 2,
  }

  constructor(container: HTMLElement, options: Partial<RulerOption>) {
    this.options = { ...this.options, ...options }
    this.el = container

    // 创建标尺
    this.constructRuler()

    this.el.addEventListener('mouseup', this.mouseup.bind(this))
  }

  constructRuler = () => {
    const { el, options } = this
    const { direction, rulerWidth, rulerHeight, ratio } = options

    const width = direction === 'TB'
      ? Math.max(el.offsetWidth, rulerWidth)
      : Math.max(el.offsetHeight, rulerWidth)
    const height = rulerHeight

    this.ruler.width = width
    this.ruler.height = height

    // 创建高分辨率画布
    const canvas = createCanvas(null, width, height, ratio)
    addClass(canvas, 'canvas-ruler')
    el.appendChild(canvas)

    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (ctx) {
      this.ctx = ctx
    }

    this.drawRuler()
    // canvas.addEventListener('mousedown', this.mousedown)
  }

  // 画标尺
  drawRuler() {
    const { ctx, options, ruler } = this
    const { width, height } = ruler

    ctx.beginPath()
    ctx.fillStyle = options.bgColor
    ctx.fillRect(0, 0, width, height)
    ctx.closePath()

    ctx.beginPath()
    ctx.font = `${options.fontSize} ${options.fontFamily}`
    ctx.textAlign = 'left'
    ctx.fillStyle = options.fontColor
    ctx.strokeStyle = options.strokeStyle
    ctx.lineWidth = options.lineWidth
    this.drawPoints()
    ctx.stroke()
  }

  // 画刻度
  drawPoints() {
    const { options, ctx, ruler } = this
    const { width, height } = ruler

    const lineLengthMax = 0,
      lineLengthMed = height / 1.5,
      lineLengthMin = height / 1.2

    for (let pos = 0; pos <= width; pos += 1) {
      const delta = pos - options.offset
      let pointLength = 0
      let label = ''
      let draw = false

      if (delta % 50 === 0) {
        pointLength = lineLengthMax
        label = Math.floor(Math.abs(delta) / options.scale).toString()
        draw = true
      } else if (delta % 25 === 0) {
        pointLength = lineLengthMed
        draw = true
      } else if (delta % 5 === 0) {
        pointLength = lineLengthMin
        draw = true
      }

      if (draw && delta >= 0) {
        ctx.moveTo(pos + 0.5, height + 0.5)
        ctx.lineTo(pos + 0.5, pointLength)
        ctx.fillText(label, pos + 2.5, height / 1.5)
      }
    }
  }

  constructGuide(e: MouseEvent, x: number, y: number, isSet = false) {
    const { el, options } = this
    const { scale, direction, rulerHeight } = options

    const guide = document.createElement('div')
    guide.title = '双击删除'
    const guideStyle = direction === 'TB' ? 'v-ruler-line' : 'h-ruler-line'
    addClass(guide,  `rul_line ${guideStyle}`)
    el.appendChild(guide)

    if (direction === 'TB') {
      const left = isSet ? Math.round(x / scale) + rulerHeight : x - el.getBoundingClientRect().left
      guide.style.left = pixelize(left)
    } else {
      const top = isSet ? Math.round(y / scale) + rulerHeight : y - el.getBoundingClientRect().top
      guide.style.top = pixelize(top)
    }

    // this.guides.push(new GuideLine(el, guide, options, e))
  }

  mouseup() {
    this.guides.forEach(guide => guide.stopMoving())
  }

  mousedown(e: MouseEvent) {
    this.constructGuide(e, e.clientX, e.clientY)
  }

  setSize(w: number, h: number, s: number) {
    const { el, options } = this
    options.rulerWidth = w
    options.rulerHeight = h
    options.scale = s
    const { direction, rulerWidth, rulerHeight, ratio } = options

    const width = direction === 'TB'
      ? Math.max(el.offsetWidth, rulerWidth)
      : Math.max(el.offsetHeight, rulerWidth)
    const height = rulerHeight

    this.ruler.width = width
    this.ruler.height = height

    createCanvas(this.canvas, width, height, ratio)
    this.drawRuler()
  }

  setScale(newScale: number) {
    this.options.scale = newScale
    this.drawRuler()
  }

  toggleGuideVisibility(visible: boolean) {
    const func = visible ? 'show' : 'hide'
    this.guides.forEach(guide => guide[func]())
  }

  clearGuides() {
    this.guides.forEach(guide => guide.destroy())
    this.guides = []
  }

  destroy() {
    this.clearGuides()
    this.canvas.removeEventListener('mousedown', this.mousedown)
    this.el.removeEventListener('mouseup', this.mouseup)
    this.el.remove()
  }
}
