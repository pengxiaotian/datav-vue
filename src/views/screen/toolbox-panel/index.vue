<template>
  <div :class="['toolbox-panel-wp', { '--hide': !visiblePanel }]">
    <div class="toolbox-panel">
      <div class="btn-box">
        <span class="btn-text">组件缩放</span>
        <el-tooltip placement="bottom" effect="blue">
          <template #content>
            勾选时为自然模式，否则为拉伸模式，默认勾选
          </template>
          <i class="v-icon-help"></i>
        </el-tooltip>
        <el-checkbox
          :model-value="isNormal"
          class="btn-sw"
          @update:model-value="handleResizeModeChange"
        />
      </div>
      <div class="btn-box">
        <span class="btn-text">参考线</span>
        <el-switch v-model="referLine.enable" class="btn-sw" />
      </div>
      <div class="btn-box">
        <span class="btn-text">对齐线</span>
        <el-tooltip placement="bottom" effect="blue">
          <template #content>
            组件数量多时，容易卡顿，建议关闭
          </template>
          <i class="v-icon-help"></i>
        </el-tooltip>
        <el-switch v-model="alignLine.enable" class="btn-sw" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'

export default defineComponent({
  name: 'ToolboxPanel',
  setup() {
    const visiblePanel = computed(() => ToolbarModule.toolbox.show)
    const isNormal = ref(EditorModule.isNormalResizeMode)
    const referLine = computed(() => EditorModule.referLine)
    const alignLine = computed(() => EditorModule.alignLine)

    const handleResizeModeChange = (val: boolean) => {
      isNormal.value = val
      EditorModule.changeResizeMode(val)
    }

    return {
      visiblePanel,
      isNormal,
      referLine,
      alignLine,
      handleResizeModeChange,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

.toolbox-panel-wp {
  height: 40px;
  z-index: 10;
  transition: height 0.3s ease;
  border-bottom: $border-dark;
  flex-shrink: 0;

  &.--hide {
    height: 0;
    overflow: hidden;
    border-bottom: none;
  }
}

.toolbox-panel {
  transition: 0.3s ease;
  width: 100%;
  background: $config-manager-bgcolor;
  padding: 8px 30px;
  display: flex;
  align-items: center;
  height: 100%;
}

.btn-box {
  display: flex;
  align-items: center;
  height: 28px;
  line-height: 28px;
  margin-right: 20px;
  color: $footer-color;

  .btn-text {
    margin-right: 2px;
  }

  .btn-sw {
    margin-left: 3px;
  }
}
</style>
