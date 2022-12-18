<template>
  <div :class="['g-aside layer-panel-wp', { '--hide': !visiblePanel }]">
    <div class="layer-manager">
      <div class="layer-manager-top">
        <div class="layer-num">图层</div>
        <div class="layer-layout">
          <n-icon
            title="缩略图版"
            class="btn-icon"
            :class="{ selected: !showText }"
            @click="showText = false"
          >
            <IconViewGrid />
          </n-icon>
          <n-icon
            title="文字版"
            class="btn-icon"
            :class="{ selected: showText }"
            @click="showText = true"
          >
            <IconViewList />
          </n-icon>
          <n-icon
            title="收起"
            class="btn-icon"
            @click="changeVisible"
          >
            <IconBack />
          </n-icon>
        </div>
      </div>
      <div class="layer-toolbar layer-toolbar-top">
        <n-icon
          title="上移一层"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          @click="moveCom(MoveType.down)"
        >
          <IconMoveUp />
        </n-icon>
        <n-icon
          title="下移一层"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          @click="moveCom(MoveType.up)"
        >
          <IconMoveDown />
        </n-icon>
        <n-icon
          title="置顶"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          @click="moveCom(MoveType.bottom)"
        >
          <IconMoveTop />
        </n-icon>
        <n-icon
          title="置底"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          @click="moveCom(MoveType.top)"
        >
          <IconMoveBottom />
        </n-icon>
      </div>
      <div class="layer-manager-wrap">
        <LayerManagerWrap>
          <template #default="{ com, idx, level }">
            <layer-manager-item
              :com="com"
              :level="level"
              :show-text="showText"
              :class="{
                selected: com.selected && !isDraging
              }"
              @mouseup="selectCom($event, com)"
              @dragstart="dragStart($event, com)"
              @dragend="dragEnd"
              @dragenter.self="dragEnter($event, idx, level, com)"
              @dragover="dragOver"
              @dragGroup="dragGroup"
            />
          </template>
        </LayerManagerWrap>
        <div class="last-flex-item" @click="cancelSelected"></div>
        <div
          v-if="dragInfo.visible"
          class="layer-move-to-line"
          :style="{
            width: `calc(100% - ${dragInfo.x}px)`,
            transform: `translate(${dragInfo.x}px, ${dragInfo.y}px)`
          }"
        ></div>
        <div class="draging-wrap"></div>
      </div>
      <div class="layer-toolbar layer-toolbar-bottom">
        <n-icon
          title="成组"
          class="toolbar-icon standard"
          :class="enableGroupBtnClass"
          @click="composeComs"
        >
          <IconGroup />
        </n-icon>
        <n-icon
          title="删除"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          @click="confirmDeleteCom"
        >
          <IconDelete />
        </n-icon>
        <n-icon
          title="锁定"
          class="toolbar-icon standard"
          :class="enableLockBtnClass"
          @click="lockCom"
        >
          <IconLock />
        </n-icon>
        <n-icon
          title="隐藏"
          class="toolbar-icon standard"
          :class="enableHideBtnClass"
          @click="hideCom"
        >
          <IconHide />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed } from 'vue'
import { PanelType, useToolbarStore } from '@/store/toolbar'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { MoveType } from '@/domains/editor'
import { DatavComponent } from '@/components/_models/datav-component'
import { macMetaOrCtrl } from '@/utils/util'
import {
  IconViewList,
  IconViewGrid,
  IconBack,
  IconMoveUp,
  IconMoveDown,
  IconMoveTop,
  IconMoveBottom,
  IconLock,
  IconHide,
  IconDelete,
  IconGroup,
} from '@/icons'
import { useContextMenu } from '../editor-context-menu'
import LayerManagerWrap from './layer-manager-wrap.vue'
import LayerManagerItem from './layer-manager-item.vue'

const toolbarStore = useToolbarStore()
const editorStore = useEditorStore()
const comStore = useComStore()
const {
  isLocked,
  isHided,
  disableGroup,
  moveCom,
  lockCom,
  hideCom,
  confirmDeleteCom,
  composeComs,
} = useContextMenu()

const showText = ref(false)
const visiblePanel = computed(() => toolbarStore.layer.show)
const isDraging = ref(false)
const dragInfo = ref({
  visible: false,
  x: 0,
  y: 0,
  toLevel: 0,
  toIndex: 0,
  toCom: null,
  drop: false,
})

const enableBtn = computed(() => comStore.selectedComs.length > 0)
const enableBtnClass = computed(() => {
  return {
    enable: enableBtn.value,
  }
})

const enableLockBtnClass = computed(() => {
  return {
    enable: enableBtn.value,
    checked: isLocked.value,
  }
})

const enableHideBtnClass = computed(() => {
  return {
    enable: enableBtn.value,
    checked: isHided.value,
  }
})

const enableGroupBtnClass = computed(() => {
  return {
    enable: enableBtn.value && !disableGroup.value,
  }
})

const changeVisible = () => {
  toolbarStore.setPanelState(PanelType.layer, !visiblePanel.value)
}

const selectCom = (ev: MouseEvent, com: DatavComponent) => {
  const isMult = macMetaOrCtrl(ev)
  if (ev.shiftKey && !isMult) {
    comStore.selects(com)
  } else if (!com.selected || (ev.button === 0 && (isMult || comStore.selectedComs.length > 1))) {
    comStore.select(com.id, com.parentId, isMult)
  }
}

const cancelSelected = () => {
  comStore.select('')
}

const dragStart = (ev: DragEvent, com: DatavComponent) => {
  if (editorStore.contextMenu.show || com.renameing) {
    ev.preventDefault()
    return false
  }
  isDraging.value = true
  if (com.selected) {
    const nodewp = document.querySelector('.draging-wrap')
    nodewp.innerHTML = ''
    const nodes = document.querySelectorAll('.layer-manager-wrap .selected')
    nodes.forEach(node => {
      nodewp.appendChild(node.cloneNode(true))
    })
    ev.dataTransfer.setDragImage(nodewp, 0, 1)
  } else {
    comStore.select(com.id, com.parentId)
  }
}

const dragEnd = () => {
  isDraging.value = false
  dragInfo.value.visible = false
  dragInfo.value.drop = false
  const info = dragInfo.value
  comStore.moveTo(info.toLevel, info.toIndex, info.toCom)
  const nodewp = document.querySelector('.draging-wrap')
  nodewp.innerHTML = ''
}

const dragEnter = (ev: DragEvent, idx: number, level: number, com: DatavComponent) => {
  if (dragInfo.value.drop) {
    return
  }

  const h = 48
  const top = ev.clientY - 104
  const isHalf = top % h > 24
  const i = isHalf ? Math.ceil(top / h) : Math.floor(top / h)
  dragInfo.value.visible = true
  dragInfo.value.y = (i < 0 ? 0 : i) * h
  dragInfo.value.x = level * 10
  dragInfo.value.toLevel = level
  dragInfo.value.toIndex = isHalf ? idx + 1 : idx
  dragInfo.value.toCom = com
}

const dragOver = (ev: any) => {
  ev.preventDefault()
  ev.stopPropagation()
  ev.dataTransfer.dropEffect = 'copy'
}

const dragGroup = (data: any) => {
  if (data.key === 'enter') {
    dragInfo.value.visible = false
    dragInfo.value.drop = true
  } else if (data.key === 'leave') {
    dragInfo.value.visible = true
    dragInfo.value.drop = false
  } else {
    dragInfo.value.toLevel = data.level
    dragInfo.value.toIndex = 0
    dragInfo.value.toCom = data.com
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
