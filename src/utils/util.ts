import { isString, extend, isEmpty } from 'lodash-es'
import shortid from 'shortid'

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol) => hasOwnProperty.call(val, key)

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
export const isObject = (val: unknown) => Object.prototype.toString.call(val) === '[object Object]'

export const isUrl = (val: string) => /^[a-zA-z]+:\/\/[^\s]*$/.test(val)

export function objToArray(obj) {
  if (Array.isArray(obj)) {
    return obj
  }
  return isEmpty(obj) ? [] : [obj]
}

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

export const macMetaOrCtrl = (ev: MouseEvent | KeyboardEvent) => {
  const ismac = isMac()
  return (!ismac && ev.ctrlKey) || (ismac && ev.metaKey)
}
