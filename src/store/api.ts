import { defineStore } from 'pinia'
import { set } from 'lodash-es'
import {
  ApiKeyName, ApiConfig, ApiDataConfig,
  ApiType, ApiRequestMethod,
} from '@/components/_models/data-source'
import { isUrl, toJson, replaceTextParams } from '@/utils/util'
import requestUtil from '@/components/_utils/request-util'
import { useEventStore } from './event'

export interface IApiState {
  dataMap: {
    [k: string]: {
      [k in ApiKeyName]?: any
    }
  }
}

export const useApiStore = defineStore('api', {
  state: (): IApiState => ({
    dataMap: {},
  }),
  actions: {
    async setData(comId: string, apiKey: ApiKeyName, data: any) {
      set(this.dataMap, `${comId}.${apiKey}`, data)
    },
    async requestData(comId: string, aConfig: ApiConfig, adConfig: ApiDataConfig) {
      const eventStore = useEventStore()
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

          const url = replaceTextParams(config.api, eventStore.variables)
          if (config.apiMethod === ApiRequestMethod.GET) {
            res = await requestUtil.get(url, conf)
          } else {
            res = await requestUtil.post(url, toJson(config.apiBody, {}), conf)
          }
        } catch {
          throw Error('connectFailed')
        }
      }

      return toJson(res, [])
    },
  },
})
