<template>
  <div class="canvas-main">
    <div id="canvas-wp" class="canvas-panel-wrap" @mousedown.stop="cancelSelectCom">
      <div class="screen-shot" :style="screenShotStyle">
        <align-line />
        <ruler />
        <div
          id="canvas-coms"
          class="canvas-panel"
          :style="canvasPanelStyle"
          @dragover="dragOver"
          @drop="dropToAddCom"
        >
          <datav-transform
            v-for="com in coms"
            :key="com.id"
            :com="com"
          >
            <component
              :is="com.name"
              :com="com"
              :style="{
                transform: 'translateZ(0px)',
                opacity: com.attr.opacity,
              }"
            />
          </datav-transform>
        </div>
      </div>
    </div>
    <div class="thumbnail"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import { storeToRefs } from 'pinia'
import { useToolbarStore } from '@/store/toolbar'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { useBlueprintStore } from '@/store/blueprint'
import { createComponent } from '@/components/datav'
import AlignLine from './align-line.vue'
import Ruler from './ruler/index.vue'
import DatavTransform from './datav-transform/index.vue'

export default defineComponent({
  name: 'CanvasMain',
  components: {
    AlignLine,
    Ruler,
    DatavTransform,
  },
  setup() {
    const toolbarStore = useToolbarStore()
    const comStore = useComStore()
    const editorStore = useEditorStore()
    const blueprintStore = useBlueprintStore()

    const { pageConfig, canvas } = storeToRefs(editorStore)
    const { coms } = storeToRefs(comStore)
    const screenShotStyle = computed(() => {
      return {
        width: `${canvas.value.width}px`,
        height: `${canvas.value.height}px`,
      } as CSSProperties
    })

    const canvasPanelStyle = computed(() => {
      return {
        position: 'absolute',
        width: `${pageConfig.value.width}px`,
        height: `${pageConfig.value.height}px`,
        transform: `scale(${canvas.value.scale}) translate(0px, 0px)`,
        backgroundImage: `url(${pageConfig.value.bgimage})`,
        backgroundColor: pageConfig.value.bgcolor,
      } as CSSProperties
    })

    const dropToAddCom = async (event: any) => {
      event.preventDefault()

      try {
        const name = event.dataTransfer.getData('text')
        if (name) {
          toolbarStore.addLoading()
          let com = await createComponent(name)
          const { scale } = canvas.value
          const offsetX = (event.clientX - toolbarStore.getPanelOffsetLeft) / scale
          const offsetY = (event.clientY - toolbarStore.getPanelOffsetTop) / scale
          com.attr.x = Math.round(offsetX - com.attr.w / 2)
          com.attr.y = Math.round(offsetY - com.attr.h / 2)
          await comStore.addCom(com)
          comStore.selectCom(com.id)
          toolbarStore.removeLoading()

          if (com.apis.source) {
            await com.loadData()
            nextTick(() => {
              blueprintStore.events[com.id]?.requestData()
            })
          }
        }
      } catch {
        // TODO
      }
    }

    const cancelSelectCom = () => {
      comStore.selectCom('')
    }

    const dragOver = (ev: DragEvent) => {
      ev.preventDefault()
      ev.stopPropagation()
      ev.dataTransfer.dropEffect = 'copy'
    }

    return {
      coms,
      screenShotStyle,
      canvasPanelStyle,
      dropToAddCom,
      cancelSelectCom,
      dragOver,
    }
  },
})
</script>

<style lang="scss" scoped>
.canvas-main {
  position: relative;
  display: flex;
  height: 100%;
  padding: 0;
  user-select: none;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
}

.canvas-panel-wrap {
  position: relative;
  width: 100%;
  height: calc(100% - 32px);
  overflow: auto;

  .canvas-panel {
    top: 60px;
    left: 60px;
    background-position: center, right bottom;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, contain;
    box-shadow: rgb(0 0 0 / 50%) 0 0 30px 0;
    transition: 0.2s all ease-in-out;
    transform-origin: 0 0;
  }
}
</style>

<style lang="scss">
.datav-com .datav-wraper,
.datav-layer .datav-wraper {
  pointer-events: none !important;
}

.datav-wraper {
  box-sizing: border-box;
}
</style>
