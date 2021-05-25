import {
  isObject,
  isPlainObject,
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
import { ZoomMode } from '@/utils/enums/com-enums'

/**
 * Generate shortId
 */
export const generateId = (prefix?: string) => {
  const id = shortid.generate()
  return prefix ? `${prefix}_${id}` : id
}

export {
  isObject,
  isPlainObject,
  isArray,
  isString,
  capitalize,
  looseEqual,
  extend,
  camelize,
  hasOwn,
}

export const kebabCase = hyphenate

/**
 * Remove leading and trailing whitespace and non-word
 * characters from the given string.
 *
 * @param {String} `str`
 * @return {String}
 */
export const chop = (str: string) => {
  if (!isString(str)) return ''
  const re = /^[-_.\W\s]+|[-_.\W\s]+$/g
  return str.trim().replace(re, '')
}

/**
 * Change casing on the given `string`, optionally
 * passing a delimiter to use between words in the
 * returned string.
 *
 * ```js
 * utils.changeCase('fooBarBaz');
 * //=> 'foo bar baz'
 *
 * utils.changeCase('fooBarBaz' '-');
 * //=> 'foo-bar-baz'
 * ```
 * @param {String} `string` The string to change.
 * @return {String}
 * @api public
 */
export const changeCase = (str: string, fn?: (str: string) => string) => {
  if (!isString(str)) return ''
  if (str.length === 1) {
    return str.toLowerCase()
  }

  str = chop(str).toLowerCase()

  const re = /[-_.\W\s]+(\w|$)/g
  return str.replace(re, (_, ch) => {
    return fn ? fn(ch) : ''
  })
}

/**
 * PascalCase the characters in `string`.
 *
 * ```js
 * {{pascalCase "foo bar baz"}}
 * <!-- results in:  'FooBarBaz' -->
 * ```
 * @param {String} `string`
 * @return {String}
 * @api public
 */
export const pascalCase = (str: string) => {
  if (!isString(str)) return ''
  str = changeCase(str, (ch: string) => {
    return ch.toUpperCase()
  })
  return str.charAt(0).toUpperCase() + str.slice(1)
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

export function isUrl(val: string) {
  return /^[a-zA-z]+:\/\/[^\s]*$/.test(val)
}

export function deduplicate<T>(arr: T[]) {
  return Array.from(new Set(arr))
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

export function toJson<T>(data: any, defaultValue: T) {
  try {
    if (isString(data)) {
      return JSON.parse(data)
    }

    return data
  } catch {
    return defaultValue
  }
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
