import { EditorModule } from '@/store/modules/editor'
import { createComponent } from '@/components/datav'
import { getRandomInt } from '@/utils/util'
import { BlueprintModule } from '@/store/modules/blueprint'

export const useMock = () => {
  const { pageConfig } = EditorModule

  const names = ['VMainTitle', 'VNumberTitleFlop', 'VDatePicker', 'VBgBox', 'VBorderBox', 'VDecoration', 'VBasicBar', 'VMarquee', 'VParagraph', 'VTimer', 'VFullScreen', 'VMainImg', 'VWordCloud']
  names.forEach(name => {
    createComponent(name).then(com => {
      // com.apis.source.useAutoUpdate = true
      // com.apis.source.autoUpdate = 5
      com.attr.x = getRandomInt(pageConfig.width - com.attr.w)
      com.attr.y = getRandomInt(pageConfig.height - com.attr.h)
      EditorModule.addCom(com)

      if (com.apis.source) {
        com.loadData().then(() => {
          BlueprintModule.datavComponents[com.id].$DATAV_requestData()
        })
      }
    })
  })
}
