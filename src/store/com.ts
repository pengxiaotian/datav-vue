import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { ComType, DatavComponent } from '@/components/_models/datav-component'
import { Group } from '@/components/_internal/group/src/group'
import { getComs, deleteCom, addCom, copyCom } from '@/api/coms'
import { generateId } from '@/utils/util'
import { MoveType } from '@/domains/editor'

export interface IComState {
  coms: DatavComponent[]
  subComs: DatavComponent[]
}

export const findComIndex = (coms: DatavComponent[], data: string | DatavComponent) => {
  const id = typeof data === 'string' ? data : data.id
  return coms.findIndex(c => c.id === id)
}

const findCom = (coms: DatavComponent[], id: string) => {
  return coms.find(c => c.id === id)
}

const findComs = (coms: DatavComponent[], parentId?: string) => {
  return coms.filter(c => c.parentId === parentId)
}

const confirmSelect = (coms: DatavComponent[], id: string, multiple = false) => {
  coms.forEach(com => {
    com.hovered = false
    if (multiple) {
      if (com.id === id) {
        com.selected = !com.selected
      }
    } else {
      com.selected = com.id === id
    }

    if (com.children) {
      confirmSelect(com.children, id, multiple)
    }
  })
}

const cancelSelect = (coms: DatavComponent[]) => {
  coms.forEach(com => {
    com.hovered = false
    com.selected = false

    if (com.children) {
      cancelSelect(com.children)
    }
  })
}

export const useComStore = defineStore('com', {
  state: (): IComState => ({
    coms: [],
    subComs: [],
  }),
  getters: {
    selectedComs(state) {
      return state.coms.filter(m => m.selected)
    },
    selectedCom(): DatavComponent | null {
      const coms = this.selectedComs
      return coms.length === 1 ? coms[0] : null
    },
  },
  actions: {
    load(payload: DatavComponent[]) {
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
    select(id: string, multiple = false) {
      if (id) {
        confirmSelect(this.coms, id, multiple)
      } else {
        cancelSelect(this.coms)
      }
    },
    selects(toCom: DatavComponent) {
      const scoms = this.selectedComs
      if (toCom.selected || scoms.length > 0) {
        // 虽有小bug，但是够用。O(∩_∩)O哈哈~
        let fromIdx = findComIndex(this.coms, scoms[0])
        const toIdx = findComIndex(this.coms, toCom)
        if (scoms.length > 1) {
          const sidx = fromIdx
          const ecom = scoms[scoms.length - 1]
          if (ecom.id !== toCom.id) {
            const eidx = findComIndex(this.coms, ecom)
            fromIdx =  Math.abs(toIdx - sidx) > Math.abs(toIdx - eidx) ? eidx : sidx
          }
        }
        if (fromIdx === toIdx) {
          return
        }
        const sidx = Math.min(fromIdx, toIdx)
        const eidx = Math.max(fromIdx, toIdx)
        this.coms.forEach((com, idx) => {
          com.selected = sidx <= idx && idx <= eidx
        })
      } else {
        toCom.selected = true
      }
    },
    move(id: string, moveType: MoveType) {
      const i = findComIndex(this.coms, id)
      if (moveType === MoveType.up) {
        if (i + 1 < this.coms.length) {
          this.coms.splice(i + 1, 0, ...this.coms.splice(i, 1))
        }
      } else if (moveType === MoveType.down) {
        if (i > 0) {
          this.coms.splice(i - 1, 0, ...this.coms.splice(i, 1))
        }
      } else if (moveType === MoveType.top) {
        if (i + 1 < this.coms.length) {
          this.coms.push(...this.coms.splice(i, 1))
        }
      } else if (moveType === MoveType.bottom) {
        if (i > 0) {
          this.coms.unshift(...this.coms.splice(i, 1))
        }
      }
    },
    moveTo(toIndex: number) {
      let toIdx = toIndex
      const coms = this.coms.filter(m => !m.selected)
      const toCom = this.coms[toIdx]
      if (toCom) {
        toIdx = findComIndex(coms, toCom)
      }
      coms.splice(toIdx, 0, ...this.selectedComs)
      this.coms = coms
    },
    async request(projectId: number) {
      try {
        const res = await getComs(projectId)
        if (res.data.code === 0) {
          this.load(res.data.data)
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async delete(com: DatavComponent) {
      await this.deletes([com])
    },
    async deletes(coms: DatavComponent[]) {
      try {
        const ids = coms.map(m => m.id).join()
        const res = await deleteCom(ids)
        if (res.data.code === 0) {
          coms.forEach(com => {
            if (com.type === ComType.subCom) {
              this.subComs.splice(findComIndex(this.subComs, com.id), 1)
            } else {
              this.coms.splice(findComIndex(this.coms, com.id), 1)
            }
          })
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async add(com: DatavComponent) {
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
    async copy(id: string) {
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
            ncom.selected = true
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
            ocom.hovered = false
            ocom.selected = false
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
    createGroup() {
      let top = Infinity, left = Infinity
      let right = -Infinity, bottom = -Infinity
      this.selectedComs.forEach(({ attr }) => {
        top = Math.min(attr.y, top)
        left = Math.min(attr.x, left)
        right = Math.max(attr.x + attr.w, right)
        bottom = Math.max(attr.y + attr.h, bottom)
      })

      const gcom = new Group({
        x: left,
        y: top,
        w: right - left,
        h: bottom - top,
      })
      gcom.children.push(...this.selectedComs)
      this.coms = this.coms.filter(m => !m.selected)
      this.add(gcom)
    },
  },
})
