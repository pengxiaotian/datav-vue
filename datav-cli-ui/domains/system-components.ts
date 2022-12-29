import type { CascaderOption } from 'naive-ui'
import { classifications, ComDataType } from '../../src/data/system-components'

export const getSystemDataVComponents = () => {
  const list: CascaderOption[] = []
  for (const item1 of classifications) {
    const opt: CascaderOption = {
      value: item1.type,
      label: item1.name,
      children: [],
    }

    for (const item2 of item1.data as ComDataType[]) {
      const com: CascaderOption = {
        value: item2.type,
        label: item2.name,
        children: [],
      }
      opt.children.push(com)
    }

    list.push(opt)
  }

  return list
}
