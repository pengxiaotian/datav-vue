
import { reactive } from 'vue'
import { useEditorStore } from '@/store/editor'
import { DatavComponent } from '@/components/_models/datav-component'
import { on, off } from '@/utils/dom'

const pos = reactive({ x: 0, y: 0 })

export const useContextMenu = () => {
  const editorStore = useEditorStore()

  const showMenu = (ev: MouseEvent, com: DatavComponent) => {
    ev.preventDefault()
    ev.stopPropagation()

    if (!com.selected) {
      return
    }

    pos.x = ev.clientX
    pos.y = ev.clientY
    editorStore.contextMenu.show = true

    on(document, 'click', hideMenu)
  }

  const hideMenu = () => {
    off(document, 'click', hideMenu)

    editorStore.contextMenu.show = false
  }

  return {
    pos,
    showMenu,
    hideMenu,
  }
}
