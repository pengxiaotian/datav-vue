import _ from 'lodash'
import { isPlainObject, isArray } from '@/utils/util'
import { FieldConfig, FieldStatus } from './data-source'

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (val: any, key: string) => hasOwnProperty.call(val, key)

const getMapData = (data: any, fields: [string, FieldConfig][]) => {
  const obj = Object.create(null)
  for (const [key, fc] of fields) {
    const fieldName = fc.map || key
    if (hasOwn(data, fieldName)) {
      _.set(obj, key, data[fieldName])
    }
  }

  return obj
}

export const getRenderData = (data: any, fields: Record<string, FieldConfig>) => {
  const fieldList = Object.entries(fields)

  if (isPlainObject(data)) {
    return getMapData(data, fieldList)
  }

  if (isArray(data)) {
    return data.reduce((prev, curr) => {
      prev.push(getMapData(curr, fieldList))
      return prev
    }, [])
  }

  throw Error('Data must be an array or an object.')
}

export const setFieldLoading = (fields: Record<string, FieldConfig>) => {
  return Object.keys(fields)
    .reduce((prev, curr) => {
      prev[curr] = FieldStatus.loading
      return prev
    }, Object.create(null)) as Record<string, FieldStatus>
}

export const checkDataSchema = (data: any, fields: Record<string, FieldConfig>) => {
  let _data = null
  if (isPlainObject(data)) {
    _data = data
  } else if (isArray(data)) {
    _data = data[0]
  }

  return Object.entries(fields)
    .reduce((prev, [key, fc]) => {
      if (_data && hasOwn(_data, fc.map || key)) {
        prev[key] = FieldStatus.success
      } else if (fc.optional) {
        prev[key] = FieldStatus.optional
      } else {
        prev[key] = FieldStatus.failed
      }
      return prev
    }, Object.create(null)) as Record<string, FieldStatus>
}
