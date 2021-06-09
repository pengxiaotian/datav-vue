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
    <div title="切换参考线" class="ruler-corner" @click="toggleGuides">
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
    const visible = ref(true)
    const hScroll = ref(0)
    const vScroll = ref(0)

    watchEffect(() => {
      if (hRulerWpRef.value && vRulerWpRef.value) {
        const { canvas, guideLine } = EditorModule
        if (hRuler.value) {
          hRuler.value.setSize(canvas.width, 20, canvas.scale)
        } else {
          hRuler.value = new RulerBuilder(hRulerWpRef.value, {
            direction: 'TB',
            width: canvas.width,
            scale: canvas.scale,
            coorChange: (action, nCoor, oCoor) => {
              if (action === 'add') {
                guideLine.h.push(nCoor)
              } else if (action === 'update' && nCoor !== oCoor) {
                guideLine.h = guideLine.h.filter(m => m !== oCoor)
                guideLine.h.push(nCoor)
              } else if (action === 'delete') {
                guideLine.h = guideLine.h.filter(m => m !== nCoor)
              }
            },
          })

          hRuler.value.setGuideLines(guideLine.h)
        }

        if (vRuler.value) {
          vRuler.value.setSize(canvas.width, 20, canvas.scale)
        } else {
          vRuler.value = new RulerBuilder(vRulerWpRef.value, {
            direction: 'LR',
            width: canvas.height,
            scale: canvas.scale,
            coorChange: (action, nCoor, oCoor) => {
              if (action === 'add') {
                guideLine.v.push(nCoor)
              } else if (action === 'update' && nCoor !== oCoor) {
                guideLine.v = guideLine.v.filter(m => m !== oCoor)
                guideLine.v.push(nCoor)
              } else if (action === 'delete') {
                guideLine.v = guideLine.v.filter(m => m !== nCoor)
              }
            },
          })

          vRuler.value.setGuideLines(guideLine.v)
        }
      }
    })

    const toggleGuides = () => {
      if (hRuler.value && vRuler.value) {
        visible.value = !visible.value
        hRuler.value.toggleGuide(visible.value)
        vRuler.value.toggleGuide(visible.value)
      }
    }

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
      toggleGuides,
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

  .ruler-wrapper {
    position: absolute;
    height: 20px;
  }

  .ruler-line {
    position: absolute;

    .line-action {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      color: #fff;
      padding: 0 4px;
      border-radius: 1px;
      box-shadow: 0 0 5px -3px #000;
      background: $ruler-tag-bg;

      .line-value {
        pointer-events: none;
      }
    }
  }

  .ruler-indicator {
    position: absolute;
    pointer-events: none;

    .indicator-value {
      position: absolute;
      background: $ruler-tag-bg;
      color: #fff;
      border-radius: 1px;
      padding: 0 4px;
    }
  }

  .h-container {
    left: 20px;
    cursor: col-resize;
    transform: translateX(0);

    .ruler-line {
      top: 0;
      height: 100vh;
      padding-left: 5px;
      border-left: 1px solid $ruler-line-bg;

      .line-action {
        top: 5px;
      }
    }

    .ruler-indicator {
      border-left: 1px dashed $ruler-line-bg;
      top: 0;
      height: 100vw;

      .indicator-value {
        left: 10px;
        top: 5px;
      }
    }
  }

  .v-container {
    cursor: row-resize;
    transform: rotate(90deg) translateX(0);
    transform-origin: 0 100% 0;

    .lines-wrapper {
      transform: rotate(-90deg);
      transform-origin: 0 100% 0;
    }

    .ruler-line {
      left: 3px;
      width: 100vw;
      border-top: 1px solid $ruler-line-bg;

      .line-action {
        top: 10px;
        left: 5px;
        transform: rotate(90deg);
      }
    }

    .ruler-indicator {
      border-bottom: 1px dashed $ruler-line-bg;
      width: 100vw;
      bottom: 1px;
      transform: rotate(-90deg);
      transform-origin: 1px 100% 0;

      .indicator-value {
        transform-origin: 0 0;
        transform: rotate(90deg);
        top: 10px;
        left: 25px;
      }
    }
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
    background: $ruler-bg;
    border-right: 1px solid $ruler-font-color;
    border-bottom: 1px solid $ruler-font-color;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #fff;
    }
  }
}
</style>
