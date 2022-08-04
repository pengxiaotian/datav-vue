import { isString } from 'lodash-es'

// 记忆函数：缓存函数的运算结果
const cacheStringFunction = (fn: Function) => {
  const cache = Object.create(null)
  return ((str: string): string => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}

const camelizeRE = /-(\w)/g
/**
 * 横线转驼峰命名
 * ab-cd-ef ==> abCdEf
 */
export const camelize = cacheStringFunction((str: string) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

const hyphenateRE = /\B([A-Z])/g
/**
 * 拆分字符串，使用 - 相连，并且转换为小写
 *
 * abCd ==> ab-cd
 */
export const hyphenate = cacheStringFunction((str: string) => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * 字符串首位大写
 *
 * abc ==> Abc
 */
export const capitalize = cacheStringFunction((str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

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
 */
export const pascalCase = (str: string) => {
  if (!isString(str)) return ''
  str = changeCase(str, (ch: string) => {
    return ch.toUpperCase()
  })
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
