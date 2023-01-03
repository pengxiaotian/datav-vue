<template>
  <div class="g-layout is-vertical edit-container">
    <div class="g-header">
      <header-toolbar />
    </div>
    <div id="edit-main-wp" class="g-layout edit-main-wp">
      <layer-panel />
      <components-panel />
      <filter-manager-drawer />
      <div class="g-layout edit-main">
        <toolbox-panel />
        <g-loading :spinning="loading">
          <canvas-main />
        </g-loading>
        <footer-toolbar />
      </div>
      <config-panel />
    </div>
  </div>
  <editor-context-menu />
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useToolbarStore } from '@/store/toolbar'
import { useDebugStore } from '@/store/debug'
import { useEditorStore } from '@/store/editor'
import { useFilterStore } from '@/store/filter'
import { useComStore } from '@/store/com'
import { useEventStore } from '@/store/event'
import { getSysTemplate } from '@/api/templates'
import { useMock } from '@/data/mock'
import { loadAsyncComponent } from '@/utils/async-component'
import { warn } from '@/utils/warn-util'

export default defineComponent({
  name: 'ScreenEditor',
  components: {
    HeaderToolbar: defineAsyncComponent(() => import('./header-toolbar/index.vue')),
    FooterToolbar: defineAsyncComponent(() => import('./footer-toolbar/index.vue')),
    EditorContextMenu: defineAsyncComponent(() => import('./editor-context-menu/index.vue')),
    CanvasMain: loadAsyncComponent(() => import('./canvas-main/index.vue')),
    LayerPanel: loadAsyncComponent(() => import('./layer-panel/index.vue')),
    ComponentsPanel: loadAsyncComponent(() => import('./components-panel/index.vue')),
    ConfigPanel: loadAsyncComponent(() => import('./config-panel/index.vue')),
    ToolboxPanel: loadAsyncComponent(() => import('./toolbox-panel/index.vue')),
    FilterManagerDrawer: loadAsyncComponent(() => import('./filter-manager/filter-manager-drawer.vue')),
  },
  props: {
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const route = useRoute()
    const toolbarStore = useToolbarStore()
    const filterStore = useFilterStore()
    const debugStore = useDebugStore()
    const editorStore = useEditorStore()
    const comStore = useComStore()
    const eventStore = useEventStore()
    const loading = ref(true)

    debugStore.enable()
    editorStore.setEditMode()

    onMounted(async () => {
      try {
        const tplId = parseInt(route.query.tpl as string)
        if (tplId > 0) {
          const { data } = await getSysTemplate(tplId)
          if (data) {
            const { config } = data
            editorStore.setEditorOption({
              screen: {
                id: +props.projectId,
                name: data.name,
              },
              config: {
                width: config.width,
                height: config.height,
                bgimage: config.bgimage,
                bgcolor: config.bgcolor,
                styleFilterParams: config.styleFilterParams,
              },
            })
            comStore.load(config.coms)
            const { componentsView, publishersView, subscribersView } = config.variables
            eventStore.$patch({ componentsView, publishersView, subscribersView })
            filterStore.$patch({ dataFilters: config.dataFilters ?? [] })
          }
          if (tplId === 1) {
            useMock()
          }
        } else {
          const screenId = +props.projectId
          await Promise.all([
            editorStore.loadScreen(screenId),
            filterStore.request(screenId),
            comStore.request(screenId),
          ])
        }
      } catch (error) {
        warn('editor', error.message)
      } finally {
        loading.value = false
        document.title = `${editorStore.screen.name} | 编辑器`
        editorStore.autoCanvasScale(() => toolbarStore.getPanelOffset)
      }
    })

    return {
      loading,
    }
  },
})
</script>

<style lang="scss" scoped>
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
  background: url('/images/bg-canvas.png');
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
