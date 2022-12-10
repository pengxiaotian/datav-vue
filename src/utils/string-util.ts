import { isString, camelCase } from 'lodash-es'

/**
 * Remove leading and trailing whitespace and non-word
 * characters from the given string.
 */
export const chop = (str: string) => {
  if (!isString(str)) return ''
  const re = /^[-_.\W\s]+|[-_.\W\s]+$/g
  return str.trim().replace(re, '')
}

/**
 * PascalCase the characters in `string`.
 *
 * ```js
 * {{pascalCase "foo bar baz"}}
 * <!-- results in:  'FooBarBaz' -->
 * ```
 */
export const pascalCase = (str: string) => {
  if (!isString(str)) return ''
  str = camelCase(str)
  return str.charAt(0).toUpperCase() + str.slice(1)
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
