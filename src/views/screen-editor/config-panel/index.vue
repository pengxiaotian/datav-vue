<template>
  <el-aside width="auto" :class="['config-panel-wp', { '--hide': !visiblePanel }]">
    <div class="config-manager">
      <page-config v-if="!selectedCom" />
      <el-tabs v-else type="card" :stretch="true">
        <el-tab-pane>
          <template #label>
            <el-tooltip effect="blue" :open-delay="500" content="配置">
              <n-icon>
                <IconSetting />
              </n-icon>
            </el-tooltip>
          </template>
          <setting-panel :key="selectedCom.id" />
        </el-tab-pane>
        <el-tab-pane lazy>
          <template #label>
            <el-tooltip effect="blue" :open-delay="500" content="数据">
              <n-icon>
                <IconCloud />
              </n-icon>
            </el-tooltip>
          </template>
          <data-center-panel :key="selectedCom.id" />
        </el-tab-pane>
        <el-tab-pane lazy>
          <template #label>
            <el-tooltip effect="blue" :open-delay="500" content="交互">
              <n-icon>
                <IconInteract />
              </n-icon>
            </el-tooltip>
          </template>
          <interaction-panel :key="selectedCom.id" />
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
import { IconSetting, IconCloud, IconInteract } from '@/icons'

export default defineComponent({
  name: 'ConfigPanel',
  components: {
    PageConfig: loadAsyncComponent(() => import('./page-config.vue')),
    SettingPanel: loadAsyncComponent(() => import('./setting-panel.vue')),
    DataCenterPanel: loadAsyncComponent(() => import('./data-center-panel/index.vue')),
    InteractionPanel: loadAsyncComponent(() => import('./interaction-panel/index.vue')),
    IconSetting,
    IconCloud,
    IconInteract,
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
$panel_width: 332px;

.config-panel-wp {
  position: relative;
  z-index: 90;
  width: $panel_width !important;
  height: 100%;
  overflow: hidden;
  background: #1c1f25;
  box-shadow: -1px 0 #000;
  transition: width 0.25s ease-in-out;
}

.config-manager {
  width: $panel_width;
  height: 100%;
  background: var(--datav-left-nav-bg);
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
