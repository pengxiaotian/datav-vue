<template>
  <el-container class="edit-container">
    <el-header style="height: auto; padding: 0;">
      <toolbar />
    </el-header>
    <el-container class="edit-main-wp">
      <layer-panel />
      <el-container class="edit-main">
        <!-- <canvas-main /> -->
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import { defineComponent, computed, onMounted, ref } from 'vue'
import { EditorModule } from '@/store/modules/editor'
import toolbar from './toolbar/index.vue'
import LayerPanel from './layer-panel/index.vue'

export default defineComponent({
  name: 'Screen',
  components: {
    toolbar,
    LayerPanel,
  },
  props: {
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true)

    const screenId = computed(() => {
      return typeof props.projectId === 'string'
        ? parseInt(props.projectId) : props.projectId
    })

    const pageConfig = computed(() => EditorModule.pageConfig)

    onMounted(() => {
      EditorModule.loadScreen(screenId.value)
      EditorModule.loadComs(screenId.value).finally(() => {
        loading.value = false
      })
    })

    return {
      loading,
      screenId,
      pageConfig,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

.edit-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.edit-main-wp {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: hidden;
  background: url('~@/assets/images/bg-canvas.png');
  flex-wrap: nowrap;
}

.edit-main {
  position: relative;
  z-index: 2;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
}
</style>
