import { defineStore } from 'pinia'
import { BlueprintEvent, BlueprintEventType } from '@/domains/blueprint'


export interface IBlueprintState {
  flows: any[]
  events: {
    [k in string]?: BlueprintEvent
  }
}

export const useBlueprintStore = defineStore('blueprint', {
  state: (): IBlueprintState => ({
    flows: [],
    events: {},
  }),
  actions: {
    async setFlows(payload: any[]) {
      this.flows = payload
    },
    async onApiRequestCompleted() {
      // TODO: some code
    },
    setEvent<T extends BlueprintEventType>(comId: string, key: T, value: BlueprintEvent[T]) {
      if (this.events[comId]) {
        this.events[comId][key] = value
      } else {
        this.events[comId] = {
          [key]: value,
        }
      }
    },
    deleteEvent<T extends BlueprintEventType>(comId: string, key: T) {
      if (this.events[comId]) {
        this.events[comId][key] = null
      }
    },
    clearEvent(comId: string) {
      if (this.events[comId]) {
        this.events[comId] = null
      }
    },
  },
})
