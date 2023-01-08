<template>
  <div class="canvas-main">
    <div id="canvas-wp" class="canvas-panel-wrap" @click="cancelSelected">
      <div
        id="screen-wp"
        class="screen-shot"
        :style="screenShotStyle"
        @mousedown="handleMouseDown"
      >
        <div
          id="canvas-coms"
          class="canvas-panel"
          :style="canvasPanelStyle"
          @dragover="dragOver"
          @drop="dropToAddCom"
        >
          <datav-transform v-for="com in coms" :key="com.id" :com="com" />
        </div>
        <align-line />
        <ruler />
      </div>
      <canvas-area
        v-if="areaWidth > 0 || areaHeight > 0"
        :start-x="areaStartX"
        :start-y="areaStartY"
        :width="areaWidth"
        :height="areaHeight"
        :style="{
          width: `${selectionW}px`,
          height: `${selectionH}px`,
        }"
      />
    </div>
    <div class="thumbnail"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { storeToRefs } from 'pinia'
import { useToolbarStore } from '@/store/toolbar'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { createComponent } from '@/components/datav'
import { ComType } from '@/components/_models/datav-component'
import { loadCom } from '@/components/_utils/component-util'
import { on, off } from '@/utils/dom'
import { checkRectIntersect } from '@/utils/editor'
import { warn } from '@/utils/warn-util'
import AlignLine from './align-line.vue'
import Ruler from './ruler/index.vue'
import CanvasArea from './canvas-area.vue'
import DatavTransform from './datav-transform/index.vue'
import { useContextMenu } from '../editor-context-menu'

export default defineComponent({
  name: 'CanvasMain',
  components: {
    AlignLine,
    Ruler,
    CanvasArea,
    DatavTransform,
  },
  setup() {
    const toolbarStore = useToolbarStore()
    const comStore = useComStore()
    const editorStore = useEditorStore()

    const { hideMenu } = useContextMenu()

    const { pageConfig, canvas } = storeToRefs(editorStore)
    const { coms } = storeToRefs(comStore)

    const cancelable = ref(false)
    const selectionW = ref(0)
    const selectionH = ref(0)
    const areaStartX = ref(0)
    const areaStartY = ref(0)
    const areaWidth = ref(0)
    const areaHeight = ref(0)
    const offsetX = 60
    const offsetY = 60

    const screenShotStyle = computed(() => {
      return {
        width: `${canvas.value.width}px`,
        height: `${canvas.value.height}px`,
      } as CSSProperties
    })

    const canvasPanelStyle = computed(() => {
      return {
        width: `${pageConfig.value.width}px`,
        height: `${pageConfig.value.height}px`,
        transform: `scale(${canvas.value.scale}) translate(0px, 0px)`,
        backgroundImage: `url(${pageConfig.value.bgimage})`,
        backgroundColor: pageConfig.value.bgcolor,
      } as CSSProperties
    })

    const dropToAddCom = async (ev: DragEvent) => {
      ev.preventDefault()

      try {
        const name = ev.dataTransfer.getData('text')
        if (name) {
          toolbarStore.addLoading()
          let com = await createComponent(name)
          const { scale } = canvas.value
          const { left, top } = toolbarStore.getPanelOffset
          const canvasWp = document.getElementById('canvas-wp')
          const scrollLeft = canvasWp?.scrollLeft || 0
          const scrollTop = canvasWp?.scrollTop || 0
          const offsetLeft = (scrollLeft + ev.clientX - left) / scale
          const offsetTop = (scrollTop + ev.clientY - top) / scale
          com.attr.x = Math.round(offsetLeft - com.attr.w / 2)
          com.attr.y = Math.round(offsetTop - com.attr.h / 2)
          await loadCom(com)
          toolbarStore.removeLoading()
        }
      } catch(error) {
        warn('dropToAddCom', error.message)
      }
    }

    const dragOver = (ev: DragEvent) => {
      ev.preventDefault()
      ev.stopPropagation()
      ev.dataTransfer.dropEffect = 'copy'
    }

    const confirmCancel = (ev: MouseEvent) => {
      const dom = ev.target as HTMLElement
      const cls = ['canvas-panel', 'screen-shot', 'canvas-panel-wrap']
      if (cls.includes(dom.className)){
        cancelable.value = true
      } else {
        cancelable.value = false
      }
    }

    const cancelSelected = () => {
      if (cancelable.value) {
        cancelable.value = false
        comStore.select('')
      }
    }

    const hideArea = () => {
      areaWidth.value = 0
      areaHeight.value = 0
    }

    const getSelectComs = () => {
      return coms.value.filter(com => {
        if (com.locked || com.hided || !com.hovered) {
          com.selected = false
          return false
        }
        com.selected = true
        return true
      })
    }

    const handleSelectArea = () => {
      const { scale } = canvas.value
      // 区域起点坐标
      const sx = (areaStartX.value - offsetX) / scale // left
      const sy = (areaStartY.value - offsetY) / scale // top
      const sw = areaWidth.value / scale // width
      const sh = areaHeight.value / scale // height
      // 计算所有的组件数据，判断是否和选中区域相交
      coms.value.forEach(com => {
        if (com.locked || com.hided) {
          return
        }

        const { x, y, w, h } = com.attr
        const rect1 = { x: sx, y: sy, w: sw, h: sh }
        const rect2 = { x, y, w, h }
        com.hovered = checkRectIntersect(rect1, rect2)
      })
    }

    const handleMouseDown = (ev: MouseEvent) => {
      // ev.stopPropagation()
      cancelable.value = true
      if (editorStore.contextMenu.show) {
        cancelable.value = false
        hideMenu()
        return false
      }

      const screenWp = document.getElementById('screen-wp')
      selectionW.value = screenWp.clientWidth
      selectionH.value = screenWp.clientHeight

      // 获取编辑器的位移信息，每次点击时都需要获取一次。
      const rectInfo = screenWp.getBoundingClientRect()
      const currX = rectInfo.x
      const currY = rectInfo.y

      const sx = ev.clientX
      const sy = ev.clientY
      areaStartX.value = sx - currX
      areaStartY.value = sy - currY

      const move = (e: MouseEvent) => {
        if (e.clientX < sx) {
          areaStartX.value = e.clientX - currX
        }

        if (e.clientY < sy) {
          areaStartY.value = e.clientY - currY
        }

        areaWidth.value = Math.abs(e.clientX - sx)
        areaHeight.value = Math.abs(e.clientY - sy)

        handleSelectArea()

        cancelable.value = false
      }

      const up = () => {
        off(document, 'mousemove', move)
        off(document, 'mouseup', up)

        hideArea()
        getSelectComs()

        if (cancelable.value) {
          confirmCancel(ev)
        }
      }

      on(document, 'mousemove', move)
      on(document, 'mouseup', up)
    }

    watch(
      () => editorStore.canvas.scale,
      () => {
        hideArea()
        hideMenu()
      },
    )

    return {
      ComType,
      coms,
      canvasPanelStyle,
      screenShotStyle,
      selectionW,
      selectionH,
      areaStartX,
      areaStartY,
      areaWidth,
      areaHeight,
      dragOver,
      dropToAddCom,
      handleMouseDown,
      cancelSelected,
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
  // height: 100%; // 后续加上鸟瞰图
  height: calc(100% - 32px);
  overflow: auto;

  .canvas-panel {
    position: absolute;
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
