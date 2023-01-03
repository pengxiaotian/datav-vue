import { nextTick } from 'vue'
import { useComStore } from '@/store/com'
import { useBlueprintStore } from '@/store/blueprint'
import { DatavComponent } from '../_models/datav-component'

export const loadCom = async (com: DatavComponent) => {
  const comStore = useComStore()
  const blueprintStore = useBlueprintStore()

  await comStore.add(com)
  comStore.select(com.id)

  if (com.apis.source) {
    await com.loadData()
    nextTick(() => {
      blueprintStore.events[com.id]?.requestData()
    })
  }
}

export const loadSubComs = async (parentCom: DatavComponent, subComs: DatavComponent[]) => {
  const comStore = useComStore()
  const blueprintStore = useBlueprintStore()

  const ps: Promise<any>[] = []
  const ids = []

  subComs.forEach(m => {
    m.parentId = parentCom.id
    if (m.apis.source) {
      ids.push(m.id)
      ps.push(m.loadData())
    }
  })

  await comStore.addComs(subComs)

  if (ps.length > 0) {
    await Promise.all(ps)
    nextTick(() => {
      ids.forEach(id => {
        blueprintStore.events[id]?.requestData()
      })
    })
  }
}
