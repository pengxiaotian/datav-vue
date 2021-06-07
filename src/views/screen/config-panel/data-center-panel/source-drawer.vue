<template>
  <el-drawer
    v-model="visible"
    custom-class="source-drawer"
    size="500px"
  >
    <template #title>
      <p class="source-drawer-title">设置数据源</p>
    </template>
    1
  </el-drawer>
</template>

<script lang='ts'>
import { defineComponent, ref, ComputedRef, inject } from 'vue'
import { DatavComponent } from '@/components/datav-component'

export default defineComponent({
  name: 'SourceDrawer',
  components: {
  },
  setup() {
    const visible = ref(false)
    const com = inject('com') as ComputedRef<DatavComponent>

    const open = () => {
      visible.value = true
    }

    return {
      visible,
      com,
      open,
    }
  },
})
</script>

<style lang="scss">
@import './source-drawer.scss';
</style>
