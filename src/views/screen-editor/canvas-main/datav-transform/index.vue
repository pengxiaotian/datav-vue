<template>
  <div
    class="datav-transform"
    :class="transformClass"
    :style="transformStyle"
  >
    <refer-line
      v-if="referLine.enable && com.selected"
      :attr="com.attr"
      :scale="scale"
    />
    <div
      :class="['datav-scale', { hovered: !com.selected && com.hovered }]"
      :style="hideStyle"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @mousedown.stop="onMove"
      @contextmenu="showMenu($event, com)"
      @click.stop
    >
      <div
        class="transform-handler"
        :class="handlerClass"
        :style="handlerStyle"
      >
        <div class="datav-com" :style="comStyle">
          <slot></slot>
          <div class="datav-wrapper-event-disable" :style="wrapperStyle"></div>
        </div>
        <template v-for="(v, k) in points" :key="k">
          <i v-if="v.rotateStyle" :class="`${v.name}-handler`" data-html2canvas-ignore>
            <span
              class="rotate-handler"
              :style="v.rotateStyle"
              @mousedown.stop="onRotate"
            >
              <span
                class="control-point"
                :style="v.style"
                @mousedown.stop="onZoom($event, k)"
              ></span>
            </span>
          </i>
          <i v-else :class="`${v.name}-handler`" data-html2canvas-ignore>
            <span
              class="control-point"
              :style="v.style"
              @mousedown.stop="onZoom($event, k)"
            ></span>
          </i>
        </template>
        <div class="transform-bg"></div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, getCurrentInstance, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { DatavComponent } from '@/components/_models/datav-component'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
import { macMetaOrCtrl } from '@/utils/util'
import { once } from '@/utils/dom'
import {
  Direction, getCursors,
  handleMove, handleZoom, handleRotate,
} from './index'
import { useContextMenu } from '../../editor-context-menu/index'
import ReferLine from './refer-line.vue'

export default defineComponent({
  name: 'DatavTransform',
  components: {
    ReferLine,
  },
  props: {
    com: {
      type: Object as PropType<DatavComponent>,
      required: true,
    },
  },
  setup(props) {
    const instance = getCurrentInstance()
    const editorStore = useEditorStore()
    const comStore = useComStore()
    const { showMenu, hideMenu } = useContextMenu()

    const referLine = computed(() => editorStore.referLine)
    const scale = computed(() => editorStore.canvas.scale)

    const transformClass = computed(() => ({
      selected: props.com.selected,
      hided: props.com.hided,
      locked: props.com.locked,
    }))

    const transformStyle = computed(() => ({
      top: 0,
      left: 0,
      width: `${props.com.attr.w}px`,
      height: `${props.com.attr.h}px`,
      transform: `translate(${props.com.attr.x}px, ${props.com.attr.y}px)`,
    }))

    const hideStyle = computed(() => ({
      display: props.com.hided ? 'none' : 'block',
    }))

    const handlerClass = computed(() => ({
      hided: !props.com.selected || props.com.locked,
    }))

    const handlerStyle = computed(() => ({
      cursor: props.com.selected ? 'move' : 'pointer',
      transform: `rotate(${props.com.attr.deg}deg)`,
    }))

    const comStyle = computed(() => {
      const { hided, attr } = props.com
      const sf = editorStore.pageConfig.styleFilterParams
      let filter = ''
      if (sf.enable) {
        filter = `hue-rotate(${sf.hue}deg) contrast(${sf.contrast}%) opacity(${sf.opacity}%) saturate(${sf.saturate}%) brightness(${sf.brightness}%)`
      }
      return {
        display: hided ? 'none' : 'block',
        transform: `scaleX(${attr.filpH ? -1 : 1}) scaleY(${attr.filpV ? -1 : 1}) rotateZ(360deg)`,
        filter,
      }
    })

    const wrapperStyle = computed(() => ({
      width: `${props.com.attr.w}px`,
      height: `${props.com.attr.h}px`,
    }))

    const cursor = computed(() => getCursors(props.com.attr.deg))

    const points = computed<{
      [k in Direction]: {
        name: string
        style: Partial<CSSProperties>
        rotateStyle?: Partial<CSSProperties>
      }
    }>(() => {
      const transform = `scale(${1 / scale.value}, ${1 / scale.value})`
      return {
        t: {
          name: 'top',
          style: { cursor: cursor.value.t, transform },
        },
        rt: {
          name: 'top-right',
          style: { cursor: cursor.value.rt },
          rotateStyle: { 'transform-origin': '25% 75%',  transform },
        },
        r: {
          name: 'right',
          style: { cursor: cursor.value.r, transform },
        },
        rb: {
          name: 'bottom-right',
          style: { cursor: cursor.value.rb },
          rotateStyle: { 'transform-origin': '25% 25%',  transform },
        },
        b: {
          name: 'bottom',
          style: { cursor: cursor.value.b, transform },
        },
        lb: {
          name: 'bottom-left',
          style: { cursor: cursor.value.lb },
          rotateStyle: { 'transform-origin': '75% 25%',  transform },
        },
        l: {
          name: 'left',
          style: { cursor: cursor.value.l, transform },
        },
        lt: {
          name: 'top-left',
          style: { cursor: cursor.value.lt },
          rotateStyle: { 'transform-origin': '75% 75%',  transform },
        },
      }
    })

    const onEnter = () => {
      if (!props.com.selected) {
        props.com.hovered = true
      }
    }

    const onLeave = () => {
      props.com.hovered = false
    }

    const selectCom = (ev: MouseEvent) => {
      const isMult = macMetaOrCtrl(ev)
      if (!isMult && props.com.selected) {
        return
      }

      comStore.select(props.com.id, isMult)
    }

    const isMoveing = ref(false)

    const onMove = (ev: MouseEvent) => {
      if (editorStore.contextMenu.show) {
        hideMenu()
        return false
      }

      if (!props.com.selected) {
        once(ev.target as HTMLElement, 'mouseup', selectCom)
        return false
      }

      comStore.selectedComs.forEach(m => {
        handleMove(
          ev,
          m,
          scale.value,
          editorStore.pageConfig.grid,
          () => {
            if (props.com.id === m.id) {
              isMoveing.value = true
              editorStore.calcAlignLine(props.com)
            }
          },
          () => {
            if (props.com.id === m.id) {
              if (isMoveing.value) {
                isMoveing.value = false
              } else if (ev.button === 0) {
                comStore.select(props.com.id)
              }
              editorStore.hideAlignLine(props.com.id)
            }
          },
        )
      })
    }

    const onZoom = (ev: MouseEvent, dir: Direction) => {
      hideMenu()
      if (!props.com.selected) {
        return false
      }

      const isNormal = comStore.selectedComs.length > 1 ? true : editorStore.isNormalResizeMode
      comStore.selectedComs.forEach(m => {
        handleZoom(ev, dir, m, scale.value, isNormal)
      })
    }

    const onRotate = (ev: MouseEvent) => {
      hideMenu()
      comStore.selectedComs.forEach(m => {
        handleRotate(ev, instance.vnode.el as HTMLElement, m)
      })
    }

    return {
      referLine,
      scale,
      transformClass,
      transformStyle,
      hideStyle,
      handlerClass,
      handlerStyle,
      comStyle,
      wrapperStyle,
      points,
      onEnter,
      onLeave,
      onMove,
      onZoom,
      onRotate,
      showMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style';
</style>
