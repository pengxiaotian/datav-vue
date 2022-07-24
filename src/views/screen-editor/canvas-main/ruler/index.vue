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
      <n-icon v-if="visible">
        <IconLineShow />
      </n-icon>
      <n-icon v-else>
        <IconLineHide />
      </n-icon>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, onUnmounted, watchEffect } from 'vue'
import { useEditorStore } from '@/store/editor'
import { IconLineShow, IconLineHide } from '@/icons'
import { RulerBuilder } from './index'

export default defineComponent({
  name: 'Ruler',
  components: {
    IconLineShow,
    IconLineHide,
  },
  setup() {
    const editorStore = useEditorStore()
    const hRulerWpRef = ref<any>(null)
    const vRulerWpRef = ref<any>(null)
    const hRuler = ref<RulerBuilder | null>(null)
    const vRuler = ref<RulerBuilder | null>(null)
    const visible = ref(true)
    const hScroll = ref(0)
    const vScroll = ref(0)

    const cw = document.documentElement.clientWidth

    watchEffect(() => {
      if (hRulerWpRef.value && vRulerWpRef.value) {
        const { canvas, guideLine } = editorStore
        const hWidth = Math.max(canvas.width, cw)
        if (hRuler.value) {
          hRuler.value.setSize(hWidth, 20, canvas.scale)
        } else {
          hRuler.value = new RulerBuilder(hRulerWpRef.value, {
            direction: 'TB',
            width: hWidth,
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
          vRuler.value.setSize(canvas.height, 20, canvas.scale)
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
      visible,
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
$line-border-1: 1px solid rgb(0 173 255 / 84%);
$line-border-2: 1px dashed rgb(0 173 255 / 84%);
$line-border-3: 1px solid rgb(161 174 179 / 80%);

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
      background: rgb(64 116 180 / 100%);

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
      background: rgb(64 116 180 / 100%);
      color: #fff;
      border-radius: 1px;
      padding: 0 4px;
    }
  }

  .h-container {
    left: 20px;
    cursor: ew-resize;
    transform: translateX(0);

    .ruler-line {
      top: 0;
      height: 100vh;
      padding-left: 5px;
      border-left: $line-border-1;

      .line-action {
        top: 5px;
      }
    }

    .ruler-indicator {
      border-left: $line-border-2;
      top: 0;
      height: 100vw;

      .indicator-value {
        left: 10px;
        top: 5px;
      }
    }
  }

  .v-container {
    cursor: ns-resize;
    transform: rotate(90deg) translateX(0);
    transform-origin: 0 100% 0;

    .lines-wrapper {
      transform: rotate(-90deg);
      transform-origin: 0 100% 0;
    }

    .ruler-line {
      left: 3px;
      width: 100vw;
      border-top: $line-border-1;

      .line-action {
        top: 10px;
        left: 5px;
        transform: rotate(90deg);
      }
    }

    .ruler-indicator {
      border-bottom: $line-border-2;
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
    color: var(--datav-font-color);
    cursor: pointer;
    background: var(--datav-data-form-bgcolor);
    border-right: $line-border-3;
    border-bottom: $line-border-3;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #fff;
    }
  }
}
</style>
