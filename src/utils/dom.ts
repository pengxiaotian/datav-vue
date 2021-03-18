/* istanbul ignore next */
const trim = function(s: string) {
  return (s || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/* istanbul ignore next */
export const on = function(
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false,
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, useCapture)
  }
}

/* istanbul ignore next */
export const off = function(
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}

/* istanbul ignore next */
export function hasClass(el: HTMLElement, cls: string): boolean {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1)
    throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export function addClass(el: HTMLElement, cls: string): void {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass(el: HTMLElement, cls: string): void {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export const getOffsetTop = (el: HTMLElement) => {
  let offset = 0
  let parent = el

  while (parent) {
    offset += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }

  return offset
}

export const stop = (e: Event) => e.stopPropagation()
