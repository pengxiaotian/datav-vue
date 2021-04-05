<template>
  <el-main class="canvas-main">
    <div
      class="canvas-panel-wrap"
    >
      <div class="screen-shot" :style="screenShotStyle">
        <div
          id="canvas-coms"
          class="canvas-panel"
          :style="canvasPanelStyle"
        >
          1
        </div>
      </div>
    </div>
    <div class="thumbnail"></div>
  </el-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { EditorModule } from '@/store/modules/editor'

export default defineComponent({
  name: 'CanvasMain',
  setup() {

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

  &::-webkit-scrollbar {
    height: 34px;
  }
}
</style>
