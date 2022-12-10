<template>
  <div class="data-center-panel">
    <config-title />
    <div class="scroll-container">
      <template v-if="dataKeys.length > 0">
        <children-manager />
        <source-panel
          v-for="dk in dataKeys"
          :key="dk"
          :api-name="dk"
          :active-name="activeName"
          :collapse="dataKeys.length > 1"
        />
      </template>
      <empty-panel v-else content="该组件不需要配置数据" />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, provide, inject } from 'vue'
import { loadAsyncComponent } from '@/utils/async-component'
import { comInjectionKey, changePanelInjectionKey } from '../config'
import ConfigTitle from '../components/config-title.vue'
import EmptyPanel from '../components/empty-panel.vue'
import ChildrenManager from '../components/children-manager.vue'

export default defineComponent({
  name: 'DataCenterPanel',
  components: {
    ConfigTitle,
    EmptyPanel,
    ChildrenManager,
    SourcePanel: loadAsyncComponent(() => import('./source-panel.vue')),
  },
  setup() {
    const com = inject(comInjectionKey)

    const dataKeys = computed(() => {
      return Object.keys(com.value.apis)
    })

    const activeName = ref(dataKeys.value[0])

    provide(changePanelInjectionKey, (panelName: string) => {
      activeName.value = activeName.value === panelName ? '' : panelName
    })

    return {
      activeName,
      com,
      dataKeys,
    }
  },
})
</script>

<style lang="scss" scoped>
.data-center-panel {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.scroll-container {
  position: absolute;
  top: 60px;
  bottom: 60px;
  width: 100%;
  padding-bottom: 60px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
