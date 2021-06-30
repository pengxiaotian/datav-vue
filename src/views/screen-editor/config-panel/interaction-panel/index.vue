<template>
  <div class="interaction-panle">
    <config-title :com-name="com.name" :com-alias="com.alias" />
    <div v-if="eventKeys.length > 0">
      <div class="com-events"></div>
    </div>
    <empty-panel v-else content="该组件没有交互事件" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, ComputedRef, inject } from 'vue'
import { DatavComponent } from '@/components/datav-component'
import ConfigTitle from '../components/config-title.vue'
import EmptyPanel from '../components/empty-panel.vue'

export default defineComponent({
  name: 'InteractionPanel',
  components: {
    ConfigTitle,
    EmptyPanel,
  },
  setup() {
    const com = inject('com') as ComputedRef<DatavComponent>

    const eventKeys = computed(() => {
      return Object.keys(com.value.events)
    })

    return {
      com,
      eventKeys,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

.interaction-panle {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
