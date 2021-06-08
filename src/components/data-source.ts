import { ApiType } from '@/utils/enums/data-source'
import { generateId, isString } from '@/utils/util'

export enum FieldStatus {
  loading = 'loading',
  success = 'success',
  failed = 'failed',
  optional = 'optional',
}

export interface FieldConfig {
  type: string
  description: string
  optional?: boolean
  map?: string
}

export interface ApiConfig {
  fields: Record<string, FieldConfig>
  /**
   * 执行指定的渲染函数，默认值是 render
   */
  render: string
  description: string
  config: {
    useFilter: boolean
    pageFilters: any[]
  }
  useAutoUpdate: boolean
  autoUpdate: number
}

export interface ApiConfigMap {
  source: ApiConfig
}

/**
 * 设置数据接口配置
 */
export function setApiConfig<K extends keyof ApiConfigMap>(
  api: ApiConfigMap,
  name: K,
  options: Partial<ApiConfigMap[K]>,
) {
  if (name === 'source') {
    api.source = {
      fields: {},
      render: 'render',
      description: '',
      config: {
        useFilter: false,
        pageFilters: [],
      },
      useAutoUpdate: false,
      autoUpdate: 1,
      ...options,
    }
  }

  return api
}

/**
 * 创建字段
 */
export function createField(name: string, config?: Partial<FieldConfig>) {
  return {
    [name]: {
      type: 'string',
      map: '',
      description: '',
      optional: false,
      ...(config || {}),
    },
  }
}

export interface ApiDataConfig {
  id: string
  comId: string
  type: ApiType
  config: {
    local: boolean
    cookie: boolean
  } & Record<string, any>
}

export interface ApiDataConfigMap {
  source: ApiDataConfig
}

/**
 * 设置源数据
 */
export function setApiData<K extends keyof ApiDataConfigMap>(
  comId: string,
  api: ApiDataConfigMap,
  name: K,
  data: any,
  type = ApiType.static,
) {
  if (name === 'source') {
    api.source = {
      id: generateId(),
      comId,
      type,
      config: {
        local: true,
        cookie: false,
        ...castDataBySourceType(type, data),
      },
    }
  }

  return api
}

/**
 * 通过数据源类型转换数据
 */
export function castDataBySourceType(type: ApiType, data: any) {
  const ret: Record<string, any> = Object.create(null)
  switch (type) {
    case ApiType.static:
      ret.data = isString(data) ? data : JSON.stringify(data)
      break
    case ApiType.api:
      ret.api = data
      break
    default:
      throw Error(`Unknown ApiType: ${type}`)
  }

  return ret
}

export function createDataSources() {
  return {
    [ApiType.static]: '静态数据',
    [ApiType.api]: 'API',
  }
}
