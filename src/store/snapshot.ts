import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { DatavComponent } from '@/components/_models/datav-component'
import { useComStore } from './com'

export interface ISnapshotState {
  snapshotData: DatavComponent[][]
  snapshotIndex: number
}

/**
 * 暂时弃用，数据量太大了
 * 数据快照
 */
export const useSnapshotStore = defineStore('snapshot', {
  state: (): ISnapshotState => ({
    snapshotData: [], // 编辑器快照数据
    snapshotIndex: -1, // 快照索引
  }),
  actions: {
    undo() {
      if (this.snapshotIndex >= 0) {
        this.snapshotIndex--
        const snapshotComs = cloneDeep(this.snapshotData[this.snapshotIndex]) || []
        const comStore = useComStore()
        const curCom = comStore.selectedCom
        if (curCom) {
          // 如果当前组件不在 snapshotComs 中，则置空
          const needClean = !snapshotComs.some(component => curCom.id === component.id)
          if (needClean) {
            comStore.select('')
          }
        }
        comStore.load(snapshotComs)
      }
    },

    redo() {
      if (this.snapshotIndex < this.snapshotData.length - 1) {
        this.snapshotIndex++
        const comStore = useComStore()
        const snapshotComs = cloneDeep(this.snapshotData[this.snapshotIndex]) || []
        comStore.load(snapshotComs)
      }
    },

    recordSnapshot() {
      const comStore = useComStore()
      // 添加新的快照
      this.snapshotData[++this.snapshotIndex] = cloneDeep([...comStore.coms, ...comStore.subComs])
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (this.snapshotIndex < this.snapshotData.length - 1) {
        this.snapshotData = this.snapshotData.slice(0, this.snapshotIndex + 1)
      }
    },
  },
})
