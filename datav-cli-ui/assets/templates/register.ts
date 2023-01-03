import Handlebars from 'handlebars'
import { plainText as propConfigTpl } from './partials/prop-config-tpl.hbs'
import { plainText as propComponentTpl } from './partials/prop-component-tpl.hbs'
import { plainText as propDataTpl } from './partials/prop-data-tpl.hbs'

// ------Helpers------
// https://github.com/helpers/handlebars-helpers

Handlebars.registerHelper('eq', (a, b) => a === b)
Handlebars.registerHelper('neq', (a, b) => a !== b)
Handlebars.registerHelper('and', (a, b) => a && b)
Handlebars.registerHelper('or', (a, b) => a || b)
Handlebars.registerHelper('not', val => !val)
Handlebars.registerHelper('getPath', (path, vpath) => (vpath ? vpath : `config.${path}`))
Handlebars.registerHelper('capitalize', str => (str.charAt(0).toUpperCase() + str.slice(1)))
Handlebars.registerHelper('includes', (arr, val) => arr.includes(val))
Handlebars.registerHelper('hasSelectOpts', (arr, val) => arr.includes(`${val}s`))
Handlebars.registerHelper('enumsToTpl', (arr: string[]) => {
  let str = '['
  arr.forEach((item, i) => {
    str += `'${item}'`

    if (i !== arr.length - 1) {
      str += ', '
    }
  })
  return `${str}]`
})
Handlebars.registerHelper('pairsToTpl', (arr: { key: string; value: string; }[]) => {
  let str = '['
  arr.forEach((item, i) => {
    str += `{ key: '${item.key}', value: '${item.value}' }`

    if (i !== arr.length - 1) {
      str += ', '
    }
  })
  return `${str}]`
})
Handlebars.registerHelper('pairToTpl', (pair: { key: string; value: string; }) => {
  return `{ key: '${pair.key}', value: '${pair.value}' }`
})
Handlebars.registerHelper('getSlotPath', (path: string, vpath: string) => {
  const str = vpath ? vpath : `config.${path}`
  return str.substring(0, str.lastIndexOf('.'))
})
Handlebars.registerHelper('goBack', (path: string, level = 1) => {
  if (path) {
    const maxLv = path.split('.').length - 1
    const lv = Math.min(maxLv, Math.max(1, level || 1))
    let str = path
    for (let i = 0; i < lv; i++) {
      str = str.substring(0, str.lastIndexOf('.'))
    }
    return str
  }

  return path
})
Handlebars.registerHelper('getInlineMode', val => {
  if (val === 'inline' || val === 'inline-single') {
    return val
  }

  return false
})
Handlebars.registerHelper('isTypeOf', (configList, key, type) => {
  const item = configList.find(m => m.key === key)
  return item ? item.config.type === type : false
})
Handlebars.registerHelper('isEmptyArray', (arr: any[]) => !arr || arr.length === 0)

// ------Partials------
Handlebars.registerPartial('prop-config-tpl', propConfigTpl)
Handlebars.registerPartial('prop-component-tpl', propComponentTpl)
Handlebars.registerPartial('prop-data-tpl', propDataTpl)

