<template>
  <el-container class="edit-container">
    <el-header style="height: auto; padding: 0;">
      <toolbar />
    </el-header>
    <el-container class="edit-main-wp">
      <layer-panel />
      <com-list-panel />
      <el-container class="edit-main">
        <canvas-main />
        <footer-toolbar />
      </el-container>
      <config-panel />
    </el-container>
  </el-container>
  <editor-context-menu />
</template>

<script lang='ts'>
import { defineComponent, computed, onMounted, ref } from 'vue'
import { ToolbarModule } from '@/store/modules/toolbar'
import { EditorModule } from '@/store/modules/editor'
import toolbar from './toolbar/index.vue'
import LayerPanel from './layer-panel/index.vue'
import ComListPanel from './com-list-panel/index.vue'
import ConfigPanel from './config-panel/index.vue'
import CanvasMain from './canvas-main/index.vue'
import FooterToolbar from './footer-toolbar/index.vue'
import EditorContextMenu from './editor-context-menu/index.vue'

export default defineComponent({
  name: 'Screen',
  components: {
    toolbar,
    LayerPanel,
    ComListPanel,
    ConfigPanel,
    CanvasMain,
    FooterToolbar,
    EditorContextMenu,
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

    onMounted(() => {
      EditorModule.loadScreen(screenId.value).finally(() => {
        document.title = `${EditorModule.screen.name} | 编辑器`
      })

      EditorModule.loadComs(screenId.value).finally(() => {
        loading.value = false
        EditorModule.autoCanvasScale({
          offsetX: ToolbarModule.getPanelOffsetX,
        })
      })
    })

    return {
      loading,
      screenId,
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
