import { EditorModule } from '@/store/modules/editor'
import { createComponent } from '@/components/datav'
import { getRandomInt } from '@/utils/util'
import { BlueprintModule } from '@/store/modules/blueprint'

export const useMock = async () => {
  const { pageConfig } = EditorModule

  const names = ['VMainTitle', 'VNumberTitleFlop', 'VDatePicker', 'VBgBox', 'VBorderBox', 'VDecoration', 'VBasicBar', 'VMarquee', 'VParagraph', 'VTimer', 'VFullScreen', 'VMainImg', 'VWordCloud']

  const ps1 = names.map(name => createComponent(name))
  const coms = await Promise.all(ps1)

  const ps2 = coms.map(com => {
    // com.apis.source.useAutoUpdate = true
    // com.apis.source.autoUpdate = 5
    com.attr.x = getRandomInt(pageConfig.width - com.attr.w)
    com.attr.y = getRandomInt(pageConfig.height - com.attr.h)
    return EditorModule.addCom(com)
  })

  await Promise.all(ps2)

  const ps3: Promise<any>[] = []
  const comIds = []
  coms.forEach(com => {
    if (com.apis.source) {
      comIds.push(com.id)
      ps3.push(com.loadData())
    }
  })

  if (ps3.length > 0) {
    await Promise.all(ps3)
    setTimeout(() => {
      comIds.forEach(id => {
        BlueprintModule.datavComponents[id].$DATAV_requestData()
      })
    }, 200)
  }
}
