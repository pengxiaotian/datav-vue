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
      :class="['datav-scale', { hovered: com.hovered }]"
      :style="hideStyle"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @mousedown.prevent.stop="onMove"
    >
      <div
        class="transform-handler"
        :class="handlerClass"
        :style="handlerStyle"
      >
        <div class="datav-com" :style="comStyle">
          <slot></slot>
          <div
            class="datav-wrapper-event-disable"
            :style="wrapperStyle"
            @contextmenu="showMenu"
          ></div>
        </div>
        <template v-for="(v, k) in points" :key="k">
          <i v-if="v.rotateStyle" :class="`${v.name}-handler`" data-html2canvas-ignore>
            <span
              class="rotate-handler"
              :style="v.rotateStyle"
              @mousedown.prevent.stop="onRotate"
            >
              <span
                class="control-point"
                :style="v.style"
                @mousedown.prevent.stop="onZoom($event, k)"
              ></span>
            </span>
          </i>
          <i v-else :class="`${v.name}-handler`" data-html2canvas-ignore>
            <span
              class="control-point"
              :style="v.style"
              @mousedown.prevent.stop="onZoom($event, k)"
            ></span>
          </i>
        </template>
        <div class="transform-bg"></div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, getCurrentInstance } from 'vue'
import type { CSSProperties } from 'vue'
import { DatavComponent } from '@/components/_models/datav-component'
import { useEditorStore } from '@/store/editor'
import { useComStore } from '@/store/com'
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
      cursor: 'move',
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

    const selectCom = () => {
      if (props.com.selected) {
        return
      }

      comStore.selectCom(props.com.id)
    }

    const onEnter = () => {
      props.com.hovered = true
    }

    const onLeave = () => {
      props.com.hovered = false
    }

    const onMove = (ev: MouseEvent) => {
      selectCom()
      handleMove(
        ev,
        props.com,
        scale.value,
        editorStore.pageConfig.grid,
        () => {
          editorStore.calcAlignLine(props.com)
        },
        () => {
          editorStore.hideAlignLine(props.com.id)
        },
      )
    }

    const onZoom = (ev: MouseEvent, dir: Direction) => {
      selectCom()
      handleZoom(
        ev,
        dir,
        props.com,
        scale.value,
        editorStore.isNormalResizeMode,
        () => {
          editorStore.calcAlignLine(props.com)
        },
        () => {
          editorStore.hideAlignLine(props.com.id)
        },
      )
    }

    const onRotate = (ev: MouseEvent) => {
      handleRotate(
        ev,
        instance.vnode.el as HTMLElement,
        props.com,
        () => {},
        () => {
          editorStore.hideAlignLine(props.com.id)
        },
      )
    }

    const { showMenu } = useContextMenu()

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
