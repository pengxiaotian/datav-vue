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

export function toObject<T>(arr: Array<T>): Record<string, T> {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
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

export const isBool = (val: unknown) => typeof val === 'boolean'
export const isNumber = (val: unknown) => typeof val === 'number'
export const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML')

/**
 * Generating a random int in range (0, max - 1)
 * @param max {number}
 */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

export function isUndefined(val: any): val is undefined {
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
