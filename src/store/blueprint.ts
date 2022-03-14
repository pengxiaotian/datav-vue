import { defineStore } from 'pinia'
import { DataVComponentInternalInstance } from '@/typings/datav'

export interface IBlueprintState {
  flows: any[]
  datavComponents: Record<string, DataVComponentInternalInstance>
}

export const useBlueprintStore = defineStore('blueprint', {
  state: (): IBlueprintState => ({
    flows: [],
    datavComponents: {},
  }),
  actions: {
    setDatavComponentInstance(key: string, ins: DataVComponentInternalInstance) {
      this.datavComponents[key] = ins
    },
    removeDatavComponent(key: string) {
      delete this.datavComponents[key]
    },
    async setFlows(payload: any[]) {
      this.flows = payload
    },
    async onApiRequestCompleted() {
      // TODO: some code
    },
  },
})
