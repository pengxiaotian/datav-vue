<template>
  <div :class="['toolbox-panel-wp', { '--hide': !visiblePanel }]">
    <div class="toolbox-panel">
      <n-popover
        :show="visibleFilterPanel"
        :width="320"
        placement="bottom-start"
        trigger="manual"
        :show-arrow="false"
        raw
        :style="{
          '--n-color': 'var(--datav-component-bg)',
        }"
      >
        <template #trigger>
          <div class="btn-box" @click.stop>
            <span class="btn-text --label" @click="toggleFilterPanel">滤镜配置</span>
            <n-switch v-model:value="styleFilterParams.enable" />
          </div>
        </template>
        <filter-toolbox-panel :style-filter-params="styleFilterParams" />
      </n-popover>
      <div class="btn-box">
        <n-tooltip placement="bottom">
          <template #trigger>
            <span class="btn-text --help">组件缩放</span>
          </template>
          勾选或选中多个组件时为自然模式，否则为拉伸模式，默认勾选
        </n-tooltip>
        <n-checkbox
          :checked="isNormal"
          @update:checked="handleResizeModeChange"
        />
      </div>
      <div class="btn-box">
        <span class="btn-text">参考线</span>
        <n-switch v-model:value="referLine.enable" />
      </div>
      <div class="btn-box">
        <n-tooltip placement="bottom">
          <template #trigger>
            <span class="btn-text --help">对齐线</span>
          </template>
          组件数量多时，容易卡顿，建议关闭
        </n-tooltip>
        <n-switch v-model:value="alignLine.enable" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { useToolbarStore } from '@/store/toolbar'
import { useEditorStore } from '@/store/editor'
import FilterToolboxPanel from './filter-toolbox-panel.vue'

export default defineComponent({
  name: 'ToolboxPanel',
  components: {
    FilterToolboxPanel,
  },
  setup() {
    const nMessage = useMessage()
    const toolbarStore = useToolbarStore()
    const editorStore = useEditorStore()

    const isNormal = ref(editorStore.isNormalResizeMode)
    const visibleFilterPanel = ref(false)
    const visiblePanel = computed(() => toolbarStore.toolbox.show)
    const referLine = computed(() => editorStore.referLine)
    const alignLine = computed(() => editorStore.alignLine)
    const styleFilterParams = computed(() => editorStore.pageConfig.styleFilterParams)

    const toggleFilterPanel = () => {
      visibleFilterPanel.value = !visibleFilterPanel.value
    }

    const hideFilterPanel = () => {
      visibleFilterPanel.value = false
      document.removeEventListener('click', hideFilterPanel)
    }

    const handleResizeModeChange = (val: boolean) => {
      isNormal.value = val
      editorStore.isNormalResizeMode = val
    }

    watch(() => styleFilterParams.value.enable, (nv: boolean) => {
      visibleFilterPanel.value = nv
      nMessage.success(nv ? '滤镜已开启应用' : '滤镜已关闭')
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
.toolbox-panel-wp {
  height: 40px;
  z-index: 10;
  transition: height 0.3s ease;
  border-bottom: var(--datav-border-dark);
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
  background: var(--datav-left-nav-bg);
  padding: 8px 30px;
  display: flex;
  align-items: center;
  height: 100%;
}

.btn-box {
  display: flex;
  align-items: center;
  margin-right: 15px;
  color: var(--datav-font-color);

  .btn-text {
    margin-right: 4px;

    &.--help {
      cursor: help;
      text-decoration: underline dotted;
    }

    &.--label {
      cursor: pointer;
      border-bottom: 1px solid #0000;

      &:hover {
        color: var(--datav-main-hover-color);
        border-bottom-color: var(--datav-main-hover-color);
      }
    }
  }
}
</style>
