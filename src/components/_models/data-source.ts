import { capitalize } from 'lodash-es'
import { generateId } from '@/utils/util'
import { FilterConfig } from '@/components/_models/data-filter'
import { FieldConfig } from '@/components/_models/data-field'
import { DatavComponent } from './datav-component'

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

// ************************ ApiConfig ************************
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

// ************************ ApiDataConfig ************************
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

export type ApiKeyName = keyof ApiConfigMap

/**
 * 设置数据接口配置
 */
export function setApiConfig(com: DatavComponent, options?: Partial<ApiConfig>, name: ApiKeyName = 'source') {
  if (!com.apis) {
    com.apis = {}
  }
  com.apis[name] = {
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
export function setApiData(com: DatavComponent, options?: Partial<ApiDataConfig>, name: ApiKeyName = 'source') {
  if (!com.apiData) {
    com.apiData = {}
  }
  com.apiData[name] = {
    id: generateId(),
    type: ApiType.static,
    pageFilters: [],
    config: {
      useFilter: false,
      data: '',
    },
    ...options,
    comId: com.id,
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
