<template>
  <el-container class="edit-container">
    <el-header style="height: auto; padding: 0;">
      <header-toolbar />
    </el-header>
    <el-container class="edit-main-wp">
      <layer-panel />
      <components-panel />
      <el-container class="edit-main">
        <toolbox-panel />
        <g-loading :spinning="loading">
          <canvas-main />
        </g-loading>
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
import { useMock } from '@/data/mock'
import { loadAsyncComponent } from '@/utils/async-component'
import HeaderToolbar from './header-toolbar/index.vue'
import FooterToolbar from './footer-toolbar/index.vue'
import EditorContextMenu from './editor-context-menu/index.vue'

export default defineComponent({
  name: 'Screen',
  components: {
    HeaderToolbar,
    FooterToolbar,
    EditorContextMenu,
    CanvasMain: loadAsyncComponent(() => import('./canvas-main/index.vue')),
    LayerPanel: loadAsyncComponent(() => import('./layer-panel/index.vue')),
    ComponentsPanel: loadAsyncComponent(() => import('./components-panel/index.vue')),
    ConfigPanel: loadAsyncComponent(() => import('./config-panel/index.vue')),
    ToolboxPanel: loadAsyncComponent(() => import('./toolbox-panel/index.vue')),
  },
  props: {
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true)

    EditorModule.setEditMode()

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
        EditorModule.autoCanvasScale(() => ({
          offsetX: ToolbarModule.getPanelOffsetX,
          offsetY: ToolbarModule.getPanelOffsetY,
        }))
      })

      useMock()
    })

    return {
      loading,
      screenId,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

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
  background: url('@/assets/images/bg-canvas.png');
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
