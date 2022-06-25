
import { reactive, computed, h } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { DatavComponent } from '@/components/_models/datav-component'
import { on, off } from '@/utils/dom'
import { MoveType } from '@/domains/editor'
import { IconWarning } from '@/icons'

const pos = reactive({ x: 0, y: 0 })

export const useContextMenu = () => {
  const nMessage = useMessage()
  const nDialog = useDialog()
  const comStore = useComStore()
  const editorStore = useEditorStore()

  const isLocked = computed(() => comStore.selectedComs.every(m => m.locked))
  const isHided = computed(() => comStore.selectedComs.every(m => m.hided))
  const isGroup = computed(() => comStore.selectedCom?.group)
  const disableGroup = computed(() => {
    const coms = comStore.selectedComs
    if (coms.length > 1) {
      return coms.filter(m => m.group).some(m => m.group)
    }

    return isGroup.value
  })

  const moveCom = (moveType: MoveType) => {
    const coms = comStore.selectedComs
    if (coms.length === 0) {
      return
    }

    if (coms.length > 1) {
      const ids = coms.map(m => m.id)
      if (moveType === MoveType.bottom || moveType === MoveType.up) {
        ids.reverse()
      }
      ids.forEach(id => {
        comStore.move(id, moveType)
      })
    } else {
      comStore.move(comStore.selectedCom.id, moveType)
    }
  }

  const lockCom = () => {
    const coms = comStore.selectedComs
    if (coms.length === 0) {
      return
    }
    const locked = !isLocked.value
    coms.forEach(com => {
      com.locked = locked
    })
  }

  const hideCom = () => {
    const coms = comStore.selectedComs
    if (coms.length === 0) {
      return
    }
    const hided = !isHided.value
    coms.forEach(com => {
      com.hided = hided
    })
  }

  const confirmDeleteCom = () => {
    const coms = comStore.selectedComs
    if (coms.length === 0) {
      return
    }
    const names = coms.map(m => m.alias)
    const d = nDialog.create({
      content: `删除后可能无法恢复，是否删除${names.join('，')}，共${names.length}个组件`,
      negativeText: '取消',
      positiveText: '确定',
      iconPlacement: 'top',
      icon: () => h(IconWarning),
      onPositiveClick: async () => {
        d.loading = true
        try {
          await comStore.deletes(coms)
        } catch (error) {
          nMessage.error(error.message)
        }
      },
    })
  }

  const renameCom = () => {
    comStore.selectedComs[0].renameing = true
  }

  const copyCom = () => {
    comStore.selectedComs.forEach(com => {
      comStore.copy(com.id)
    })
  }

  const composeComs = () => {
    const coms = comStore.selectedComs
    if (coms.length === 0) {
      return
    }
    editorStore.compose()
  }

  const decomposeComs = () => {
    const coms = comStore.selectedComs
    if (coms.length === 0) {
      return
    }
    editorStore.decompose()
  }

  const showMenu = (ev: MouseEvent, com: DatavComponent) => {
    ev.preventDefault()
    ev.stopPropagation()

    if (!com.selected) {
      return
    }

    pos.x = ev.clientX
    pos.y = ev.clientY
    editorStore.contextMenu.show = true

    on(document, 'mouseup', hideMenu)
  }

  const hideMenu = () => {
    off(document, 'mouseup', hideMenu)

    editorStore.contextMenu.show = false
  }

  return {
    pos,
    isLocked,
    isHided,
    isGroup,
    disableGroup,
    showMenu,
    hideMenu,
    moveCom,
    lockCom,
    hideCom,
    confirmDeleteCom,
    renameCom,
    copyCom,
    composeComs,
    decomposeComs,
  }
}
