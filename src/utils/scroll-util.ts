import { rAF, easeInOutCubic } from './animation'

interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window
  /** Scroll end callback */
  callback?: () => any
  /** Animation duration, default as 450 */
  duration?: number
}

export function getScroll(target: any, top: Boolean): number {
  if (typeof window === 'undefined') {
    return 0
  }

  const prop = top ? 'pageYOffset' : 'pageXOffset'
  const method = top ? 'scrollTop' : 'scrollLeft'
  const isWindow = target === window

  let ret = isWindow ? target[prop] : target[method]
  // ie6,7,8 standard mode
  if (isWindow && typeof ret !== 'number') {
    ret = window.document.documentElement[method]
  }

  return ret
}

export function scrollToTop(y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options

  const container = getContainer()
  const scrollTop = getScroll(container, true)
  const startTime = Date.now()

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop)
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop
    }
    if (time < duration) {
      rAF(frameFunc)
    } else if (typeof callback === 'function') {
      callback()
    }
  }
  rAF(frameFunc)
}

export function scrollToLeft(x: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options

  const container = getContainer()
  const scrollLeft = getScroll(container, false)
  const startTime = Date.now()

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollLeft = easeInOutCubic(time > duration ? duration : time, scrollLeft, x, duration)
    if (container === window) {
      window.scrollTo(nextScrollLeft, window.pageYOffset)
    } else {
      (container as HTMLElement).scrollLeft = nextScrollLeft
    }
    if (time < duration) {
      rAF(frameFunc)
    } else if (typeof callback === 'function') {
      callback()
    }
  }
  rAF(frameFunc)
}
