<template>
  <div class="canvas-ruler-wp">
    <div
      ref="hRulerWpRef"
      class="ruler-wrapper h-container"
      :style="`transform: translateX(-${hScroll}px);`"
    ></div>
    <div
      ref="vRulerWpRef"
      class="ruler-wrapper v-container"
      :style="`transform: rotate(90deg) translateX(-${vScroll}px);`"
    ></div>
    <div class="ruler-corner">
      <i class="v-icon-line-show" style="z-index: 10;"></i>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, onUnmounted, watchEffect } from 'vue'
import { EditorModule } from '@/store/modules/editor'
import { RulerBuilder } from './index'

export default defineComponent({
  name: 'Ruler',
  setup() {
    const hRulerWpRef = ref<any>(null)
    const vRulerWpRef = ref<any>(null)
    const hRuler = ref<RulerBuilder | null>(null)
    const vRuler = ref<RulerBuilder | null>(null)
    const hScroll = ref(0)
    const vScroll = ref(0)

    watchEffect(() => {
      if (hRulerWpRef.value && vRulerWpRef.value) {
        const { canvas } = EditorModule
        if (hRuler.value) {
          hRuler.value.setSize(canvas.width, 20, canvas.scale)
        } else {
          hRuler.value = new RulerBuilder(hRulerWpRef.value, {
            direction: 'TB',
            rulerWidth: canvas.width,
            scale: canvas.scale,
            offset: 40,
          })
        }

        if (vRuler.value) {
          vRuler.value.setSize(canvas.width, 20, canvas.scale)
        } else {
          vRuler.value = new RulerBuilder(vRulerWpRef.value, {
            direction: 'LR',
            rulerWidth: canvas.height,
            scale: canvas.scale,
            offset: 40,
          })
        }
      }
    })

    const onScroll = (ev: Event) => {
      const dom = ev.target as HTMLElement
      hScroll.value = dom.scrollLeft
      vScroll.value = dom.scrollTop
    }

    onMounted(() => {
      const canvasWp = document.getElementById('canvas-wp')
      canvasWp?.addEventListener('scroll', onScroll)
    })

    onUnmounted(() => {
      const canvasWp = document.getElementById('canvas-wp')
      canvasWp?.removeEventListener('scroll', onScroll)
    })



    return {
      hRulerWpRef,
      vRulerWpRef,
      vScroll,
      hScroll,
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
