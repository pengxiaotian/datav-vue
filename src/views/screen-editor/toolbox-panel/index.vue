<template>
  <div :class="['toolbox-panel-wp', { '--hide': !visiblePanel }]">
    <div class="toolbox-panel">
      <el-popover
        v-model:visible="visibleFilterPanel"
        width="320"
        placement="bottom-start"
        trigger="manual"
        :show-arrow="false"
        :offset="5"
        popper-class="editor-popover"
      >
        <template #reference>
          <div class="btn-box" @click.stop>
            <span class="btn-text --label" @click="toggleFilterPanel">滤镜配置</span>
            <el-switch v-model="styleFilterParams.enable" />
          </div>
        </template>
        <filter-toolbox-panel :style-filter-params="styleFilterParams" />
      </el-popover>
      <div class="btn-box">
        <el-tooltip
          placement="bottom"
          effect="blue"
          content="勾选时为自然模式，否则为拉伸模式，默认勾选"
        >
          <span class="btn-text --help">组件缩放</span>
        </el-tooltip>
        <el-checkbox
          :model-value="isNormal"
          @update:model-value="handleResizeModeChange"
        />
      </div>
      <div class="btn-box">
        <span class="btn-text">参考线</span>
        <el-switch v-model="referLine.enable" />
      </div>
      <div class="btn-box">
        <el-tooltip
          placement="bottom"
          effect="blue"
          content="组件数量多时，容易卡顿，建议关闭"
        >
          <span class="btn-text --help">对齐线</span>
        </el-tooltip>
        <el-switch v-model="alignLine.enable" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import { MessageUtil } from '@/utils/message-util'
import FilterToolboxPanel from './filter-toolbox-panel.vue'

export default defineComponent({
  name: 'ToolboxPanel',
  components: {
    FilterToolboxPanel,
  },
  setup() {
    const visiblePanel = computed(() => ToolbarModule.toolbox.show)
    const isNormal = ref(EditorModule.isNormalResizeMode)
    const referLine = computed(() => EditorModule.referLine)
    const alignLine = computed(() => EditorModule.alignLine)
    const visibleFilterPanel = ref(false)
    const styleFilterParams = computed(() => EditorModule.pageConfig.styleFilterParams)

    const toggleFilterPanel = () => {
      visibleFilterPanel.value = !visibleFilterPanel.value
    }

    const hideFilterPanel = () => {
      visibleFilterPanel.value = false
      document.removeEventListener('click', hideFilterPanel)
    }

    const handleResizeModeChange = (val: boolean) => {
      isNormal.value = val
      EditorModule.changeResizeMode(val)
    }

    watch(() => styleFilterParams.value.enable, (nv: boolean) => {
      visibleFilterPanel.value = nv
      MessageUtil.success(nv ? '滤镜已开启应用' : '滤镜已关闭')
    })

    watch(() => visibleFilterPanel.value, (nv: boolean) => {
      if (nv) {
        document.addEventListener('click', hideFilterPanel)
      }
    })

    return {
      visiblePanel,
      isNormal,
      referLine,
      alignLine,
      visibleFilterPanel,
      styleFilterParams,
      toggleFilterPanel,
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
  margin-right: 15px;
  color: $footer-color;

  .btn-text {
    margin-right: 4px;

    &.--help {
      cursor: help;
      text-decoration: underline dotted;
    }

    &.--label {
      cursor: pointer;

      &:hover {
        color: #4283ff;
        border-bottom: 1px solid #4283ff;
      }
    }
  }
}
</style>
