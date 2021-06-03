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
      _.set(obj, fc.path || key, data[fieldName])
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
  for (const key in fields) {
    if (hasOwn(fields, key)) {
      fields[key].status = FieldStatus.loading
    }
  }
}

export const checkDataSchema = (data: any, fields: Record<string, FieldConfig>) => {
  let _data = null
  if (isPlainObject(data)) {
    _data = data
  } else if (isArray(data)) {
    _data = data[0]
  }

  if (_data) {
    for (const key in fields) {
      if (hasOwn(fields, key)) {
        fields[key].status = hasOwn(_data, fields[key].map || key) ? FieldStatus.success : FieldStatus.notfound
      }
    }
  } else {
    for (const key in fields) {
      if (hasOwn(fields, key)) {
        fields[key].status = FieldStatus.notfound
      }
    }
  }
}
