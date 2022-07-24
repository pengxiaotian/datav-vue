import { defineStore } from 'pinia'
import { set } from 'lodash-es'
import { ApiKeyName, FieldStatus } from '@/components/_models/data-source'

export type DebugDataType = 'api' | 'filter'

export interface IDebugState {
  debug: boolean
  originMap: {
    [k: string]: {
      [k in ApiKeyName]?: any
    }
  }
  fieldStatusMap: {
    [k: string]: {
      [k in ApiKeyName]?: Record<string, FieldStatus>
    }
  }
  dataStatusMap: {
    [k: string]: {
      [k in ApiKeyName]?: {
        [k in DebugDataType]?: string
      }
    }
  }
}

export const useDebugStore = defineStore('debug', {
  state: (): IDebugState => ({
    debug: false,
    originMap: {},
    fieldStatusMap: {},
    dataStatusMap: {},
  }),
  actions: {
    enable() {
      this.debug = true
    },
    stop() {
      this.debug = false
    },
    async setOrigin(comId: string, apiKey: ApiKeyName, data: any) {
      if (this.debug) {
        set(this.originMap, `${comId}.${apiKey}`, data)
      }
    },
    async setFieldStatus(comId: string, apiKey: ApiKeyName, fields: Record<string, FieldStatus>) {
      if (this.debug) {
        set(this.fieldStatusMap, `${comId}.${apiKey}`, fields)
      }
    },
    async setDataStatus(comId: string, apiKey: ApiKeyName, key: DebugDataType, message: string) {
      if (this.debug) {
        set(this.dataStatusMap, `${comId}.${apiKey}.${key}`, message)
      }
    },
  },
})
