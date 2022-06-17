<template>
  <div
    v-if="editorStore.contextMenu.show"
    class="context-menu-wrap"
    :style="contextMenuStyle"
  >
    <div class="context-menu-item" :class="singleClass" @click="moveCom(MoveType.top)">
      <n-icon class="menu-icon">
        <IconMoveTop />
      </n-icon>
      置顶
    </div>
    <div class="context-menu-item" :class="singleClass" @click="moveCom(MoveType.bottom)">
      <n-icon class="menu-icon">
        <IconMoveBottom />
      </n-icon>
      置底
    </div>
    <div class="context-menu-item" :class="singleClass" @click="moveCom(MoveType.up)">
      <n-icon class="menu-icon">
        <IconMoveUp />
      </n-icon>
      上移一层
    </div>
    <div class="context-menu-item" :class="singleClass" @click="moveCom(MoveType.down)">
      <n-icon class="menu-icon">
        <IconMoveDown />
      </n-icon>
      下移一层
    </div>

    <div class="context-menu-divider"></div>

    <div class="context-menu-item" :class="{ disable: isGroup }" @click="composeComs">
      <n-icon class="menu-icon">
        <IconGroup />
      </n-icon>
      成组
    </div>
    <div class="context-menu-item" :class="{ disable: !isGroup }" @click="decomposeComs">
      <n-icon class="menu-icon">
        <IconUngroup />
      </n-icon>
      取消成组
    </div>

    <div class="context-menu-divider"></div>

    <div class="context-menu-item" :class="singleClass" @click="lockCom">
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
    <div class="context-menu-item" :class="singleClass" @click="hideCom">
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

    <div class="context-menu-item" :class="singleClass" @click="renameCom">
      <n-icon class="menu-icon">
        <IconEdit />
      </n-icon>
      重命名
    </div>
    <div class="context-menu-item" :class="singleClass" @click="copyCom">
      <n-icon class="menu-icon">
        <IconCopy />
      </n-icon>
      复制
    </div>
    <div class="context-menu-item" :class="singleClass" @click="confirmDeleteCom">
      <n-icon class="menu-icon">
        <IconDelete />
      </n-icon>
      删除
    </div>

    <div class="context-menu-divider"></div>
  </div>
</template>

<script lang='ts' setup>
import { computed, h, onBeforeMount, onUnmounted } from 'vue'
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
  IconGroup,
  IconUngroup,
} from '@/icons'
import { useContextMenu } from './index'

const nMessage = useMessage()
const nDialog = useDialog()
const editorStore = useEditorStore()
const comStore = useComStore()
const { pos } = useContextMenu()

const currCom = computed(() => comStore.selectedCom)
const isLocked = computed(() => currCom.value?.locked)
const isHided = computed(() => currCom.value?.hided)
const isGroup = computed(() => currCom.value?.group)

const contextMenuStyle = computed(() => {
  return {
    display: editorStore.contextMenu.show ? 'block' : 'none',
    left: `${pos.x + 10}px`,
    top: `${pos.y + 10}px`,
    transform: document.documentElement.clientHeight - pos.y < 250
      ? 'translate(0px, -100%)'
      : '',
  }
})

const singleClass = computed(() => ({
  disable: comStore.selectedComs.length > 1,
}))

const moveCom = (moveType: MoveType) => {
  editorStore.moveCom(currCom.value.id, moveType)
}

const lockCom = () => {
  currCom.value.locked = !currCom.value.locked
}

const hideCom = () => {
  currCom.value.hided = !currCom.value.hided
}

const confirmDeleteCom = () => {
  const d = nDialog.create({
    content: '是否删除选中的1个组件',
    negativeText: '取消',
    positiveText: '确定',
    iconPlacement: 'top',
    icon: () => h(IconWarning),
    onPositiveClick: async () => {
      d.loading = true
      try {
        await comStore.deleteCom(currCom.value)
      } catch (error) {
        nMessage.error(error.message)
      }
    },
  })
}

const renameCom = () => {
  currCom.value.renameing = true
}

const copyCom = () => {
  comStore.copyCom(currCom.value.id)
}

const composeComs = () => {
  editorStore.compose()
}

const decomposeComs = () => {
  editorStore.decompose()
}

const handleContextmenu = (ev: Event) => ev.preventDefault()

onBeforeMount(() => {
  on(document, 'contextmenu', handleContextmenu)
})

onUnmounted(() => {
  off(document, 'contextmenu', handleContextmenu)
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
