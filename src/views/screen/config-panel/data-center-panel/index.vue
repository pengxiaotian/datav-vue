<template>
  <div class="data-center-panel">
    <config-title :com-name="com.name" :com-alias="com.alias" />
    <div class="scroll-container">
      <template v-if="dataKeys.length > 0">
        数据
      </template>
      <empty-panel v-else content="该组件不需要配置数据" />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import ConfigTitle from '../components/config-title.vue'
import EmptyPanel from '../components/empty-panel.vue'

export default defineComponent({
  name: 'DataCenterPanel',
  components: {
    ConfigTitle,
    EmptyPanel,
  },
  props: {
    com: {
      type: Object as PropType<DatavComponent>,
      required: true,
    },
  },
  setup(props) {
    const dataKeys = computed(() => {
      return Object.keys(props.com.data)
    })

    return {
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
  top: 61px;
  bottom: 0;
  width: 100%;
  padding-bottom: 30px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
