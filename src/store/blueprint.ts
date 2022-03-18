import { defineStore } from 'pinia'
import type { ComponentInternalInstance } from 'vue'

export interface IBlueprintState {
  flows: any[]
  datavComponents: Record<string, ComponentInternalInstance>
}

export const useBlueprintStore = defineStore('blueprint', {
  state: (): IBlueprintState => ({
    flows: [],
    datavComponents: {},
  }),
  actions: {
    setDatavComponentInstance(key: string, ins: ComponentInternalInstance) {
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
