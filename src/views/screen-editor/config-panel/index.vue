<template>
  <el-aside width="auto" :class="['config-panel-wp', { '--hide': !visiblePanel }]">
    <div class="config-manager">
      <page-config v-if="!selectedCom" />
      <el-tabs v-else type="card" :stretch="true">
        <el-tab-pane>
          <template #label>
            <el-tooltip effect="blue" :open-delay="500" content="配置">
              <i class="v-icon-setting"></i>
            </el-tooltip>
          </template>
          <setting-panel />
        </el-tab-pane>
        <el-tab-pane lazy>
          <template #label>
            <el-tooltip effect="blue" :open-delay="500" content="数据">
              <i class="v-icon-cloud"></i>
            </el-tooltip>
          </template>
          <data-center-panel />
        </el-tab-pane>
        <el-tab-pane lazy>
          <template #label>
            <el-tooltip effect="blue" :open-delay="500" content="交互">
              <i class="v-icon-interact"></i>
            </el-tooltip>
          </template>
          <interaction-panel />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-aside>
</template>

<script lang='ts'>
import { defineComponent, computed, provide } from 'vue'
import { ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import { loadAsyncComponent } from '@/utils/async-component'
import PageConfig from './page-config.vue'

export default defineComponent({
  name: 'ConfigPanel',
  components: {
    PageConfig,
    SettingPanel: loadAsyncComponent(() => import('./setting-panel.vue')),
    DataCenterPanel: loadAsyncComponent(() => import('./data-center-panel/index.vue')),
    InteractionPanel: loadAsyncComponent(() => import('./interaction-panel/index.vue')),
  },
  setup() {
    const visiblePanel = computed(() => ToolbarModule.config.show)
    const selectedCom = computed(() => EditorModule.selectedCom)

    provide('com', selectedCom)

    return {
      visiblePanel,
      selectedCom,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

$panel_width: 332px;

.config-panel-wp {
  position: relative;
  z-index: 90;
  width: $panel_width !important;
  height: 100%;
  overflow: hidden;
  background: $config-panel-bgcolor;
  box-shadow: -1px 0 #000;
  transition: width 0.25s ease-in-out;
}

.config-manager {
  width: $panel_width;
  height: 100%;
  background: $config-manager-bgcolor;
  transition: 0.25s ease-in-out;
  user-select: none;

  ::-webkit-scrollbar {
    display: none;
  }
}

.config-panel-wp.--hide {
  width: 0 !important;

  .config-manager {
    transform: translateX(-100%);
  }
}
</style>
