import { generateId, isString } from '@/utils/util'
import { FilterConfig } from '@/components/data-filter'
import { FieldConfig } from '@/components/data-field'

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

export type ApiKeyName = keyof ApiConfigMap

/**
 * 设置数据接口配置
 */
export function setApiConfig<K extends ApiKeyName>(
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
  pageFilters: FilterConfig[]
}

export interface ApiDataConfigMap {
  source: ApiDataConfig
}

/**
 * 设置源数据
 */
export function setApiData<K extends ApiKeyName>(
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
        data: '',
      },
    }
    castDataBySourceType(type, api.source.config, data)
  }

  return api as ApiDataConfigMap
}

export function createDataConfigForApi(config: ApiDataConfig['config']) {
  if (config.api === undefined) {
    Object.assign(config, {
      api: '',
      apiMethod: ApiRequestMethod.GET,
      apiHeaders: '{}',
      apiBody: '{}',
      cookie: false,
      local: false,
    })
  }
}

/**
 * 通过数据源类型转换数据
 */
function castDataBySourceType(type: ApiType, config: ApiDataConfig['config'], data: any) {
  switch (type) {
    case ApiType.static:
      config.data = isString(data) ? data : JSON.stringify(data)
      break
    case ApiType.api:
      createDataConfigForApi(config)
      break
    default:
      throw Error(`Unknown ApiType: ${type}`)
  }
}

export function createDataSources() {
  return {
    [ApiType.static]: '静态数据',
    [ApiType.api]: 'API',
  }
}
