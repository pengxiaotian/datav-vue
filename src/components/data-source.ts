import { DataSourceType } from '@/components/enums/data-source'
import { generateId, isString } from '@/utils/util'

export interface FieldConfig {
  type: string
  description: string
  optional?: boolean
  map?: string
}

export interface DataConfig {
  fields: Record<string, FieldConfig>
  /**
   * 执行指定的渲染函数，默认值是 render
   */
  render: string
  description: string
  dcConfig: {
    useFilter: boolean
    pageFilters: any[]
  }
  useAutoUpdate: boolean
  autoUpdate: number
}

export interface DataConfigMap {
  source: DataConfig
}

/**
 * 设置数据配置
 */
export function setDataConfig<K extends keyof DataConfigMap>(
  data: DataConfigMap,
  name: K,
  config: Partial<DataConfigMap[K]>,
) {
  if (name === 'source') {
    data.source = {
      fields: {},
      render: 'render',
      description: '',
      dcConfig: {
        useFilter: false,
        pageFilters: [],
      },
      useAutoUpdate: false,
      autoUpdate: 1,
      ...config,
    }
  }

  return data
}

/**
 * 创建字段
 */
export function createField(name: string, config?: Partial<FieldConfig>) {
  return {
    [name]: {
      type: 'string',
      description: '',
      optional: false,
      map: '',
      ...(config || {}),
    },
  }
}

export interface SourceConfig {
  id: string
  type: DataSourceType
  comId: string
  config: {
    local: boolean
    cookie: boolean
  } & Record<string, any>
}

export interface SourceConfigMap {
  source: SourceConfig
}

/**
 * 设置源数据
 */
export function setSourceData<K extends keyof SourceConfigMap>(
  comId: string,
  source: SourceConfigMap,
  name: K,
  data: any,
  type = DataSourceType.static,
) {
  if (name === 'source') {
    source.source = {
      id: generateId(),
      type,
      comId,
      config: {
        local: true,
        cookie: false,
        ...castDataBySourceType(type, data),
      },
    }
  }

  return source
}

/**
 * 通过数据源类型转换数据
 */
export function castDataBySourceType(type: DataSourceType, data: any) {
  const ret: Record<string, any> = Object.create({})
  switch (type) {
    case DataSourceType.static:
      ret.data = isString(data) ? data : JSON.stringify(data)
      break
    case DataSourceType.api:
      ret.api = data
      break
    default:
      throw Error(`Unknown type: ${type}`)
  }

  return ret
}
