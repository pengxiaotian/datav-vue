import getScroll from './get-scroll'

export const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))

export function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b
  t /= d / 2
  if (t < 1) {
    return (cc / 2) * t * t * t + b
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b
}

interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window
  /** Scroll end callback */
  callback?: () => any
  /** Animation duration, default as 450 */
  duration?: number
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
