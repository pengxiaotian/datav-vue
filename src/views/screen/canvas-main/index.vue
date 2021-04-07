<template>
  <el-main class="canvas-main">
    <div class="canvas-panel-wrap">
      <div class="screen-shot" :style="screenShotStyle">
        <div
          id="canvas-coms"
          class="canvas-panel"
          :style="canvasPanelStyle"
          @dragover.prevent
          @drop="dropToAddCom"
        >
          1
        </div>
      </div>
    </div>
    <div class="thumbnail"></div>
  </el-main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { EditorModule } from '@/store/modules/editor'
import FactoryComponent from '@/domains/factory-component'

export default defineComponent({
  name: 'CanvasMain',
  setup() {
    const canvas = computed(() => EditorModule.canvas)
    const pageConfig = computed(() => EditorModule.pageConfig)
    const screenShotStyle = computed(() => {
      return {
        width: `${canvas.value.width}px`,
        height: `${canvas.value.height}px`,
      }
    })

    const canvasPanelStyle = computed(() => {
      return {
        position: 'absolute',
        width: `${pageConfig.value.width}px`,
        height: `${pageConfig.value.height}px`,
        transform: `scale(${canvas.value.scale}) translate(0px, 0px)`,
        'background-image': `url(${pageConfig.value.bgimage})`,
        'background-color': pageConfig.value.bgcolor,
      }
    })

    const dropToAddCom = (event: any) => {
      event.preventDefault()

      try {
        const name = event.dataTransfer.getData('text')
        if (name) {
          let com = FactoryComponent.create(name)
          com.attr.x = event.offsetX - com.attr.w / 2
          com.attr.y = event.offsetY - com.attr.h / 2
          EditorModule.addCom(com)
        }
      } catch {
        // TODO
      }
    }

    return {
      screenShotStyle,
      canvasPanelStyle,
      dropToAddCom,
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
}

.canvas-panel-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;

  .canvas-panel {
    top: 60px;
    left: 60px;
    background-position: center, right bottom;
    background-repeat: no-repeat, no-repeat;
    background-size: cover, contain;
    box-shadow: rgba(0, 0, 0, 0.5) 0 0 30px 0;
    transition: 0.2s all ease-in-out;
    transform-origin: 0 0;
  }
}
</style>
