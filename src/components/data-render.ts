import set from 'lodash/set'
import { isPlainObject, isArray } from '@/utils/util'
import { FieldConfig } from './data-source'

const getMapData = (data: any, fields: [string, FieldConfig][]) => {
  const has = Object.prototype.hasOwnProperty
  const obj = Object.create(null)
  for (const [key, fc] of fields) {
    const fieldName = fc.map || key
    if (has.call(data, fieldName)) {
      set(obj, fc.path || key, data[fieldName])
    }
  }

  return obj
}

export const getRenderData = (data: any, fields: Record<string, FieldConfig>) => {
  if (isPlainObject(data)) {
    return getMapData(data, Object.entries(fields))
  }

  if (isArray(data)) {
    const list = Object.entries(fields)
    return data.reduce((prev, curr) => {
      prev.push(getMapData(curr, list))
      return prev
    }, [])
  }

  throw Error('Data must be an array or an object.')
}
