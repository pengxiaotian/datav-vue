import { cloneDeep } from 'lodash-es'
import { ComType, DatavComponent } from '@/components/_models/datav-component'
import { generateId } from '@/utils/util'
import { DatavGroup, sortGroupConfig } from '@/components/_internal/group'

export const getNewChildCom = (coms: DatavComponent[], parentId?: string) => {
  coms.forEach(ncom => {
    ncom.id = generateId(ncom.name)
    ncom.parentId = parentId
    ncom.alias += '_copy'

    for (const key in ncom.apiData) {
      ncom.apiData[key].id = generateId()
      ncom.apiData[key].comId = ncom.id
    }

    if (ncom.type === ComType.layer) {
      getNewChildCom(ncom.children, ncom.id)
      sortGroupConfig(ncom as DatavGroup)
    }
  })
}

export const getNewCom = (com: DatavComponent, parentId?: string) => {
  const ncom = cloneDeep(com)
  ncom.id = generateId(ncom.name)
  ncom.parentId = parentId
  ncom.alias += '_copy'

  ncom.hovered = false
  ncom.selected = true
  ncom.renameing = false

  if (!parentId) {
    ncom.attr.x += 30
    ncom.attr.y += 30
  }

  for (const key in ncom.apiData) {
    ncom.apiData[key].id = generateId()
    ncom.apiData[key].comId = ncom.id
  }

  if (ncom.type === ComType.layer) {
    getNewChildCom(ncom.children, ncom.id)
    sortGroupConfig(ncom as DatavGroup)
  }

  return ncom
}
