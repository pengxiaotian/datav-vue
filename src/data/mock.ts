import { createComponent } from '@/components/datav'
import { getRandomInt } from '@/utils/util'
import { useEditorStore } from '@/store/editor'
import { useBlueprintStore } from '@/store/blueprint'
import { useComStore } from '@/store/com'

export const useMock = async () => {
  const comStore = useComStore()
  const editorStore = useEditorStore()
  const blueprintStore = useBlueprintStore()

  const names = ['VMainTitle', 'VNumberTitleFlop', 'VDatePicker', 'VBgBox', 'VBorderBox', 'VDecoration', 'VBasicBar', 'VMarquee', 'VParagraph', 'VTimer', 'VFullScreen', 'VMainImg', 'VWordCloud']

  const ps1 = names.map(name => createComponent(name))
  const coms = await Promise.all(ps1)

  const ps2 = coms.map(com => {
    // com.apis.source.useAutoUpdate = true
    // com.apis.source.autoUpdate = 5
    com.attr.x = getRandomInt(editorStore.pageConfig.width - com.attr.w)
    com.attr.y = getRandomInt(editorStore.pageConfig.height - com.attr.h)
    return comStore.addCom(com)
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
        blueprintStore.events[id]?.requestData()
      })
    }, 200)
  }
}
