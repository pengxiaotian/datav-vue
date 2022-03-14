import { defineStore } from 'pinia'
import { ApiKeyName, FieldStatus } from '@/components/data-source'


type ApiData = Partial<Record<ApiKeyName, any>>

export type ApiDataStatus = Partial<Record<ApiKeyName, any>>

export type ApiFieldStatus = Partial<Record<ApiKeyName, Record<string, FieldStatus>>>

export interface IDebugState {
  debug: boolean
  originMap: Record<string, ApiData>
  dataStatusMap: Record<string, ApiDataStatus>
  fieldStatusMap: Record<string, ApiFieldStatus>
}

export const useDebugStore = defineStore('debug', {
  state: (): IDebugState => ({
    debug: false,
    originMap: {},
    dataStatusMap: {},
    fieldStatusMap: {},
  }),
  actions: {
    enableDebug() {
      this.debug = true
    },
    stopDebug() {
      this.debug = false
    },
    async setOrigin(comId: string, data: ApiData) {
      if (this.debug) {
        for (const [keyName, value] of Object.entries(data)) {
          if (this.originMap[comId]) {
            this.originMap[comId][keyName] = value
          } else {
            this.originMap[comId] = { [keyName]: value }
          }
        }
      }
    },
    async setDataStatus(comId: string, data: ApiDataStatus) {
      if (this.debug) {
        for (const [keyName, value] of Object.entries(data)) {
          if (this.dataStatusMap[comId]) {
            this.dataStatusMap[comId][keyName] = value
          } else {
            this.dataStatusMap[comId] = { [keyName]: value }
          }
        }
      }
    },
    async setFieldStatus(comId: string, fields: ApiFieldStatus) {
      if (this.debug) {
        for (const [keyName, value] of Object.entries(fields)) {
          if (this.fieldStatusMap[comId]) {
            this.fieldStatusMap[comId][keyName] = value
          } else {
            this.fieldStatusMap[comId] = { [keyName]: value }
          }
        }
      }
    },
  },
})
