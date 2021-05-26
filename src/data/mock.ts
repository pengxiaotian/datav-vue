import { EditorModule } from '@/store/modules/editor'
import { createComponent } from '@/components/datav'
import { getRandomInt } from '@/utils/util'

export const useMock = () => {
  const { pageConfig } = EditorModule

  const names = ['VNumberTitleFlop']
  names.forEach(name => {
    const com = createComponent(name)
    com.attr.x = getRandomInt(pageConfig.width - com.attr.w)
    com.attr.y = getRandomInt(pageConfig.height - com.attr.h)
    EditorModule.addCom(com)
  })
}
