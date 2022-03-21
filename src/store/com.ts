import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { ComType, DatavComponent } from '@/components/_models/datav-component'
import { getComs, deleteCom, addCom, copyCom } from '@/api/coms'
import { generateId } from '@/utils/util'

export interface IComState {
  coms: DatavComponent[]
  subComs: DatavComponent[]
}

export const findComIndex = (coms: DatavComponent[], id: string) => {
  return coms.findIndex(c => c.id === id)
}

const findCom = (coms: DatavComponent[], id: string) => {
  return coms.find(c => c.id === id)
}

const findComs = (coms: DatavComponent[], parentId?: string) => {
  return coms.filter(c => c.parentId === parentId)
}

export const useComStore = defineStore('com', {
  state: (): IComState => ({
    coms: [],
    subComs: [],
  }),
  getters: {
    selectedCom(state) {
      return state.coms.find(m => m.selected)
    },
  },
  actions: {
    selectCom(id: string) {
      this.coms.forEach(com => {
        if (com.id === id) {
          com.selected = true
        } else {
          com.selected = false
        }
        com.hovered = false
      })
    },
    setComs(payload: DatavComponent[]) {
      const coms: DatavComponent[] = []
      const subComs: DatavComponent[] = []
      payload.forEach(c => {
        if (c.type === ComType.com) {
          coms.push(c)
        } else if (c.type === ComType.subCom) {
          subComs.push(c)
        }
      })

      this.coms = coms
      this.subComs = subComs
    },
    async loadComs(projectId: number) {
      try {
        const res = await getComs(projectId)
        if (res.data.code === 0) {
          this.setComs(res.data.data)
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async deleteCom(com: DatavComponent) {
      try {
        const res = await deleteCom(com.id)
        if (res.data.code === 0) {
          if (com.type === ComType.com) {
            this.coms.splice(findComIndex(this.coms, com.id), 1)
          } else {
            this.subComs.splice(findComIndex(this.subComs, com.id), 1)
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async addCom(com: DatavComponent) {
      try {
        const res = await addCom(com)
        if (res.data.code === 0) {
          this.coms.push(com)
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async copyCom(id: string) {
      try {
        const res = await copyCom(id)
        if (res.data.code === 0) {
          // 模拟后端复制
          const getNewCom = (com: DatavComponent, parentId?: string) => {
            const ncom = cloneDeep(com)
            ncom.id = generateId(ncom.name)
            ncom.alias += '_copy'
            ncom.attr.x += 30
            ncom.attr.y += 30

            ncom.hovered = false
            ncom.selected = false
            ncom.renameing = false

            ncom.parentId = parentId

            for (const key in ncom.apiData) {
              ncom.apiData[key].id = generateId()
              ncom.apiData[key].comId = ncom.id
            }

            return ncom
          }

          const ocom = findCom(this.coms, id)
          if (ocom) {
            const ncom = getNewCom(ocom)
            const nSubComs = findComs(this.subComs, ocom.id).map(m => getNewCom(m, ncom.id))
            this.coms.push(ncom)
            this.subComs.push(...nSubComs)
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
  },
})
