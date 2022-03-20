<template>
  <div :class="['g-aside config-panel-wp', { '--hide': !visiblePanel }]">
    <div class="config-manager">
      <page-config v-if="!selectedCom" />
      <n-tabs v-else type="card" display-directive="show:lazy">
        <n-tab-pane name="config">
          <template #tab>
            <n-tooltip :delay="500">
              <template #trigger>
                <n-icon>
                  <IconSetting />
                </n-icon>
              </template>
              配置
            </n-tooltip>
          </template>
          <setting-panel :key="selectedCom.id" />
        </n-tab-pane>
        <n-tab-pane name="data" display-directive="show:lazy">
          <template #tab>
            <n-tooltip :delay="500">
              <template #trigger>
                <n-icon>
                  <IconCloud />
                </n-icon>
              </template>
              数据
            </n-tooltip>
          </template>
          <data-center-panel :key="selectedCom.id" />
        </n-tab-pane>
        <n-tab-pane name="interaction" display-directive="show:lazy">
          <template #tab>
            <n-tooltip :delay="500">
              <template #trigger>
                <n-icon>
                  <IconInteract />
                </n-icon>
              </template>
              交互
            </n-tooltip>
          </template>
          <interaction-panel :key="selectedCom.id" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, provide } from 'vue'
import { useToolbarStore } from '@/store/toolbar'
import { useComStore } from '@/store/com'
import { loadAsyncComponent } from '@/utils/async-component'
import { IconSetting, IconCloud, IconInteract } from '@/icons'
import { comInjectionKey } from './config'

export default defineComponent({
  name: 'ConfigPanel',
  components: {
    IconSetting,
    IconCloud,
    IconInteract,
    PageConfig: loadAsyncComponent(() => import('./page-config.vue')),
    SettingPanel: loadAsyncComponent(() => import('./setting-panel.vue')),
    DataCenterPanel: loadAsyncComponent(() => import('./data-center-panel/index.vue')),
    InteractionPanel: loadAsyncComponent(() => import('./interaction-panel/index.vue')),
  },
  setup() {
    const toolbarStore = useToolbarStore()
    const comStore = useComStore()
    const visiblePanel = computed(() => toolbarStore.config.show)
    const selectedCom = computed(() => comStore.selectedCom)

    provide(comInjectionKey, selectedCom)

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
  background: var(--datav-config-bg);
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
