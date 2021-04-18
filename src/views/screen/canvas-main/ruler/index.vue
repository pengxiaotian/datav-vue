<template>
  <div class="canvas-ruler-wp">
    <div ref="hRulerRef" class="ruler-wrapper h-container"></div>
    <div ref="vRulerRef" class="ruler-wrapper v-container"></div>
    <div class="ruler-corner">
      <i class="v-icon-line-show" style="z-index: 10;"></i>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, watchEffect } from 'vue'
import { EditorModule } from '@/store/modules/editor'
import { RulerBuilder } from './index'

export default defineComponent({
  name: 'Ruler',
  setup() {
    const hRulerRef = ref<any>(null)
    const vRulerRef = ref<any>(null)
    const pageConfig = computed(() => EditorModule.pageConfig)

    watchEffect(() => {
      if (hRulerRef.value && vRulerRef.value) {
        const { canvas } = EditorModule
        const hRuler = new RulerBuilder(hRulerRef.value, {
          direction: 'TB',
          rulerWidth: canvas.width,
          scale: canvas.scale,
          offset: 40,
        })
        const vRuler = new RulerBuilder(vRulerRef.value, {
          direction: 'LR',
          rulerWidth: canvas.height,
          scale: canvas.scale,
          offset: 40,
        })
        console.log(hRuler, vRuler)
      }
    })

    return {
      hRulerRef,
      vRulerRef,
      pageConfig,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.canvas-ruler-wp {
  position: fixed;
  z-index: 1;
  width: 100%;

  .ruler-wrapper {
    position: absolute;
    height: 20px;
    width: 100%;

    .canvas-ruler {
      position: absolute;
    }
  }

  .h-container {
    left: 20px;
    cursor: ew-resize;
    transform: translateX(0);
  }

  .v-container {
    cursor: ns-resize;
    transform: rotate(90deg) translateX(0);
    transform-origin: 0 100% 0;
  }

  .ruler-corner {
    position: fixed;
    z-index: 999;
    display: flex;
    width: 20px;
    height: 20px;
    font-size: 16px;
    color: $font-color;
    cursor: pointer;
    background: #0e1013;
    border-right: $border;
    border-bottom: $border;
    align-items: center;
    justify-content: center;
  }
}
</style>
