import { generateId, isString } from '@/utils/util'
import { FilterConfig } from '@/components/data-filter'

export enum ApiType {
  /**
   * 静态数据
   */
  static = 'static',
  /**
   * api
   */
  api = 'api',
}

export enum ApiStatus {
  loading = 'loading',
  success = 'success',
  failed = 'failed',
  completed='completed',
  incomplete='incomplete'
}

export enum FieldStatus {
  loading = 'loading',
  success = 'success',
  failed = 'failed',
  optional = 'optional',
}

export enum ApiRequestMethod {
  GET = 'GET',
  POST = 'POST',
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
  api: Partial<ApiConfigMap>,
  name: K,
  options: Partial<ApiConfigMap[K]>,
) {
  if (name === 'source') {
    api.source = {
      fields: {},
      render: 'render',
      description: '',
      useAutoUpdate: false,
      autoUpdate: 1,
      ...options,
    }
  }

  return api as ApiConfigMap
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
    useFilter: boolean
    data: string
    api?: string
    apiMethod?: ApiRequestMethod
    apiHeaders?: string
    apiBody?: string
    local?: boolean
    cookie?: boolean
  }
  pageFilters: FilterConfig[] // 放在外面方便 watch
}

export interface ApiDataConfigMap {
  source: ApiDataConfig
}

/**
 * 设置源数据
 */
export function setApiData<K extends keyof ApiDataConfigMap>(
  comId: string,
  api: Partial<ApiDataConfigMap>,
  name: K,
  data: any,
  type = ApiType.static,
) {
  if (name === 'source') {
    api.source = {
      id: generateId(),
      comId,
      type,
      pageFilters: [],
      config: {
        useFilter: false,
        ...castDataBySourceType(type, data),
      },
    }
  }

  return api as ApiDataConfigMap
}

export function createApiData(data?: any) {
  return {
    api: '',
    apiMethod: ApiRequestMethod.GET,
    apiHeaders: '{}',
    apiBody: '{}',
    cookie: false,
    local: false,
    ...(data ?? {}),
  }
}

/**
 * 通过数据源类型转换数据
 */
function castDataBySourceType(type: ApiType, data: any) {
  const ret: ApiDataConfig['config'] = Object.create(null)
  switch (type) {
    case ApiType.static:
      ret.data = isString(data) ? data : JSON.stringify(data)
      break
    case ApiType.api:
      return createApiData(data)
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
