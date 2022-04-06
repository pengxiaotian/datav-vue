<template>
  <div class="canvas-main">
    <div id="canvas-wp" class="canvas-panel-wrap">
      <div
        ref="screenRef"
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
          <datav-transform v-for="com in coms" :key="com.id" :com="com">
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

        <canvas-area
          v-if="showArea"
          :start-x="areaStartX"
          :start-y="areaStartY"
          :width="areaWidth"
          :height="areaHeight"
        />
        <align-line />
        <ruler />
      </div>
    </div>
    <div class="thumbnail"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, nextTick, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { storeToRefs } from 'pinia'
import { useToolbarStore } from '@/store/toolbar'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { useBlueprintStore } from '@/store/blueprint'
import { createComponent } from '@/components/datav'
import { ComType, DatavComponent } from '@/components/_models/datav-component'
import { on, off } from '@/utils/dom'
import { getComponentRotatedStyle } from '@/utils/editor'
import { warn } from '@/utils/warn'
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
    const blueprintStore = useBlueprintStore()

    const { hideMenu } = useContextMenu()

    const { pageConfig, canvas } = storeToRefs(editorStore)
    const { coms } = storeToRefs(comStore)

    const screenRef = ref(null)
    const showArea = ref(false)
    const editorX = ref(0)
    const editorY = ref(0)
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
          const offsetX = (ev.clientX - toolbarStore.getPanelOffsetLeft) / scale
          const offsetY = (ev.clientY - toolbarStore.getPanelOffsetTop) / scale
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
      } catch(error) {
        warn('dropToAddCom', error.message)
      }
    }

    const dragOver = (ev: DragEvent) => {
      ev.preventDefault()
      ev.stopPropagation()
      ev.dataTransfer.dropEffect = 'copy'
    }

    const cancelSelected = () => {
      comStore.selectCom('')
      hideMenu()
    }

    const hideArea = () => {
      showArea.value = false
      areaWidth.value = 0
      areaHeight.value = 0

      editorStore.$patch({
        areaData: {
          style: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
          },
        },
      })
    }

    const getSelectArea = () => {
      const result: DatavComponent[] = []
      const { scale } = canvas.value
      // 区域起点坐标
      const sx = (areaStartX.value - offsetX) / scale // left
      const ex = (areaStartX.value + areaWidth.value - offsetX) / scale // right
      const sy = (areaStartY.value - offsetY) / scale // top
      const ey = (areaStartY.value + areaHeight.value - offsetY) / scale // bottom
      // 计算所有的组件数据，判断是否在选中区域内
      coms.value.forEach(com => {
        if (com.locked || com.hided) {
          return
        }

        if (com.type === ComType.group) {
          // 只允许嵌套两层
          const hasGroup = com.children?.some(m => m.type === ComType.group)
          if (hasGroup) {
            return
          }
        }

        const { left, top, w, h } = getComponentRotatedStyle(com.attr)
        if (sx <= left && sy <= top && (left + w <= ex) && (top + h <= ey)) {
          com.hovered = true
          result.push(com)
        }
      })

      // 返回在选中区域内的所有组件
      return result
    }

    const createGroup = () => {
      // 获取选中区域的组件数据
      const selectComs = getSelectArea()
      if (selectComs.length < 1) {
        hideArea()
        return
      }

      // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
      // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
      let top = Infinity, left = Infinity
      let right = -Infinity, bottom = -Infinity
      selectComs.forEach(com => {
        const style = getComponentRotatedStyle(com.attr)
        if (style.left < left) left = style.left
        if (style.top < top) top = style.top
        if (style.right > right) right = style.right
        if (style.bottom > bottom) bottom = style.bottom
      })

      const { scale } = canvas.value
      areaStartX.value = left * scale + offsetX
      areaStartY.value = top * scale + offsetY
      areaWidth.value = (right - left) * scale
      areaHeight.value = (bottom - top) * scale

      // 设置选中区域位移大小信息和区域内的组件数据
      editorStore.$patch({
        areaData: {
          style: {
            left: areaStartX.value,
            top: areaStartY.value,
            width: areaWidth.value,
            height: areaHeight.value,
          },
        },
      })
    }

    const handleMouseDown = (ev: MouseEvent) => {
      ev.stopPropagation()
      ev.preventDefault()

      cancelSelected()
      hideArea()

      // 获取编辑器的位移信息，每次点击时都需要获取一次。
      const rectInfo = screenRef.value.getBoundingClientRect()
      editorX.value = rectInfo.x
      editorY.value = rectInfo.y

      const sx = ev.clientX
      const sy = ev.clientY
      areaStartX.value = sx - editorX.value
      areaStartY.value = sy - editorY.value
      // 展示选中区域
      showArea.value = true

      const move = (e: MouseEvent) => {
        if (e.clientX < sx) {
          areaStartX.value = e.clientX - editorX.value
        }

        if (e.clientY < sy) {
          areaStartY.value = e.clientY - editorY.value
        }

        areaWidth.value = Math.abs(e.clientX - sx)
        areaHeight.value = Math.abs(e.clientY - sy)
      }

      const up = (e: MouseEvent) => {
        off(document, 'mousemove', move)
        off(document, 'mouseup', up)

        if (e.clientX === sx && e.clientY === sy) {
          hideArea()
          return
        }

        createGroup()
      }

      on(document, 'mousemove', move)
      on(document, 'mouseup', up)
    }

    watch(
      () => editorStore.canvas.scale,
      () => {
        hideArea()
      },
    )

    const bar = () => {
      console.log(1)
    }
    const foo = () => {
      console.log(2)
    }

    return {
      foo,
      bar,
      coms,
      canvasPanelStyle,
      screenShotStyle,
      screenRef,
      showArea,
      areaStartX,
      areaStartY,
      areaWidth,
      areaHeight,
      dragOver,
      dropToAddCom,
      handleMouseDown,
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
    position: absolute;
    top: 60px;
    left: 60px;
    background-position: center, right bottom;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, contain;
    box-shadow: rgb(0 0 0 / 50%) 0 0 30px 0;
    transition: 0.2s all ease-in-out;
    transform-origin: 0 0;
    z-index: 1;
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
