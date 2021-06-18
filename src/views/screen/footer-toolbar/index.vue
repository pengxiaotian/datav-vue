<template>
  <el-footer height="32px" class="bottom-sider">
    <el-popover
      width="235"
      placement="top"
      trigger="hover"
      popper-class="editor-popover"
    >
      <template #reference>
        <i class="v-icon-keyboard shortcut-btn"></i>
      </template>
      <div class="shortcut-wp">
        <div class="shortcut-item">
          <div class="shortcut-title">开关图层面板</div>
          <div class="shortcut-value">Ctrl/Cmd + ←</div>
        </div>
        <div class="shortcut-item">
          <div class="shortcut-title">切换组件面板</div>
          <div class="shortcut-value">Ctrl/Cmd + ↑</div>
        </div>
        <div class="shortcut-item">
          <div class="shortcut-title">切换右侧面板</div>
          <div class="shortcut-value">Ctrl/Cmd + →</div>
        </div>
        <div class="shortcut-item">
          <div class="shortcut-title">画布缩放到最佳位置</div>
          <div class="shortcut-value">Ctrl/Cmd + a</div>
        </div>
      </div>
    </el-popover>
    <div class="scale-input-wp">
      <input
        v-model="inputScale"
        type="number"
        class="scale-input"
        @keydown.enter="submitScale(0)"
      >
      <span class="percent">%</span>
      <el-popover
        :visible="visibleScaleList"
        width="56"
        placement="top"
        trigger="click"
        popper-class="editor-popover"
        :show-arrow="false"
      >
        <div class="scale-value-list">
          <div
            v-for="s in scaleList"
            :key="s"
            class="scale-value-item"
            @click="submitScale(s)"
          >
            {{ `${s}%` }}
          </div>
          <div class="scale-value-item" @click="submitScale(-1)">自适应</div>
        </div>
        <template #reference>
          <i class="el-icon-arrow-down open-icon" @click.stop="showScaleList"></i>
        </template>
      </el-popover>
    </div>
    <div class="scale-slider-wp">
      <el-slider
        v-model="scale"
        :min="20"
        :max="200"
        :step="5"
        :show-tooltip="false"
        @change="submitScale"
      />
    </div>
  </el-footer>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue'
import { isMac } from '@/utils/util'
import { PanelType, ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'

export default defineComponent({
  name: 'FooterToolbar',
  setup() {
    const scaleList = ref([200, 150, 100, 50])
    const scale = ref(20)
    const inputScale = ref(20)
    const visibleScaleList = ref(false)
    const useSlider = ref(false)

    const hideScaleList = () => {
      visibleScaleList.value = false
      document.removeEventListener('click', hideScaleList, false)
    }

    const showScaleList = () => {
      visibleScaleList.value = true
      document.addEventListener('click', hideScaleList, false)
    }

    const getPanelOffset = () => ({
      offsetX: ToolbarModule.getPanelOffsetX,
      offsetY: ToolbarModule.getPanelOffsetY,
    })

    const submitScale = async (val: number) => {
      if (val === -1) {
        EditorModule.autoCanvasScale(getPanelOffset)
      } else {
        EditorModule.setCanvasScale({
          scale: val === 0 ? inputScale.value : val,
          ...getPanelOffset(),
        })
      }

      hideScaleList()
    }

    watch(
      () => EditorModule.canvas.scale,
      s => {
        const val = parseInt((s * 100).toFixed(2))
        scale.value = val
        inputScale.value = val
      },
    )

    const addShortcuts = (ev: KeyboardEvent) => {
      const target = ev.target as HTMLElement
      if (!['input','textarea'].includes(target.tagName.toLowerCase())) {
        const ismac = isMac()
        if ((!ismac && ev.ctrlKey) || (ismac && ev.metaKey)) {
          const key = ev.key.toLowerCase()
          const { setPanelState } = ToolbarModule
          if (key === 'arrowleft') {
            setPanelState({ type: PanelType.layer, value: !ToolbarModule.layer.show })
          } else if (key === 'arrowup') {
            setPanelState({ type: PanelType.components, value: !ToolbarModule.components.show })
          } else if (key === 'arrowright') {
            setPanelState({ type: PanelType.config, value: !ToolbarModule.config.show })
          } else if (key === 'a') {
            EditorModule.autoCanvasScale(getPanelOffset)
          }

          ev.preventDefault()
        }
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', addShortcuts, false)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', addShortcuts, false)
    })

    return {
      scaleList,
      scale,
      inputScale,
      visibleScaleList,
      showScaleList,
      useSlider,
      submitScale,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

.bottom-sider {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  width: 100%;
  height: 32px;
  background: $footer-bgcolor;
  box-shadow: 0 -1px $shadow-color;
  user-select: none;
  align-items: center;
  justify-content: flex-end;

  .shortcut-btn {
    margin-right: 20px;
    font-size: 18px;
    color: $footer-color;
    cursor: pointer;
  }

  .scale-input-wp {
    position: relative;
    display: block;
    width: 58px;
    height: 20px;
    line-height: 18px;
    margin-right: 20px;
    overflow: hidden;
    cursor: pointer;
    background: $color-dark;
    border: $border-outline;

    .scale-input {
      width: 27px;
      padding-left: 5px;
      font-size: 12px;
      color: $footer-color;
      text-align: right;
      background: transparent;
      caret-color: $footer-color;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        margin: 0;
        -webkit-appearance: none;
      }
    }

    .percent {
      margin-left: 1px;
      color: $footer-color;
    }

    .open-icon {
      position: absolute;
      top: -7px;
      right: -9px;
      padding: 10px;
      font-weight: bold;
      color: $footer-color;
      transform: scale(0.7);
    }
  }

  .scale-slider-wp {
    width: 190px;
  }
}

.shortcut-wp {
  position: relative;
  padding: 5px 10px;
  font-size: 12px;
  background: $background-color-secondary;
  box-shadow: $shadow-secondary;
  user-select: none;

  .shortcut-item {
    display: flex;
    margin: 5px 0;
    justify-content: space-between;
    align-items: center;
  }

  .shortcut-title {
    padding-right: 15px;
    color: $footer-color;
  }

  .shortcut-value {
    padding: 4px 6px;
    font-weight: 700;
    color: $footer-shortcut-color;
    background: $footer-shortcut-bgcolor;
    border-radius: 2px;
  }
}

.scale-value-list {
  font-size: 12px;
  background: $footer-shortcut-bgcolor;
  border: $border-outline;
  user-select: none;

  .scale-value-item {
    width: 54px;
    padding: 5px 0;
    color: $footer-color;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      color: $hover-color;
      background: $footer-shortcut-color-hover;
    }

    &:not(:first-child) {
      border-top: $border-outline;
    }
  }
}
</style>
