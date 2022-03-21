import { generateId } from '@/utils/util'
import { FilterConfig } from '@/components/_models/data-filter'
import { FieldConfig } from '@/components/_models/data-field'

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
 * 初始化数据接口配置
 */
export function initApiConfig(options: Partial<ApiConfigMap['source']>) {
  const config: Partial<ApiConfigMap> = {
    source: {
      fields: {},
      render: 'render',
      description: '',
      useAutoUpdate: false,
      autoUpdate: 1,
      ...options,
    },
  }

  return config
}

/**
 * 初始化源数据
 */
export function initApiData(comId: string) {
  const config: Partial<ApiDataConfigMap> = {
    source: {
      comId,
      id: generateId(),
      type: ApiType.static,
      pageFilters: [],
      config: {
        useFilter: false,
        data: '',
      },
    },
  }

  return config
}

export function createDataSources() {
  return {
    [ApiType.static]: '静态数据',
    [ApiType.api]: 'API',
  }
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
