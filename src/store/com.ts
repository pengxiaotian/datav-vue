import { defineStore } from 'pinia'
import { ComType, DatavComponent } from '@/components/_models/datav-component'
import { DatavGroup, createGroupConfig, sortGroupConfig } from '@/components/_internal/group'
import { getComs, deleteComs, addCom, copyCom } from '@/api/coms'
import { MoveType } from '@/domains/editor'
import { getNewCom } from '@/data/mock-copy'

export interface IComState {
  coms: DatavComponent[]
  subComs: DatavComponent[]
}

const findCom = (coms: DatavComponent[], id: string): DatavComponent | null => {
  for (let i = 0, len = coms.length; i < len; i++) {
    const com = coms[i]
    if (com.id === id) {
      return com
    }

    if (com.type === ComType.layer) {
      const subCom = findCom(com.children, id)
      if (subCom) {
        return subCom
      }
    }
  }

  return null
}

const findComs = (coms: DatavComponent[], parentId?: string) => {
  if (!parentId) {
    return coms
  }

  for (let i = 0, len = coms.length; i < len; i++) {
    const com = coms[i]
    if (com.id === parentId) {
      return com.children
    }

    if (com.type === ComType.layer) {
      const item = com.children.find(m => m.id === parentId)
      if (item) {
        return item.children
      }
    }
  }
}

const getComIndex = (coms: DatavComponent[], data: string | DatavComponent) => {
  const id = typeof data === 'string' ? data : data.id
  return coms.findIndex(c => c.id === id)
}

const confirmSelect = (coms: DatavComponent[], id: string, pid: string, multiple = false, callback?: Function) => {
  for (let i = 0, len = coms.length; i < len; i++) {
    const com = coms[i]
    com.hovered = false
    if (multiple) {
      if (com.id === id) {
        com.selected = !com.selected
        if (com.parentId != pid) {
          callback?.()
          com.selected = true
          break
        }
      }
    } else {
      com.selected = com.id === id
    }

    if (com.type === ComType.layer) {
      confirmSelect(com.children, id, pid, multiple, callback)
    }
  }
}

const cancelSelect = (coms: DatavComponent[]) => {
  coms.forEach(com => {
    com.hovered = false
    com.selected = false

    if (com.type === ComType.layer) {
      cancelSelect(com.children)
    }
  })
}

const getSelected = (coms: DatavComponent[]) => {
  let list = coms.filter(m => m.selected)
  if (list.length > 0) {
    return list
  }

  for (let i = 0, len = coms.length; i < len; i++) {
    const com = coms[i]
    if (com.type === ComType.layer) {
      list = getSelected(com.children)
      if (list.length > 0) {
        return list
      }
    }
  }

  return list
}

const sumPos = (coms: DatavComponent[]) => {
  return coms.reduce((prev, { attr }) => {
    prev.x += attr.x
    prev.y += attr.y
    return prev
  }, { x: 0, y: 0 })
}

export const getChildState = (com: DatavComponent): { hovered: boolean; selected: boolean; } => {
  let hovered = false
  let selected = false
  if (com.type === ComType.layer) {
    for (let i = 0, len = com.children.length; i < len; i++) {
      const sc = com.children[i]
      if (sc.selected) selected = sc.selected
      if (sc.hovered) hovered = sc.hovered

      if (!selected && sc.type === ComType.layer) {
        const s = getChildState(sc)
        if (s.selected) selected = s.selected
        if (s.hovered) hovered = s.hovered
      }

      if (selected && hovered) {
        break
      }
    }
  }

  return {
    hovered,
    selected,
  }
}


export const useComStore = defineStore('com', {
  state: (): IComState => ({
    coms: [],
    subComs: [],
  }),
  getters: {
    selectedComs(state) {
      return getSelected(state.coms)
    },
    selectedCom(): DatavComponent | null {
      const coms = this.selectedComs
      return coms.length === 1 ? coms[0] : null
    },
    selectedSubCom(state): DatavComponent | null {
      const com = this.selectedCom
      if (com) {
        const subCom = state.subComs.find(m => m.selected && m.parentId === com.id)
        return subCom
      }
      return null
    },
  },
  actions: {
    load(payload: DatavComponent[]) {
      const coms: DatavComponent[] = []
      const subComs: DatavComponent[] = []
      payload.forEach(c => {
        if (c.type === ComType.subCom) {
          subComs.push(c)
        } else {
          coms.push(c)
        }
      })

      this.coms = coms
      this.subComs = subComs
    },
    getCom(id: string) {
      return findCom(this.coms, id)
    },
    select(id: string, parentId?: string, multiple = false) {
      if (id) {
        let pid = parentId
        if (multiple) {
          const scoms = this.selectedComs
          if (scoms.length > 0) {
            pid = scoms[0].parentId
          }
        }
        confirmSelect(this.coms, id, pid, multiple, () => {
          cancelSelect(this.coms)
        })
      } else {
        cancelSelect(this.coms)
      }
    },
    selects(toCom: DatavComponent) {
      const scoms = this.selectedComs
      if (toCom.selected || scoms.length > 0) {
        if (toCom.parentId != scoms[0].parentId) {
          this.select(toCom.id, toCom.parentId)
          return
        }

        // 虽有小bug，但是够用。O(∩_∩)O哈哈~
        const list = findComs(this.coms, toCom.parentId)
        let fromIdx = getComIndex(list, scoms[0])
        const toIdx = getComIndex(list, toCom)
        if (scoms.length > 1) {
          const sidx = fromIdx
          const ecom = scoms[scoms.length - 1]
          if (ecom.id !== toCom.id) {
            const eidx = getComIndex(list, ecom)
            fromIdx =  Math.abs(toIdx - sidx) > Math.abs(toIdx - eidx) ? eidx : sidx
          }
        }
        if (fromIdx === toIdx) {
          return
        }
        const sidx = Math.min(fromIdx, toIdx)
        const eidx = Math.max(fromIdx, toIdx)
        list.forEach((com, idx) => {
          com.selected = sidx <= idx && idx <= eidx
        })
      } else {
        toCom.selected = true
      }
    },
    selectSubCom(id: string) {
      this.subComs.forEach(com => {
        com.selected = com.id === id
      })
    },
    getParents(pid: string) {
      const parentComs: DatavComponent[] = []

      const getParent = (id: string) => {
        const com = findCom(this.coms, id)
        parentComs.push(com)

        if (com.parentId) {
          getParent(com.parentId)
        }
      }

      if (pid) {
        getParent(pid)
      }

      return parentComs
    },
    checkParent(sourceCom: DatavComponent, targetComs: DatavComponent[]) {
      const pids = this.getParents(sourceCom.parentId).map(m => m.id)
      if (pids.length > 0) {
        return targetComs.some(m => pids.includes(m.id))
      }
      return false
    },
    resizeParents(parentComs: DatavComponent | DatavComponent[]) {
      const resizeParent = (com: DatavComponent) => {
        let top = Infinity, left = Infinity
        let right = -Infinity, bottom = -Infinity
        com.children.forEach(({ attr }) => {
          // 先还原在父容器里的位置，然后计算边界
          attr.x += com.attr.x
          attr.y += com.attr.y
          top = Math.min(attr.y, top)
          left = Math.min(attr.x, left)
          right = Math.max(attr.x + attr.w, right)
          bottom = Math.max(attr.y + attr.h, bottom)
        })

        com.attr.x = left
        com.attr.y = top
        com.attr.w = right - left
        com.attr.h = bottom - top

        com.children.forEach(({ attr }) => {
          attr.x -= left
          attr.y -= top
        })
      }

      if (Array.isArray(parentComs)) {
        parentComs.forEach(com => {
          resizeParent(com)
        })
      } else {
        resizeParent(parentComs)
      }
    },
    resizeChildren(parentCom: DatavComponent) {
      const { sx, sy } = parentCom.scaling

      const resize = (coms: DatavComponent[]) => {
        coms.forEach(com => {
          const { attr } = com
          attr.x = Math.round(attr.x * sx)
          attr.y = Math.round(attr.y * sy)
          attr.w = Math.round(attr.w * sx)
          attr.h = Math.round(attr.h * sy)
          if (com.type === ComType.layer) {
            resize(com.children)
          }
        })
      }

      resize(parentCom.children)
    },
    move(moveType: MoveType, id: string, pid: string) {
      let com: DatavComponent = null
      let i = -1, len = 0
      if (pid) {
        com = findCom(this.coms, pid)
        i = getComIndex(com.children, id)
        len = com.children.length
      } else {
        i = getComIndex(this.coms, id)
        len = this.coms.length
      }

      if (moveType === MoveType.up) {
        if (i > 0) {
          if (com) {
            com.children.splice(i - 1, 0, ...com.children.splice(i, 1))
          } else {
            this.coms.splice(i - 1, 0, ...this.coms.splice(i, 1))
          }
        }
      } else if (moveType === MoveType.down) {
        if (i + 1 < len) {
          if (com) {
            com.children.splice(i + 1, 0, ...com.children.splice(i, 1))
          } else {
            this.coms.splice(i + 1, 0, ...this.coms.splice(i, 1))
          }
        }
      } else if (moveType === MoveType.top) {
        if (i > 0) {
          if (com) {
            com.children.unshift(...com.children.splice(i, 1))
          } else {
            this.coms.unshift(...this.coms.splice(i, 1))
          }
        }
      } else if (moveType === MoveType.bottom) {
        if (i + 1 < len) {
          if (com) {
            com.children.push(...com.children.splice(i, 1))
          } else {
            this.coms.push(...this.coms.splice(i, 1))
          }
        }
      }

      if (com) {
        sortGroupConfig(com as DatavGroup)
      }
    },
    moveTo(toLevel: number, toIndex: number, targetCom: DatavComponent) {
      const scoms = this.selectedComs
      // 父级不能移动到自己里面
      if (this.checkParent(targetCom, scoms)) {
        return
      }
      const fromParentId = scoms[0].parentId
      if (toLevel === 0) {
        let toIdx = this.coms.length - toIndex
        if (fromParentId == targetCom.parentId) {
          const coms = this.coms.filter(m => !m.selected)
          const toCom = this.coms[toIdx]
          if (toCom) {
            toIdx = getComIndex(coms, toCom)
          }
          coms.splice(toIdx, 0, ...scoms)
          this.coms = coms
        } else {
          const fromParents = this.getParents(fromParentId)
          const fromParentCom = fromParents[0]
          fromParentCom.children = fromParentCom.children.filter(m => !m.selected)
          const fromPos = sumPos(fromParents)
          scoms.forEach(m => {
            m.parentId = targetCom.parentId
            m.attr.x += fromPos.x
            m.attr.y += fromPos.y
          })
          this.coms.splice(toIdx, 0, ...scoms)

          if (fromParentCom.children.length === 0) {
            this.removes([fromParentCom.id], fromParentCom.parentId)
          } else {
            this.resizeParents(fromParents)
            sortGroupConfig(fromParentCom as DatavGroup)
          }
        }
        return
      }

      const moveChild = (item: DatavComponent) => {
        if (item.type !== ComType.layer || item.fold) {
          return false
        }

        for (let i = 0, len = item.children.length; i < len; i++) {
          const com = item.children[i]
          if (com.id === targetCom.id) {
            let toIdx = len - toIndex
            if (fromParentId == targetCom.parentId) {
              const coms = item.children.filter(m => !m.selected)
              const toCom = item.children[toIdx]
              if (toCom) {
                toIdx = getComIndex(coms, toCom)
              }
              coms.splice(toIdx, 0, ...scoms)
              item.children = coms
              sortGroupConfig(item as DatavGroup)
            } else {
              const fromParents = this.getParents(fromParentId)
              const toParents = this.getParents(targetCom.parentId)
              const fromPos = sumPos(fromParents)
              const toPos = sumPos(toParents)
              if (fromParentId) {
                const fromParentCom = fromParents[0]
                fromParentCom.children = fromParentCom.children.filter(m => !m.selected)
                if (fromParentCom.children.length === 0) {
                  this.removes([fromParentCom.id], fromParentCom.parentId)
                } else {
                  this.resizeParents(fromParents)
                  sortGroupConfig(fromParentCom as DatavGroup)
                }
              } else {
                this.coms = this.coms.filter(m => !m.selected)
              }

              scoms.forEach(m => {
                m.parentId = targetCom.parentId
                m.attr.x += fromPos.x - toPos.x
                m.attr.y += fromPos.y - toPos.y
              })
              item.children.splice(toIdx, 0, ...scoms)
              this.resizeParents(toParents)
              sortGroupConfig(item as DatavGroup)
            }
            return true
          } else if (com.id === targetCom.parentId && moveChild(com)) {
            return true
          }
        }
        return false
      }

      for (let i = 0, len = this.coms.length; i < len; i++) {
        if (moveChild(this.coms[i])) {
          break
        }
      }
    },
    sortSubCom(fromId: string, toId: string, isEnd: boolean) {
      const fromIdx = getComIndex(this.subComs, fromId)
      let toIndx = getComIndex(this.subComs, toId)
      if (isEnd) {
        toIndx += 1
      }

      this.subComs.splice(toIndx, 0, ...this.subComs.splice(fromIdx, 1))
    },
    getSubComs(parentId: string) {
      return this.subComs.filter(c => c.parentId === parentId)
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
        const ids = coms.map(m => m.id)
        const res = await deleteComs(ids)
        if (res.data.code === 0) {
          const com = coms[0]
          if (com.type === ComType.subCom) {
            this.subComs = this.subComs.filter(m => !ids.includes(m.id))
          } else {
            this.subComs = this.subComs.filter(m => !ids.includes(m.parentId))
            this.removes(ids, com.parentId)
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    removes(ids: string[], pid: string) {
      if (pid) {
        const com = findCom(this.coms, pid)
        com.children = com.children.filter(m => !ids.includes(m.id))
        if (com.children.length === 0) {
          this.removes([com.id], com.parentId)
        } else {
          sortGroupConfig(com as DatavGroup)
        }
      } else {
        this.coms = this.coms.filter(m => !ids.includes(m.id))
      }
    },
    async add(com: DatavComponent) {
      try {
        const res = await addCom(com)
        if (res.data.code === 0) {
          if (com.type === ComType.subCom) {
            this.subComs.push(com)
          } else {
            this.coms.push(com)
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async addComs(coms: DatavComponent[]) {
      try {
        const res = await addCom(coms)
        if (res.data.code === 0) {
          for (const com of coms) {
            if (com.type === ComType.subCom) {
              this.subComs.push(com)
            } else {
              this.coms.push(com)
            }
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async copy(id: string, type = ComType.com) {
      try {
        const res = await copyCom(id)
        if (res.data.code === 0) {
          // 模拟后端复制
          if (type === ComType.com) {
            const ocom = findCom(this.coms, id)
            if (ocom) {
              ocom.hovered = false
              ocom.selected = false
              const ncom = getNewCom(ocom, ocom.parentId)
              const nSubComs = this.getSubComs(ocom.id).map(m => getNewCom(m, ncom.id))
              if (ncom.parentId) {
                const g = findCom(this.coms, ncom.parentId) as DatavGroup
                g.children.push(ncom)
                g.config.push(createGroupConfig(ncom))
              } else {
                this.coms.push(ncom)
              }
              this.subComs.push(...nSubComs)
            }
          } else if (type === ComType.subCom) {
            const ocom = findCom(this.subComs, id)
            if (ocom) {
              const ncom = getNewCom(ocom, ocom.parentId)
              this.subComs.push(ncom)
            }
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    createGroup() {
      const scoms = this.selectedComs
      const sids = scoms.map(m => m.id)
      let top = Infinity, left = Infinity
      let right = -Infinity, bottom = -Infinity
      scoms.forEach(({ attr }) => {
        top = Math.min(attr.y, top)
        left = Math.min(attr.x, left)
        right = Math.max(attr.x + attr.w, right)
        bottom = Math.max(attr.y + attr.h, bottom)
      })

      const gcom = new DatavGroup({
        x: left,
        y: top,
        w: right - left,
        h: bottom - top,
      })
      gcom.parentId = scoms[0].parentId
      gcom.children.push(...scoms)
      gcom.children.forEach(com => {
        com.parentId = gcom.id
        com.attr.x -= gcom.attr.x
        com.attr.y -= gcom.attr.y
        gcom.config.push(createGroupConfig(com))
      })

      if (gcom.parentId) {
        const oldGroup = findCom(this.coms, gcom.parentId) as DatavGroup
        oldGroup.children = oldGroup.children.filter(m => !sids.includes(m.id))
        oldGroup.config = oldGroup.config.filter(m => !sids.includes(m.transform3d.id))
        oldGroup.children.push(gcom)
        oldGroup.config.push(createGroupConfig(gcom))
      } else {
        this.coms = this.coms.filter(m => !m.selected)
        this.add(gcom).then(() => {
          this.select(gcom.id)
        })
      }
    },
    cancelGroup() {
      const scoms = this.selectedComs
      const sids = scoms.map(m => m.id)
      const pid = scoms[0].parentId
      const coms = scoms.flatMap(m => {
        m.children.forEach(c => {
          c.parentId = pid
          c.attr.x += m.attr.x
          c.attr.y += m.attr.y
        })
        return m.children
      })

      if (pid) {
        const oldGroup = findCom(this.coms, pid) as DatavGroup
        oldGroup.children = oldGroup.children.filter(m => !sids.includes(m.id))
        oldGroup.config = oldGroup.config.filter(m => !sids.includes(m.transform3d.id))
        oldGroup.children.push(...coms)
        coms.forEach(com => {
          oldGroup.config.push(createGroupConfig(com))
        })
      } else {
        this.coms = this.coms.filter(com => !sids.includes(com.id))
        this.coms.push(...coms)
      }
    },
  },
})
