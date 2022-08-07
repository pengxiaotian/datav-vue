import { generateId } from '@/utils/util'
import { capitalize } from '@/utils/string-util'
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
   * 执行指定的处理函数，默认值是 render
   */
  handler: string
  description: string
  useAutoUpdate: boolean
  autoUpdate: number
}

export interface ApiConfigMap {
  source: ApiConfig
  [key: string]: ApiConfig
}

export type ApiKeyName = keyof ApiConfigMap

export interface ApiDataConfig {
  id: string
  comId: string
  type: ApiType
  config: {
    useFilter?: boolean
    data?: string
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
  [key: string]: ApiDataConfig
}

/**
 * 初始化数据接口配置
 */
export function initApiConfig(options: Partial<ApiConfig>) {
  const config: Partial<ApiConfigMap> = {
    source: {
      fields: {},
      handler: 'render',
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

/**
 * 设置数据接口配置
 */
export function setApiConfig(config: Partial<ApiConfigMap>, options: Partial<ApiConfig>, name: ApiKeyName = 'source') {
  if (!config) {
    config = {}
  }
  config[name] = {
    fields: {},
    description: '',
    useAutoUpdate: false,
    autoUpdate: 1,
    ...options,
    handler: name === 'source' ? 'render' : `set${capitalize(name as string)}`,
  }
}

/**
 * 设置源数据
 */
export function setApiData(config: Partial<ApiDataConfigMap>, comId: string, options: Partial<ApiDataConfig>, name: ApiKeyName = 'source') {
  if (!config) {
    config = {}
  }
  config[name] = {
    id: generateId(),
    type: ApiType.static,
    pageFilters: [],
    config: {
      useFilter: false,
      data: '',
    },
    ...options,
    comId,
  }
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
