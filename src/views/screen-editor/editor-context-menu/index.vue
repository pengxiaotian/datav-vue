<template>
  <div v-if="contextMenu.show" class="context-menu-wrap" :style="contextMenuStyle">
    <div class="context-menu-item" @click="moveTop">
      <n-icon class="menu-icon">
        <IconMoveTop />
      </n-icon>
      置顶
    </div>
    <div class="context-menu-item" @click="moveBottom">
      <n-icon class="menu-icon">
        <IconMoveBottom />
      </n-icon>
      置底
    </div>
    <div class="context-menu-item" @click="moveUp">
      <n-icon class="menu-icon">
        <IconMoveUp />
      </n-icon>
      上移一层
    </div>
    <div class="context-menu-item" @click="moveDown">
      <n-icon class="menu-icon">
        <IconMoveDown />
      </n-icon>
      下移一层
    </div>

    <div class="context-menu-divider"></div>

    <div class="context-menu-item" @click="lockCom">
      <template v-if="isLocked">
        <n-icon class="menu-icon">
          <IconUnlock />
        </n-icon>
        解锁
      </template>
      <template v-else>
        <n-icon class="menu-icon">
          <IconLock />
        </n-icon>
        锁定
      </template>
    </div>
    <div class="context-menu-item" @click="hideCom">
      <template v-if="isHided">
        <n-icon class="menu-icon">
          <IconShow />
        </n-icon>
        显示
      </template>
      <template v-else>
        <n-icon class="menu-icon">
          <IconHide />
        </n-icon>
        隐藏
      </template>
    </div>

    <div class="context-menu-divider"></div>

    <div class="context-menu-item" @click="renameCom">
      <n-icon class="menu-icon">
        <IconEdit />
      </n-icon>
      重命名
    </div>
    <div class="context-menu-item" @click="toCopyCom">
      <n-icon class="menu-icon">
        <IconCopy />
      </n-icon>
      复制
    </div>
    <div class="context-menu-item" @click="toDeleteCom">
      <n-icon class="menu-icon">
        <IconDelete />
      </n-icon>
      删除
    </div>

    <div class="context-menu-divider"></div>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, onBeforeMount, onUnmounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { on, off } from '@/utils/dom'
import { MoveType } from '@/domains/editor'
import {
  IconWarning,
  IconMoveUp,
  IconMoveDown,
  IconMoveTop,
  IconMoveBottom,
  IconLock,
  IconUnlock,
  IconShow,
  IconHide,
  IconCopy,
  IconEdit,
  IconDelete,
} from '@/icons'
import { useContextMenu } from './index'

export default defineComponent({
  name: 'EditorContextMenu',
  components: {
    IconMoveUp,
    IconMoveDown,
    IconMoveTop,
    IconMoveBottom,
    IconLock,
    IconUnlock,
    IconShow,
    IconHide,
    IconCopy,
    IconEdit,
    IconDelete,
  },
  setup() {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const editorStore = useEditorStore()
    const comStore = useComStore()
    const {
      contextMenu, selectedCom,
      isLocked, isHided, contextMenuStyle,
    } = useContextMenu()

    const moveCom = (moveType: MoveType) => {
      if (selectedCom.value) {
        editorStore.moveCom(selectedCom.value.id, moveType)
      }
    }

    const moveUp = () => moveCom(MoveType.up)
    const moveDown = () => moveCom(MoveType.down)
    const moveTop = () => moveCom(MoveType.top)
    const moveBottom = () => moveCom(MoveType.bottom)

    const lockCom = () => {
      if (selectedCom.value) {
        selectedCom.value.locked = !selectedCom.value.locked
      }
    }

    const hideCom = () => {
      if (selectedCom.value) {
        selectedCom.value.hided = !selectedCom.value.hided
      }
    }

    const toDeleteCom = () => {
      const com = selectedCom.value
      if (com) {
        const d = nDialog.create({
          content: '是否删除选中的1个组件',
          negativeText: '取消',
          positiveText: '确定',
          iconPlacement: 'top',
          icon: () => h(IconWarning),
          onPositiveClick: async () => {
            d.loading = true
            try {
              await comStore.deleteCom(com)
            } catch (error) {
              nMessage.error(error.message)
            }
          },
        })
      }
    }

    const renameCom = () => {
      if (selectedCom.value) {
        selectedCom.value.renameing = true
      }
    }

    const toCopyCom = () => {
      if (selectedCom.value) {
        comStore.copyCom(selectedCom.value.id)
      }
    }

    const handleContextmenu = (ev: Event) => ev.preventDefault()

    onBeforeMount(() => {
      on(document, 'contextmenu', handleContextmenu)
    })

    onUnmounted(() => {
      off(document, 'contextmenu', handleContextmenu)
    })

    return {
      contextMenu,
      isLocked,
      isHided,
      contextMenuStyle,
      moveUp,
      moveDown,
      moveTop,
      moveBottom,
      lockCom,
      hideCom,
      toDeleteCom,
      renameCom,
      toCopyCom,
    }
  },
})
</script>

<style lang="scss" scoped>
.context-menu-wrap {
  position: fixed;
  z-index: 9999;
  display: none;
  width: 111px;
  color: var(--datav-font-color);
  background: var(--datav-menu-bg);
  user-select: none;
}

.context-menu-item {
  display: flex;
  height: 28px;
  padding: 0 6px;
  padding-right: 3em;
  overflow: hidden;
  align-items: center;
  cursor: pointer;
  border-left: 2px solid transparent;

  &:hover {
    color: var(--datav-menu-color-hover);
    background-color: var(--datav-menu-bg-hover);
    border-left: 2px solid var(--datav-menu-color-hover);
  }

  .menu-icon {
    margin-right: 4px;
    font-size: 14px;
  }

  &.disable {
    color: var(--datav-menu-color-disabled);
    pointer-events: none;
    cursor: auto;
  }
}

.context-menu-divider {
  width: 100%;
  height: 1px;
  background-color: var(--datav-border-color);
}
</style>
