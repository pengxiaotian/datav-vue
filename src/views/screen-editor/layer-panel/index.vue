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
          :style="enableBtnStyle"
          @click="moveUp"
        >
          <IconMoveUp />
        </n-icon>
        <n-icon
          title="下移一层"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveDown"
        >
          <IconMoveDown />
        </n-icon>
        <n-icon
          title="置顶"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveTop"
        >
          <IconMoveTop />
        </n-icon>
        <n-icon
          title="置底"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveBottom"
        >
          <IconMoveBottom />
        </n-icon>
      </div>
      <div class="layer-manager-wrap">
        <template v-for="com in descComs" :key="com.id">
          <div
            v-if="showText"
            :title="com.alias"
            class="layer-manager-item"
            :class="[{
              hided: com.hided,
              locked: com.locked,
              hovered: com.hovered,
              selected: com.selected
            }]"
            @mousedown="selectCom(com.id)"
            @mouseenter="com.hovered = true"
            @mouseleave="com.hovered = false"
            @contextmenu="showMenu"
          >
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
              <span class="layer-item-text">{{ com.alias }}</span>
            </span>
            <n-icon
              v-if="com.hided"
              class="show-toggle-btn"
              @click="com.hided = false"
            >
              <IconHide />
            </n-icon>
            <n-icon
              v-if="com.locked"
              class="show-toggle-btn"
              @click="com.locked = false"
            >
              <IconLock />
            </n-icon>
          </div>
          <div
            v-else
            :title="com.alias"
            class="layer-manager-item thumbail-wrap"
            :class="[{
              hided: com.hided,
              locked: com.locked,
              hovered: com.hovered,
              selected: com.selected
            }]"
            @mousedown="selectCom(com.id)"
            @mouseenter="com.hovered = true"
            @mouseleave="com.hovered = false"
            @contextmenu="showMenu"
          >
            <div
              class="layer-item-thumbail"
              :alt="com.alias"
              :style="`background-image: url(${com.img})`"
            >
            </div>
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
                <span class="layer-item-text">{{ com.alias }}</span>
              </span>
            </div>
            <div class="layer-thumbail-item">
              <n-icon
                v-if="com.hided"
                class="show-toggle-btn"
                @click="com.hided = false"
              >
                <IconHide />
              </n-icon>
              <n-icon
                v-if="com.locked"
                class="show-toggle-btn"
                @click="com.locked = false"
              >
                <IconLock />
              </n-icon>
            </div>
          </div>
        </template>
        <div class="last-flex-item" @click="selectCom('')"></div>
      </div>
      <div class="layer-toolbar layer-toolbar-bottom">
        <n-icon
          title="删除"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="toDeleteCom"
        >
          <IconDelete />
        </n-icon>
        <n-icon
          title="锁定"
          class="toolbar-icon standard"
          :class="enableLockBtnClass"
          :style="enableBtnStyle"
          @click="lockCom"
        >
          <IconLock />
        </n-icon>
        <n-icon
          title="隐藏"
          class="toolbar-icon standard"
          :class="enableHideBtnClass"
          :style="enableBtnStyle"
          @click="hideCom"
        >
          <IconHide />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { h, defineComponent, ref, computed } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { PanelType, useToolbarStore } from '@/store/toolbar'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { MoveType } from '@/domains/editor'
import {
  IconViewList,
  IconViewGrid,
  IconBack,
  IconWarning,
  IconMoveUp,
  IconMoveDown,
  IconMoveTop,
  IconMoveBottom,
  IconLock,
  IconHide,
  IconDelete,
} from '@/icons'
import { useContextMenu } from '../editor-context-menu/index'

export default defineComponent({
  name: 'LayerPanel',
  components:{
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
  },
  setup() {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const toolbarStore = useToolbarStore()
    const editorStore = useEditorStore()
    const comStore = useComStore()

    const showText = ref(false)
    const visiblePanel = computed(() => toolbarStore.layer.show)
    const descComs = computed(() => [...comStore.coms].reverse())
    const selectedCom = computed(() => comStore.selectedCom)

    const enableBtnClass = computed(() => !!selectedCom.value)
    const enableLockBtnClass = computed(() => {
      return {
        enable: !!selectedCom.value,
        checked: selectedCom.value?.locked,
      }
    })
    const enableHideBtnClass = computed(() => {
      return {
        enable: !!selectedCom.value,
        checked: selectedCom.value?.hided,
      }
    })

    const enableBtnStyle = computed(() => {
      return {
        opacity: selectedCom.value ? 1 : 0.3,
      }
    })

    const changeVisible = () => {
      toolbarStore.setPanelState(PanelType.layer, !visiblePanel.value)
    }

    const selectCom = (id: string) => {
      comStore.selectCom(id)
    }

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

    const { showMenu } = useContextMenu()


    return {
      showText,
      visiblePanel,
      descComs,
      enableBtnClass,
      enableLockBtnClass,
      enableHideBtnClass,
      enableBtnStyle,
      changeVisible,
      selectCom,
      moveUp,
      moveDown,
      moveTop,
      moveBottom,
      lockCom,
      hideCom,
      toDeleteCom,
      showMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style';
</style>
