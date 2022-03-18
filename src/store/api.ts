import { defineStore } from 'pinia'
import { set } from 'lodash-es'
import {
  ApiKeyName, ApiConfig, ApiDataConfig,
  ApiType, ApiRequestMethod,
} from '@/components/_models/data-source'
import { isUrl, toJson, replaceTextParams } from '@/utils/util'
import dcRequest from '@/utils/dc-request'

export interface IApiState {
  dataMap: {
    [k: string]: {
      [k in ApiKeyName]?: any
    }
  }
  variables: Record<string, any>
}

export const useApiStore = defineStore('api', {
  state: (): IApiState => ({
    dataMap: {},
    variables: {},
  }),
  actions: {
    async setData(comId: string, apiKey: ApiKeyName, data: any) {
      set(this.dataMap, `${comId}.${apiKey}`, data)
    },
    async setVariables(fields: Record<string, string>, data: Record<string, any>) {
      const res = {}
      for (const key in fields) {
        const alias = fields[key] || key
        res[alias] = data[key]
      }

      this.variables = {
        ...this.variables,
        ...res,
      }
    },
    async requestData(comId: string, aConfig: ApiConfig, adConfig: ApiDataConfig) {
      const { type, config } = adConfig
      let res: unknown
      if (type === ApiType.static) {
        res = config.data
      } else if (type === ApiType.api) {
        if (!config.api) {
          return []
        }

        if (!isUrl(config.api)) {
          throw Error('url must contains protocol field, like http:')
        }

        try {
          const conf = {
            headers: toJson(config.apiHeaders, {}),
            withCredentials: config.cookie,
          }

          const url = replaceTextParams(config.api, this.variables)
          if (config.apiMethod === ApiRequestMethod.GET) {
            res = await dcRequest.get(url, conf)
          } else {
            res = await dcRequest.post(url, toJson(config.apiBody, {}), conf)
          }
        } catch {
          throw Error('connectFailed')
        }
      }

      return toJson(res, [])
    },
  },
})
