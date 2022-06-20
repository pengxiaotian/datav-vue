<template>
  <div class="context-menu-wrap" :style="contextMenuStyle">
    <div class="context-menu-item" @click="moveCom(MoveType.top)">
      <n-icon class="menu-icon">
        <IconMoveTop />
      </n-icon>
      置顶
    </div>
    <div class="context-menu-item" @click="moveCom(MoveType.bottom)">
      <n-icon class="menu-icon">
        <IconMoveBottom />
      </n-icon>
      置底
    </div>
    <div class="context-menu-item" @click="moveCom(MoveType.up)">
      <n-icon class="menu-icon">
        <IconMoveUp />
      </n-icon>
      上移一层
    </div>
    <div class="context-menu-item" @click="moveCom(MoveType.down)">
      <n-icon class="menu-icon">
        <IconMoveDown />
      </n-icon>
      下移一层
    </div>

    <div class="context-menu-divider"></div>

    <div class="context-menu-item" :class="{ disable: disableGroup }" @click="composeComs">
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
    <div class="context-menu-item" @click="copyCom">
      <n-icon class="menu-icon">
        <IconCopy />
      </n-icon>
      复制
    </div>
    <div class="context-menu-item" @click="confirmDeleteCom">
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
  if (coms.length > 1) {
    const ids = coms.map(m => m.id)
    if (moveType === MoveType.bottom || moveType === MoveType.down) {
      ids.reverse()
    }
    ids.forEach(id => {
      editorStore.moveCom(id, moveType)
    })
  } else {
    editorStore.moveCom(comStore.selectedCom.id, moveType)
  }
}

const lockCom = () => {
  const locked = !isLocked.value
  comStore.selectedComs.forEach(com => {
    com.locked = locked
  })
}

const hideCom = () => {
  const hided = !isHided.value
  comStore.selectedComs.forEach(com => {
    com.hided = hided
  })
}

const confirmDeleteCom = () => {
  const names = comStore.selectedComs.map(m => m.alias)
  const d = nDialog.create({
    content: `删除后可能无法恢复，是否删除${names.join('，')}，共${names.length}个组件`,
    negativeText: '取消',
    positiveText: '确定',
    iconPlacement: 'top',
    icon: () => h(IconWarning),
    onPositiveClick: async () => {
      d.loading = true
      try {
        await comStore.deleteComs(comStore.selectedComs)
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
    comStore.copyCom(com.id)
  })
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
