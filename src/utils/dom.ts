import { isObject, trim, camelCase } from 'lodash-es'

export const on = function(
  element: HTMLElement | Document | Window,
  event: string,
  handler: any, // EventListenerOrEventListenerObject
  useCapture = false,
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, useCapture)
  }
}

export const off = function(
  element: HTMLElement | Document | Window,
  event: string,
  handler: any, // EventListenerOrEventListenerObject
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}

export const once = function(
  element: HTMLElement | Document | Window,
  event: string,
  handler: any,
): void {
  const func = (ev: Event) => {
    handler(ev)
    off(element, event, func)
  }
  on(element, event, func)
}


export function hasClass(el: HTMLElement, cls: string): boolean {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1)
    throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (` ${el.className} `).indexOf(` ${cls} `) > -1
  }
}

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
      curClass += ` ${clsName}`
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export function removeClass(el: HTMLElement, cls: string): void {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ` ${el.className} `

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}


// Here I want to use the type CSSStyleDeclaration, but the definition for CSSStyleDeclaration
// has { [index: number]: string } in its type annotation, which does not satisfy the method
// camelCase(s: string)
// Same as the return type
export const getStyle = function(
  element: HTMLElement,
  styleName: string,
): string {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const style = element.style[styleName]
    if (style) return style
    const computed = document.defaultView.getComputedStyle(element, '')
    return computed ? computed[styleName] : ''
  } catch (e) {
    return element.style[styleName]
  }
}

export function setStyle(
  element: HTMLElement,
  styleName: CSSStyleDeclaration | string,
  value?: string,
): void {
  if (!element || !styleName) return

  if (isObject(styleName)) {
    Object.keys(styleName).forEach(prop => {
      setStyle(element, prop, styleName[prop])
    })
  } else {
    styleName = camelCase(styleName)
    element.style[styleName] = value
  }
}

export function removeStyle(element: HTMLElement, style: CSSStyleDeclaration | string) {
  if (!element || !style) return

  if (isObject(style)) {
    Object.keys(style).forEach(prop => {
      setStyle(element, prop, '')
    })
  } else {
    setStyle(element, style, '')
  }
}
