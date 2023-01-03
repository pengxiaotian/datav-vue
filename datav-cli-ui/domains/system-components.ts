import type { CascaderOption } from 'naive-ui'
import { kebabCase } from 'lodash-es'
import { pascalCase } from '@/utils/string-util'
import { classifications, ComDataType, ComDataDto } from '@/data/system-components'

export const kebabCaseForComName = (str: string) => {
  return kebabCase(str)
    .replace('-2-d', '2d')
    .replace('-3-d', '3d')
}

export const pascalCaseForComName = (str: string) => {
  return pascalCase(str)
    .replace('2D', '2d')
    .replace('3D', '3d')
}

export const getSystemDataVComponents = () => {
  const options: CascaderOption[] = []
  for (const { name, type, data } of classifications) {
    const opt: CascaderOption = {
      label: name,
      value: type + name,
      children: [],
    }

    for (const category of data as ComDataType[]) {
      const opt2: CascaderOption = {
        label: category.name,
        value: category.type,
        children: [],
      }

      for (const com of category.data as ComDataDto[]) {
        const opt3: CascaderOption = {
          label: `${com.alias}(${com.name})`,
          value: kebabCaseForComName(com.name.substring(1)),
        }

        if (com.children) {
          opt3.children = []
          for (const subcom of com.children) {
            opt3.children.push({
              label: `${subcom.alias}(${subcom.name})`,
              value: kebabCaseForComName(subcom.name.substring(1)),
            })
          }
        }
        opt2.children.push(opt3)
      }
      opt.children.push(opt2)
    }
    options.push(opt)
  }

  return options
}
