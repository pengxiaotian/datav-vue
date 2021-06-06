<template>
  <div class="data-center-panel">
    <config-title :com-name="com.name" :com-alias="com.alias" />
    <div class="scroll-container">
      <template v-if="dataKeys.length > 0">
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
import { defineComponent, ref, computed, ComputedRef, provide, inject } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import { loadAsyncComponent } from '@/utils/async-component'
import ConfigTitle from '../components/config-title.vue'
import EmptyPanel from '../components/empty-panel.vue'

export default defineComponent({
  name: 'DataCenterPanel',
  components: {
    ConfigTitle,
    EmptyPanel,
    SourcePanel: loadAsyncComponent(() => import('./source-panel.vue')),
  },
  setup() {
    const com = inject('com') as ComputedRef<DatavComponent>

    const dataKeys = computed(() => {
      return Object.keys(com.value.apis)
    })

    const activeName = ref(dataKeys.value[0])

    provide('changePanel', (panelName: string) => {
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
@import '~@/styles/themes/var';

.data-center-panel {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.scroll-container {
  position: absolute;
  top: 60px;
  bottom: 60px;
  width: 100%;
  padding-bottom: 30px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
