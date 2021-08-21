<template>
  <div
    v-if="contextMenu.show"
    class="context-menu-wrap"
    :style="contextMenuStyle"
  >
    <div class="context-menu-item" @click="moveTop">
      <i class="menu-icon v-icon-move-top"></i>置顶
    </div>
    <div class="context-menu-item" @click="moveBottom">
      <i class="menu-icon v-icon-move-bottom"></i>置底
    </div>
    <div class="context-menu-item" @click="moveUp">
      <i class="menu-icon v-icon-move-up"></i>上移一层
    </div>
    <div class="context-menu-item" @click="moveDown">
      <i class="menu-icon v-icon-move-down"></i>下移一层
    </div>

    <div class="context-menu-divider"></div>

    <div class="context-menu-item" @click="lockCom">
      <template v-if="isLocked">
        <i class="menu-icon v-icon-unlock"></i>解锁
      </template>
      <template v-else>
        <i class="menu-icon v-icon-lock"></i>锁定
      </template>
    </div>
    <div class="context-menu-item" @click="hideCom">
      <template v-if="isHided">
        <i class="menu-icon v-icon-show"></i>显示
      </template>
      <template v-else>
        <i class="menu-icon v-icon-hide"></i>隐藏
      </template>
    </div>

    <div class="context-menu-divider"></div>

    <div class="context-menu-item" @click="renameCom">
      <i class="menu-icon v-icon-edit"></i>重命名
    </div>
    <div class="context-menu-item" @click="toCopyCom">
      <i class="menu-icon v-icon-copy"></i>复制
    </div>
    <div class="context-menu-item" @click="toDeleteCom">
      <i class="menu-icon v-icon-delete"></i>删除
    </div>

    <div class="context-menu-divider"></div>
  </div>
</template>


<script lang='ts'>
import { h, defineComponent, onBeforeMount, onUnmounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { EditorModule } from '@/store/modules/editor'
import { on, off } from '@/utils/dom'
import { MoveType } from '@/utils/enums'
import { IconWarning } from '@/icons'
import { useContextMenu } from './index'

export default defineComponent({
  name: 'EditorContextMenu',
  setup() {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const {
      contextMenu, selectedCom,
      isLocked, isHided, contextMenuStyle,
    } = useContextMenu()

    const moveCom = (moveType: MoveType) => {
      if (selectedCom.value) {
        EditorModule.moveCom({ id: selectedCom.value.id, moveType })
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
              await EditorModule.deleteCom(com)
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
        EditorModule.copyCom(selectedCom.value.id)
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
@import '@/styles/themes/var';

.context-menu-wrap {
  position: fixed;
  z-index: 9999;
  display: none;
  width: 111px;
  color: $context-menu-font-color;
  background: $context-menu-bgcolor;
  user-select: none;
}

.context-menu-item {
  display: flex;
  height: 28px;
  padding: 0 6px;
  padding-right: 3em;
  overflow: hidden;
  line-height: 28px;
  cursor: pointer;
  border-left: 2px solid transparent;

  &:hover {
    color: $context-menu-color-hover;
    background-color: $context-menu-bgcolor-hover;
    border-left: 2px solid $context-menu-color-hover;
  }

  .menu-icon {
    margin-right: 4px;
  }

  &.disable {
    color: $context-menu-color-disable;
    pointer-events: none;
    cursor: auto;
  }
}

.context-menu-divider {
  width: 100%;
  height: 1px;
  background-color: $context-menu-divider-bgcolor;
}
</style>
