<template>
  <div class="com-transform" :class="transformClass" :style="transformStyle">
    <div
      class="datav-scale"
      :class="scaleClass"
      :style="hideStyle"
      @mouseenter="mouseOver"
      @mouseleave="mouseOut"
      @mousedown="selectCom"
    >
      <div class="transform-handler" :class="handlerClass" :style="handlerStyle">
        <div
          class="datav-com"
          style="transform: scaleX(1) scaleY(1);"
          :style="hideStyle"
        >
          <slot></slot>
          <div
            class="datav-wraper-event-disable"
            :style="eventDisableStyle"
          ></div>
        </div>
        <i class="top-handler">
          <span
            class="control-point"
            :style="topPointStyle"
          ></span>
          <i class="point-handler-after"></i>
        </i>
        <i class="top-right-handler">
          <span
            class="rotate-handler"
            :style="topRightRotateStyle"
          >
            <span
              class="control-point"
              :style="topRightPointStyle"
            ></span>
          </span>
        </i>
        <i class="right-handler">
          <span
            class="control-point"
            :style="rightPointStyle"
          ></span>
          <i class="point-handler-after"></i>
        </i>
        <i class="bottom-right-handler">
          <span
            class="rotate-handler"
            :style="bottomRightRotateStyle"
          >
            <span
              class="control-point"
              :style="bottomRightPointStyle"
            ></span>
          </span>
        </i>
        <i class="bottom-handler">
          <span
            class="control-point"
            :style="bottomPointStyle"
          ></span>
          <i class="point-handler-after"></i>
        </i>
        <i class="bottom-left-handler">
          <span
            class="rotate-handler"
            :style="bottomLeftRotateStyle"
          >
            <span
              class="control-point"
              :style="bottomLeftPointStyle"
            ></span>
          </span>
        </i>
        <i class="left-handler">
          <span
            class="control-point"
            :style="leftPointStyle"
          ></span>
          <i class="point-handler-after"></i>
        </i>
        <i class="top-left-handler">
          <span
            class="rotate-handler"
            :style="topLeftRotateStyle"
          >
            <span
              class="control-point"
              :style="topLeftPointStyle"
            ></span>
          </span>
        </i>
        <div class="transform-bg"></div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, computed } from 'vue'
import { BaseComponent } from '@/domains/base-component'
import { EditorModule } from '@/store/modules/editor'

const hoverCom = (com: BaseComponent, hovered: boolean) => {
  com.hovered = hovered
}

export default defineComponent({
  name: 'DatavTransform',
  props: {
    com: {
      type: Object as PropType<BaseComponent>,
      required: true,
    },
  },
  setup(props) {
    const isDraggable = ref(false)
    const pageConfig = computed(() => EditorModule.pageConfig)
    const coms = computed(() => EditorModule.coms)
    const canvas = computed(() => EditorModule.canvas)
    const contextMenu = computed(() => EditorModule.contextMenu)

    const transformClass = computed(() => ({
      selected: props.com.selected,
      hide: props.com.hided,
      locked: props.com.locked,
    }))

    const transformStyle = computed(() => ({
      top: 0,
      left: 0,
      width: `${props.com.attr.w}px`,
      height: `${props.com.attr.h}px`,
      transform: `translate(${props.com.attr.x}px, ${props.com.attr.y}px)`,
    }))

    const scaleClass = computed(() => ({
      hovered: props.com.hovered,
    }))

    const hideStyle = computed(() => ({
      display: props.com.hided ? 'none' : 'block',
    }))

    const handlerClass = computed(() => ({
      hide: !props.com.selected || props.com.locked,
    }))

    const handlerStyle = computed(() => ({
      cursor: 'move',
      transform: `rotate(${props.com.attr.deg}deg)`,
    }))

    const eventDisableStyle = computed(() => ({
      width: `${props.com.attr.w}px`,
      height: `${props.com.attr.h}px`,
    }))

    const pointScale = computed(() => 1 / canvas.value.scale)

    const directions = computed(() => {
      const { deg } = props.com.attr
      const arr = [
        'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize',
        'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize',
      ]
      let i = 0
      if (deg >= 0 && deg < 23) {
        i = 0
      } else if (deg >= 23 && deg < 68) {
        i = 1
      } else if (deg >= 68 && deg < 113) {
        i = 2
      } else if (deg >= 113 && deg < 158) {
        i = 3
      } else if (deg >= 158 && deg < 203) {
        i = 4
      } else if (deg >= 203 && deg < 248) {
        i = 5
      } else if (deg >= 248 && deg < 293) {
        i = 6
      } else if (deg >= 293 && deg < 338) {
        i = 7
      }

      return arr.concat(arr.splice(0, i))
    })

    const topPointStyle = computed(() => ({
      cursor: directions.value[1],
      transform: `scale(${pointScale.value}, ${pointScale.value})`,
    }))

    const topRightRotateStyle = computed(() => ({
      'transform-origin': '25% 75%',
      transform: `scale(${pointScale.value}, ${pointScale.value})`,
    }))

    const topRightPointStyle = computed(() => ({
      cursor: directions.value[2],
    }))

    const rightPointStyle = computed(() => ({
      cursor: directions.value[3],
      transform: `scale(${pointScale.value}, ${pointScale.value})`,
    }))

    const bottomRightRotateStyle = computed(() => ({
      'transform-origin': '25% 25%',
      transform: `scale(${pointScale.value}, ${pointScale.value})`,
    }))

    const bottomRightPointStyle = computed(() => ({
      cursor: directions.value[4],
    }))

    const bottomPointStyle = computed(() => ({
      cursor: directions.value[5],
      transform: `scale(${pointScale.value}, ${pointScale.value})`,
    }))

    const bottomLeftRotateStyle = computed(() => ({
      'transform-origin': '75% 25%',
      transform: `scale(${pointScale.value}, ${pointScale.value})`,
    }))

    const bottomLeftPointStyle = computed(() => ({
      cursor: directions.value[6],
    }))

    const leftPointStyle = computed(() => ({
      cursor: directions.value[7],
      transform: `scale(${pointScale.value}, ${pointScale.value})`,
    }))

    const topLeftRotateStyle = computed(() => ({
      'transform-origin': '75% 75%',
      transform: `scale(${pointScale.value}, ${pointScale.value})`,
    }))

    const topLeftPointStyle = computed(() => ({
      cursor: directions.value[0],
    }))

    const selectCom = () => {
      contextMenu.value.show = false
      if (props.com.selected) {
        return
      }

      for (let i = 0, len = coms.value.length; i < len; i++) {
        const com = coms.value[i]
        if (com.id === props.com.id) {
          com.selected = true
          com.hovered = false
        } else {
          com.selected = false
        }
      }
    }

    const mouseOver = () => {
      hoverCom(props.com, true)
    }

    const mouseOut = () => {
      hoverCom(props.com, false)
    }

    return {
      isDraggable,
      pageConfig,
      coms,
      canvas,
      contextMenu,
      transformClass,
      transformStyle,
      scaleClass,
      hideStyle,
      handlerClass,
      handlerStyle,
      eventDisableStyle,
      pointScale,
      topPointStyle,
      topRightRotateStyle,
      topRightPointStyle,
      rightPointStyle,
      bottomRightRotateStyle,
      bottomRightPointStyle,
      bottomPointStyle,
      bottomLeftRotateStyle,
      bottomLeftPointStyle,
      leftPointStyle,
      topLeftRotateStyle,
      topLeftPointStyle,
      selectCom,
      mouseOver,
      mouseOut,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style';

</style>
