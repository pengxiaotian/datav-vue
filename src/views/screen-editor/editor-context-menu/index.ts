
import { reactive, computed } from 'vue'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { on, off } from '@/utils/dom'

const pos = reactive({
  x: 0,
  y: 0,
})

export const useContextMenu = (opts?: { beforeClose?: Function; }) => {
  const editorStore = useEditorStore()
  const comStore = useComStore()
  const contextMenu = computed(() => editorStore.contextMenu)
  const selectedCom = computed(() => comStore.selectedCom)

  const isLocked = computed(() => selectedCom.value?.locked)
  const isHided = computed(() => selectedCom.value?.hided)

  const contextMenuStyle = computed(() => {
    return {
      display: contextMenu.value.show ? 'block' : 'none',
      left: `${pos.x + 10}px`,
      top: `${pos.y + 10}px`,
      transform: document.documentElement.clientHeight - pos.y < 250
        ? 'translate(0px, -100%)'
        : '',
    }
  })

  const showMenu = (ev: MouseEvent) => {
    ev.preventDefault()

    if (selectedCom.value) {
      pos.x = ev.clientX
      pos.y = ev.clientY
      contextMenu.value.show = true

      on(document, 'click', hideMenu)
    }
  }

  const hideMenu = () => {
    off(document, 'click', hideMenu)

    if (opts && opts.beforeClose) {
      opts.beforeClose()
    }

    contextMenu.value.show = false
  }

  return {
    contextMenu,
    selectedCom,
    isLocked,
    isHided,
    contextMenuStyle,
    showMenu,
    hideMenu,
  }
}
