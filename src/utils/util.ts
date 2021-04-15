import {
  isObject,
  isArray,
  isString,
  capitalize,
  hyphenate,
  looseEqual,
  extend,
  camelize,
  hasOwn,
  toRawType,
} from '@vue/shared'
import shortid from 'shortid'
import { ZoomMode } from '@/domains/enums/com-enums'

export const kebabCase = hyphenate

export {
  hasOwn,
  isObject,
  isArray,
  isString,
  capitalize,
  camelize,
  looseEqual,
  extend,
}

/**
 * Generate random number in range [0, 1000]
 * Maybe replace with [uuid](https://www.npmjs.com/package/uuid)
 */
export const generateId = (): number => Math.floor(Math.random() * 10000)

export const generateShortId = (prefix?: string) => {
  const id = shortid.generate()
  return prefix ? `${prefix}_${id}` : id
}

/**
 * Generating a random int in range (0, max - 1)
 * @param max {number}
 */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

export const isIE = function(): boolean {
  return !isNaN(Number(document.DOCUMENT_NODE))
}

export const isEdge = function(): boolean {
  return navigator.userAgent.indexOf('Edge') > -1
}

export const isFirefox = function(): boolean {
  return !!window.navigator.userAgent.match(/firefox/i)
}

export const isMac = () => {
  return /macintosh|mac os x/i.test(navigator.userAgent)
}

export const isBool = (val: unknown) => typeof val === 'boolean'
export const isNumber = (val: unknown) => typeof val === 'number'
export const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML')

export function isUndefined(val: any) {
  return val === void 0
}

export function isEmpty(val: unknown) {
  if (
    !val && val !== 0 ||
    isArray(val) && !val.length ||
    isObject(val) && !Object.keys(val).length
  ) return true

  return false
}

export function toObject<T>(arr: Array<T>): Record<string, T> {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export function deduplicate<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

export const copyText = (text: string) => {
  try {
    const input = document.createElement('textarea')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    return true
  } catch (error) {
    return false
  }
}

export const calcZoom = (
  mode: ZoomMode,
  width: number,
  height: number,
  boxWidth: number,
  boxHeight: number,
) => {
  const scaleX = boxWidth / width
  const scaleY = boxHeight / height
  let w = width
  let h = height
  let r = 1
  switch (mode) {
    case ZoomMode.auto:
      r = Math.min(scaleX, scaleY)
      if (r < 1) {
        w *= r
        h *= r
      }
      break
    case ZoomMode.width:
      r = scaleX
      w *= r
      h *= r
      break
    case ZoomMode.height:
      r = scaleY
      w *= r
      h *= r
      break
    case ZoomMode.full:
      w = boxWidth
      h = boxHeight
      break
    default:
      break
  }

  return {
    width: w,
    height: h,
    ratio: r,
  }
}
