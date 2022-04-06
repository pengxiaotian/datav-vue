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
          @click="moveCom(MoveType.up)"
        >
          <IconMoveUp />
        </n-icon>
        <n-icon
          title="下移一层"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveCom(MoveType.down)"
        >
          <IconMoveDown />
        </n-icon>
        <n-icon
          title="置顶"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveCom(MoveType.top)"
        >
          <IconMoveTop />
        </n-icon>
        <n-icon
          title="置底"
          class="toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveCom(MoveType.bottom)"
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
            @mousedown="selectCom($event, com.id)"
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
            @mousedown="selectCom($event, com.id)"
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
        <div class="last-flex-item" @click="selectCom($event, '')"></div>
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
import { macMetaOrCtrl } from '@/utils/util'
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
    const { showMenu } = useContextMenu()

    const showText = ref(false)
    const visiblePanel = computed(() => toolbarStore.layer.show)
    const descComs = computed(() => [...comStore.coms].reverse())
    const currCom = computed(() => comStore.selectedCom)

    const enableBtnClass = computed(() => !!currCom.value)
    const enableLockBtnClass = computed(() => {
      return {
        enable: enableBtnClass.value,
        checked: currCom.value?.locked,
      }
    })
    const enableHideBtnClass = computed(() => {
      return {
        enable: enableBtnClass.value,
        checked: currCom.value?.hided,
      }
    })

    const enableBtnStyle = computed(() => {
      return {
        opacity: currCom.value ? 1 : 0.3,
      }
    })

    const changeVisible = () => {
      toolbarStore.setPanelState(PanelType.layer, !visiblePanel.value)
    }

    const selectCom = (ev: MouseEvent, id: string) => {
      const isMult = macMetaOrCtrl(ev)
      if (!isMult && currCom.value.selected) {
        return
      }

      comStore.selectCom(id, isMult)
    }

    const moveCom = (moveType: MoveType) => {
      editorStore.moveCom(currCom.value.id, moveType)
    }

    const lockCom = () => {
      currCom.value.locked = !currCom.value.locked
    }

    const hideCom = () => {
      currCom.value.hided = !currCom.value.hided
    }

    const toDeleteCom = () => {
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

    return {
      MoveType,
      showText,
      visiblePanel,
      descComs,
      enableBtnClass,
      enableLockBtnClass,
      enableHideBtnClass,
      enableBtnStyle,
      changeVisible,
      selectCom,
      moveCom,
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
