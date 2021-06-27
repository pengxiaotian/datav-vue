<template>
  <el-drawer
    v-model="visible"
    custom-class="filter-manager-drawer"
    size="500px"
    direction="ltr"
    @close="close"
  >
    <template #title>
      <p class="filter-manager-title">
        数据过滤器<span class="create-filter">新建</span>
        <router-link
          :to="{ name: 'MyCase' }"
          target="_blank"
          rel="noopener noreferrer"
          class="filter-doc"
        >
          <i class="el-icon-document"></i><span>帮助文档</span>
        </router-link>
      </p>
    </template>
    <template v-if="visible">
      filter-manager-drawer
    </template>
  </el-drawer>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue'
import { ToolbarModule } from '@/store/modules/toolbar'

export default defineComponent({
  name: 'FilterManagerDrawer',
  components: {
  },
  setup() {
    const visible = ref(false)

    watch(() => ToolbarModule.filter.show, (nv: boolean) => {
      visible.value = nv
    })

    const close = () => {
      ToolbarModule.filter.show = false
    }

    return {
      visible,
      close,
    }
  },
})
</script>

<style lang="scss">
@import './filter-manager-drawer.scss';
</style>
