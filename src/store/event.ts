import { defineStore } from 'pinia'
import { PageVariable } from '@/domains/editor'
import { getTextParams } from '@/utils/util'
import { useBlueprintStore } from '@/store/blueprint'

export interface IEventState {
  componentsView: PageVariable['componentsView']
  publishersView: PageVariable['publishersView']
  subscribersView: PageVariable['subscribersView']
  variables: Record<string, any>
}

export const useEventStore = defineStore('event', {
  state: (): IEventState => ({
    componentsView: {},
    publishersView: {},
    subscribersView: {},
    variables: {},
  }),
  actions: {
    setPublishersView(id: string, keys: string[], enable: boolean) {
      const pv = this.publishersView
      const pvkeys = Object.keys(pv)
      const allKeys = new Set([...keys, ...pvkeys])
      allKeys.forEach(key => {
        if (enable) {
          if (!pvkeys.includes(key)) {
            pv[key] = [id]
          } else if (!pv[key].includes(id)) {
            pv[key].push(id)
          } else if (!keys.includes(key)) {
            pv[key] = pv[key].filter(m => m !== id)
          }
        } else {
          if (pvkeys.includes(key)) {
            pv[key] = pv[key].filter(m => m !== id)
          }
        }

        if (pv[key].length === 0) {
          delete pv[key]
        }
      })
    },
    setSubscribersView(id: string, data: string) {
      const sv = this.subscribersView
      const keys = getTextParams(data).map(m => m.substring(1))
      const svkeys = Object.keys(sv)
      const allKeys = new Set([...keys, ...svkeys])
      for (const key of allKeys) {
        if (keys.length > 0) {
          if (!svkeys.includes(key)) {
            sv[key] = [id]
          } else if (!sv[key].includes(id)) {
            sv[key].push(id)
          } else if (!keys.includes(key)) {
            sv[key] = sv[key].filter(m => m !== id)
          }
        } else {
          if (svkeys.includes(key)) {
            sv[key] = sv[key].filter(m => m !== id)
          }
        }

        if (sv[key].length === 0) {
          delete sv[key]
        }
      }
    },
    async setVariables(fields: Record<string, string>, data: Record<string, any>) {
      const res = Object.create(null)
      for (const key of Object.keys(fields)) {
        const alias = fields[key] || key
        res[alias] = data[key]
      }

      this.variables = {
        ...this.variables,
        ...res,
      }
    },
    // 订阅的变量发生变化时刷新
    handleSubVariablesChange(comId: string, eventName: string, data: Record<string, any>) {
      const eventItem = this.componentsView[comId]?.[eventName]
      if (!eventItem || !eventItem.enable) {
        return
      }

      this.setVariables(eventItem.fields, data)

      const blueprintStore = useBlueprintStore()
      const sv = this.subscribersView
      for (const fname of Object.keys(eventItem.fields)) {
        const key = eventItem.fields[fname] || fname
        sv[key]?.forEach(comId => {
          blueprintStore.events[comId]?.requestData()
        })
      }
    },
  },
})
