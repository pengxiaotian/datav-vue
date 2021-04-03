<template>
  <el-aside width="auto" :class="['layer-panel-wp', { '--hide': !layer }]">
    <div class="layer-manager">
      <div class="layer-manager-top">
        <div class="layer-num">图层</div>
        <div class="layer-layout">
          <i
            title="缩略图版"
            class="v-icon-app btn-icon"
            :class="[{ selected: !showText }]"
            @click="showText = false"
          ></i>
          <i
            title="文字版"
            class="v-icon-list btn-icon"
            :class="[{ selected: showText }]"
            @click="showText = true"
          ></i>
          <i class="v-icon-back btn-icon" @click="changeLayerState"></i>
        </div>
      </div>
      <div class="layer-toolbar layer-toolbar-top">
        <i
          title="上移一层"
          class="v-icon-move-up toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveUp"
        ></i>
        <i
          title="下移一层"
          class="v-icon-move-down toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveDown"
        ></i>
        <i
          title="置顶"
          class="v-icon-move-top toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveTop"
        ></i>
        <i
          title="置底"
          class="v-icon-move-bottom toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveBottom"
        ></i>
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
            <i :class="com.icon"></i>
            <input
              v-if="com.renameing"
              v-model.trim="com.alias"
              v-focus
              class="layer-item-input"
              @blur="com.renameing = false"
              @keydown.enter="com.renameing = false"
            >
            <span v-else class="layer-item-span">
              {{ com.alias }}
            </span>
            <i
              v-if="com.hided"
              class="v-icon-hide show-toggle-btn"
              @click="com.hided = false"
            ></i>
            <i
              v-if="com.locked"
              class="v-icon-lock show-toggle-btn"
              @click="com.locked = false"
            ></i>
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
            <img class="layer-item-thumbail" :src="com.img">
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
                {{ com.alias }}
              </span>
            </div>
            <div class="layer-thumbail-item">
              <i
                v-if="com.hided"
                class="v-icon-hide show-toggle-btn"
                @click="com.hided = false"
              ></i>
              <i
                v-if="com.locked"
                class="v-icon-lock show-toggle-btn"
                @click="com.locked = false"
              ></i>
            </div>
          </div>
        </template>
        <div class="last-flex-item" @click="selectCom(0)"></div>
      </div>
      <div class="layer-toolbar layer-toolbar-bottom">
        <i
          title="删除"
          class="v-icon-delete toolbar-icon standard"
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="toDeleteCom"
        ></i>
        <i
          title="锁定"
          class="v-icon-lock toolbar-icon standard"
          :class="enableLockBtnClass"
          :style="enableBtnStyle"
          @click="lockCom"
        ></i>
        <i
          class="v-icon-hide toolbar-icon standard"
          title="隐藏"
          :class="enableHideBtnClass"
          :style="enableBtnStyle"
          @click="hideCom"
        ></i>
      </div>
    </div>
  </el-aside>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import { MoveType } from '@/domains/enums/com-enums'
import { MessageBoxUtil } from '@/utils/message-util'
import { useContextMenu } from '../editor-context-menu/index'

export default defineComponent({
  name: 'LayerPanel',
  setup() {
    const showText = ref(false)
    const layer = computed(() => ToolbarModule.layer.show)
    const coms = computed(() => EditorModule.coms)
    const descComs = computed(() => [...EditorModule.coms].reverse())
    const selectedCom = computed(() => EditorModule.selectedCom)

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

    const changeLayerState = () => {
      ToolbarModule.setPanelState({ type: PanelType.layer, value: !layer.value })
    }

    const selectCom = (id: string) => {
      coms.value.forEach(com => com.selected = com.id === id)
    }

    const moveCom = (moveType: MoveType) => {
      if (selectedCom.value) {
        EditorModule.MOVE_COM_ZINDEX({ id: selectedCom.value.id, moveType })
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
        MessageBoxUtil.confirmAsync(
          '是否删除选中的1个组件',
          () => EditorModule.deleteCom(com),
        )
      }
    }

    const { showMenu } = useContextMenu()


    return {
      showText,
      layer,
      coms,
      descComs,
      enableBtnClass,
      enableLockBtnClass,
      enableHideBtnClass,
      enableBtnStyle,
      changeLayerState,
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
