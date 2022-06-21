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
          @click="moveCom(MoveType.up)"
        >
          <IconMoveUp />
        </n-icon>
        <n-icon
          title="下移一层"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          @click="moveCom(MoveType.down)"
        >
          <IconMoveDown />
        </n-icon>
        <n-icon
          title="置顶"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          @click="moveCom(MoveType.top)"
        >
          <IconMoveTop />
        </n-icon>
        <n-icon
          title="置底"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          @click="moveCom(MoveType.bottom)"
        >
          <IconMoveBottom />
        </n-icon>
      </div>
      <div class="layer-manager-wrap">
        <template v-for="(com, idx) in descComs" :key="com.id">
          <div
            :title="com.alias"
            class="layer-manager-item"
            :class="[{
              'thumbail-wrap': !showText,
              hided: com.hided,
              locked: com.locked,
              hovered: !com.selected && com.hovered,
              selected: com.selected && !isDraging
            }]"
            draggable="true"
            @mouseup="selectCom($event, com)"
            @mouseenter="com.hovered = true"
            @mouseleave="com.hovered = false"
            @contextmenu="showMenu($event, com)"
            @dragstart="dragStart($event, com)"
            @dragend="dragEnd"
            @dragenter.self="dragEnter($event, idx)"
            @dragover="dragOver"
          >
            <template v-if="showText">
              <g-com-icon :icon="com.icon" />
              <input
                v-if="com.renameing"
                v-model.trim="com.alias"
                v-focus
                class="layer-item-input"
                @blur="com.renameing = false"
                @keydown.enter="com.renameing = false"
              >
              <span v-else class="layer-item-span">
                <span class="layer-item-text" @dblclick="com.renameing = true">
                  {{ com.alias }}
                </span>
              </span>
              <n-icon v-if="com.hided" class="show-toggle-btn" @click="com.hided = false">
                <IconHide />
              </n-icon>
              <n-icon v-if="com.locked" class="show-toggle-btn" @click="com.locked = false">
                <IconLock />
              </n-icon>
            </template>
            <template v-else>
              <div
                class="layer-item-thumbail"
                :alt="com.alias"
                :style="`background-image: url(${com.img})`"
              ></div>
              <div class="layer-manager-thumbail">
                <input
                  v-if="com.renameing"
                  v-model.trim="com.alias"
                  v-focus
                  class="layer-item-input"
                  @blur="com.renameing = false"
                  @keydown.enter="com.renameing = false"
                >
                <span v-else class="layer-item-span">
                  <span class="layer-item-text" @dblclick="com.renameing = true">
                    {{ com.alias }}
                  </span>
                </span>
              </div>
              <div class="layer-thumbail-item">
                <n-icon v-if="com.hided" class="show-toggle-btn" @click="com.hided = false">
                  <IconHide />
                </n-icon>
                <n-icon v-if="com.locked" class="show-toggle-btn" @click="com.locked = false">
                  <IconLock />
                </n-icon>
              </div>
            </template>
          </div>
        </template>
        <div class="last-flex-item" @click="cancelSelected"></div>
        <div
          v-if="dragInfo.visible"
          class="layer-move-to-line"
          :style="`transform: translate(${dragInfo.x}px, ${dragInfo.y}px);`"
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
import { useContextMenu } from '../editor-context-menu/index'

const toolbarStore = useToolbarStore()
const editorStore = useEditorStore()
const comStore = useComStore()
const {
  isLocked,
  isHided,
  disableGroup,
  showMenu,
  moveCom,
  lockCom,
  hideCom,
  confirmDeleteCom,
  composeComs,
} = useContextMenu()

const showText = ref(false)
const visiblePanel = computed(() => toolbarStore.layer.show)
const descComs = computed(() => [...comStore.coms].reverse())
const isDraging = ref(false)
const dragInfo = ref({
  visible: false,
  x: 0,
  y: 0,
  from: 0,
  to: 0,
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
    comStore.select(com.id, isMult)
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
    comStore.select(com.id)
  }
}

const moveToIndex = ref(-1)

const dragEnd = () => {
  isDraging.value = false
  dragInfo.value.visible = false
  comStore.moveTo(moveToIndex.value)
  const nodewp = document.querySelector('.draging-wrap')
  nodewp.innerHTML = ''
}

const dragEnter = (ev: any, idx: number) => {
  dragInfo.value.visible = true
  const top = ev.clientY - 104
  const i = top % 48 > 24 ? idx + 1 : idx
  dragInfo.value.y = i * 48
  moveToIndex.value = descComs.value.length - i
}

const dragOver = (ev: any) => {
  ev.preventDefault()
  ev.stopPropagation()
  ev.dataTransfer.dropEffect = 'copy'
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
