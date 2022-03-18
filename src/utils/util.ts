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
 * Generate shortId
 */
export const generateId = (prefix?: string) => {
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

export const isIE = () => !isNaN(Number(document.DOCUMENT_NODE))
export const isEdge = () => navigator.userAgent.indexOf('Edge') > -1
export const isFirefox = () => !!window.navigator.userAgent.match(/firefox/i)
export const isMac = () => /macintosh|mac os x/i.test(navigator.userAgent)

export const isBool = (val: unknown) => typeof val === 'boolean'
export const isNumber = (val: unknown) => typeof val === 'number'
export const isUndefined = (val: unknown) => val === void 0
export const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML')

export const isUrl = (val: string) => /^[a-zA-z]+:\/\/[^\s]*$/.test(val)

export function deduplicate<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

export function toObject<T>(arr: Array<T>) {
  const res: Record<string, T> = Object.create(null)
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export function ArrayToObject<T extends string | Object>(arr: Array<T>, key?: string, value?: string) {
  const map: Record<string, string> = Object.create(null)
  if (key && value) {
    return arr.reduce((prev, curr) => {
      prev[curr[key]] = curr[value]
      return prev
    }, map)
  }

  return (arr as string[]).reduce((prev, curr) => {
    prev[curr] = curr
    return prev
  }, map)
}

export function toJson<T>(data: any, defaultValue: T) {
  try {
    if (!data) {
      return defaultValue
    }

    if (isString(data)) {
      return JSON.parse(data)
    }

    return data
  } catch {
    return defaultValue
  }
}

export const copyText = async (text: string) => {
  try {
    if (navigator && 'clipboard' in navigator) {
      await navigator.clipboard.writeText(text)
    } else {
      const input = document.createElement('textarea')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    return true
  } catch (error) {
    return false
  }
}

/**
 * 获取字符串中 :value 形式的参数
 */
export const getTextParams = (text: string) => {
  const reg = /:([\d\w\u4e00-\u9fa5_$@*]+)/ig
  return text.match(reg) ?? []
}

/**
 * 替换字符串中 :value 形式的参数
 */
export const replaceTextParams = (text: string, data: Record<string, string>) => {
  if (Object.keys(data).length === 0) {
    return text
  }
  const reg = /:([\d\w\u4e00-\u9fa5_$@*]+)/ig
  return text.replace(reg, (key: string) => {
    return data[key.substring(1)] ?? key
  })
}

/**
 * 简单计算字符串长度
 */
export const calcStrLen = (str: string) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
      len += 2
    } else {
      len ++
    }
  }
  return len
}

/**
 * 简单计算字符串宽度
 */
let TextCanvas: HTMLCanvasElement | null = null
export const calcStrWidth = (str: string, font: string) => {
  if (!TextCanvas) {
    TextCanvas = document.createElement('canvas')
  }
  const ctx = TextCanvas.getContext('2d')
  ctx.font = font
  ctx.font
  return ctx.measureText(str).width
}
