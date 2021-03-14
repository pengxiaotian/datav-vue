export class NavCanvas {
  private readonly j = 0.85
  private readonly k = 10
  private readonly l = 4

  private canvas: HTMLCanvasElement
  private tabSelector = ''

  private pattern: CanvasPattern | null = null

  private tabWidthList: number[] = []
  private tabHeight = 0

  private opt = {
    currentIndex: 0,
    nextIndex: 1,
    speed: 1,
    timer: 0,
    width: 200,
    height: 100,
    animating: false,
    curDisX: 0,
    distance: 0,
  }

  constructor(el: string, tabSelector: string) {
    this.canvas = document.getElementById(el) as HTMLCanvasElement
    this.tabSelector = tabSelector

    const { opt } =this
    this.toggle(1)
    this.calcTabs()
    this.initCanvas(this.canvas, opt.width, opt.height)
    this.createPattern(this.canvas)
    this.startDraw(0)
  }

  initCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
    const ctx = canvas.getContext('2d')!
    const { devicePixelRatio } = window
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(devicePixelRatio, devicePixelRatio)
  }

  calcTabs() {
    const { opt } = this
    const nodes = document.querySelectorAll(this.tabSelector) as unknown as HTMLSpanElement[]
    const b = []
    let c = 0
    nodes.forEach(node => {
      b.push(c)
      c += node.offsetWidth
    })

    b[0] = -20
    b.push(c)

    this.tabWidthList = b
    this.tabHeight = nodes[0].offsetHeight + 0
    opt.height = this.tabHeight + 20
    opt.width = window.innerWidth
  }

  createPattern(canvas: HTMLCanvasElement) {
    const b = 140, c = 63, d = 1
    const e = document.createElement('canvas')

    e.width = b
    e.height = c
    e.style.width = b / d + 'px'
    e.style.height = c / d + 'px'

    const ctx = e.getContext('2d')!
    //缩放 宽高 100%
    ctx.scale(d, d)
    ctx.lineWidth = 0.4
    for (let g = 3, h = 0.8, j = 1; 30 > j; j++) {
    //设置或返回用于笔触的颜色、渐变或模式
      ctx.strokeStyle = 'RGBA(22, 120, 160, ' + h + ')'
      //开始一条路径
      ctx.beginPath()
      //把路径移动到画布中的指定点，不创建线条
      ctx.moveTo(0, j * g)
      //添加一个新点，然后在画布中创建从该点到最后指定点的线条
      ctx.lineTo(b, j * g)
      //绘制已定义的路径
      ctx.stroke()
      //创建从当前点回到起始点的路径
      ctx.closePath()

      if (10 < j) {
        h -= 0.1
      }
    }

    this.pattern = canvas.getContext('2d')!.createPattern(e, 'repeat-x')
  }

  calcAVGSpeed(a: number) {
    const { l, j, k } = this
    let b = (l * j * a + k * (1 - j) * a) / (k * l * 20)
    b = Math.max(Math.abs(b), 2.5) * Math.sign(b)
    return b
  }

  getCurSpeed(a: number, b: number) {
    const { l, j, k, opt } = this
    return Math.abs(a) > Math.abs(j * b) ? l * opt.speed : k * opt.speed
  }

  calCurve( ctx: CanvasRenderingContext2D, a: number, b: number, c: number, d: number, e: number) {
    ctx.bezierCurveTo(a + e, b, c - e, d, c, d)
  }

  drawHightlight(a: number) {
    const { opt } = this
    const ctx = this.canvas.getContext('2d')!
    const d = 0.3

    //clearRect 在给定的矩形内清除指定的像素,这里清完了
    ctx.clearRect(0, 0, 2 * opt.width, 2 * opt.height)
    ctx.shadowColor = 'rgba(36, 131, 255, 1)'
    ctx.shadowBlur = 5
    ctx.strokeStyle = '#004CB3'
    ctx.lineWidth = 0.8
    ctx.fillStyle = 'none'
    this.draw(ctx, false)

    //这里绘制了外围边框线条
    const e = ctx.createLinearGradient(0, 0, opt.width, opt.height)
    const f = a - d
    e.addColorStop(Math.min(1, Math.max(0, 0 + f)), 'rgba(0,0,0,0)')
    e.addColorStop(Math.min(1, Math.max(0, 0 + f + 0.1)), '#8ed6ff')
    e.addColorStop(Math.min(1, 0 + f + d), '#8ed6ff')
    e.addColorStop(Math.min(1, 0 + f + d + 0.1), 'rgba(0,0,0,0)')
    e.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.lineWidth = 1.5
    ctx.strokeStyle = e
    ctx.fillStyle = this.pattern!
    this.draw(ctx, true)
  }

  startDraw(a: number) {
    this.drawHightlight(a)

    this.opt.timer = requestAnimationFrame(() => {
      this.startDraw((a + 0.005) % 1.6)
    })
  }

  draw(ctx: CanvasRenderingContext2D, trueorfalse: boolean) {
    const { opt, tabWidthList, tabHeight  } = this
    const navindex = opt.currentIndex
    const tableHeight = tabHeight
    const f = 0,
      g = 40,
      i = 20,
      j = 0.5,
      k = 2.5
    let l = 0

    ctx.beginPath()
    ctx.moveTo(-50, opt.height + 10)
    ctx.lineTo(-50, tableHeight + j)

    if (opt.animating) {
      const m = this.getCurSpeed(opt.curDisX, opt.distance)
      l = Math.min(Math.abs(opt.distance), Math.abs(opt.curDisX + m)) * Math.sign(m)
    }

    ctx.lineTo(f + tabWidthList[navindex] + l - g / 2, tableHeight + j)
    this.calCurve(
      ctx,
      f + tabWidthList[navindex] + l - g / 2,
      tableHeight + j,
      f + tabWidthList[navindex] + l + g / 2,
      k + j,
      i,
    )

    if (opt.animating) {
      const o = tabWidthList[opt.nextIndex + 1] - tabWidthList[opt.nextIndex]
      ctx.lineTo(f + tabWidthList[navindex] + o + l - g / 2, k + j)
      this.calCurve(
        ctx,
        f + tabWidthList[navindex] + o + l - g / 2, k + j,
        f + tabWidthList[navindex] + o + l + g / 2,
        tableHeight + j,
        i,
      )
    } else {
      //lineTo 添加一个新点 宽度长度
      ctx.lineTo(f + tabWidthList[navindex + 1] + l - g / 2, k + j)
      this.calCurve(
        ctx,
        f + tabWidthList[navindex + 1] + l - g / 2, k + j,
        f + tabWidthList[navindex + 1] + l + g / 2,
        tableHeight + j,
        i,
      )
    }

    ctx.lineTo(opt.width + 10, tableHeight + j)
    ctx.lineTo(opt.width + 10, opt.height + 10)
    ctx.closePath()
    ctx.stroke()

    if (trueorfalse) {
      ctx.fill()
    }

    if (trueorfalse && opt.animating) {
      opt.curDisX = l
      if (Math.abs(l) >= Math.abs(opt.distance)) {
        opt.animating = false
        opt.currentIndex = opt.nextIndex
      }
    }
  }

  public toggle(navindex: number) {
    const { opt, tabWidthList } = this
    if (navindex !== opt.currentIndex
      && tabWidthList
      && tabWidthList.length
      && (!opt.animating || navindex !== opt.nextIndex)) {
      opt.animating = true
      opt.distance = tabWidthList[navindex] - tabWidthList[opt.currentIndex]
      opt.speed = this.calcAVGSpeed(opt.distance)
      opt.curDisX = 0
      opt.nextIndex = navindex
    }
  }

  resize() {
    const { opt } = this
    if (opt.timer) {
      cancelAnimationFrame(opt.timer)
    }
    this.calcTabs()
    this.initCanvas(this.canvas, opt.width, opt.height)
    this.startDraw(0)
  }
}
