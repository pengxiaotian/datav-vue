<template>
  <div
    class="datav-transform"
    :class="transformClass"
    :style="transformStyle"
  >
    <ReferLine
      v-if="referLine.enable && com.selected"
      :pos="referLinePos"
      :scale="scale"
    />
    <div
      :class="[
        'datav-scale',
        {
          hovered: com.hovered,
          '--relative-hovered': relativeState.hovered,
        }
      ]"
      :style="scaleStyle"
      @mouseenter.stop="onEnter"
      @mouseleave.stop="onLeave"
      @mousedown.stop="onDown"
      @contextmenu="showContextMenu"
      @click.stop
      @dblclick.stop="selectInnerItem"
    >
      <div
        class="datav-layer slider"
        :style="layerStyle"
      >
        <div
          class="transform-handler"
          :class="handlerClass"
          :style="handlerStyle"
        >
          <div
            v-for="item in com.children"
            :key="item.id"
            class="slider-item"
            :style="getSliderItemStyle(item)"
          >
            <slot :data="item" :editable="relativeState.selected"></slot>
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
  </div>
</template>

<script lang='ts' setup>
import { PropType, computed, getCurrentInstance, ref, ComponentInternalInstance } from 'vue'
import type { CSSProperties } from 'vue'
import { DatavComponent, checkComponentAttr } from '@/components/_models/datav-component'
import { DatavGroup } from '@/components/_internal/group'
import { useEditorStore } from '@/store/editor'
import { useComStore, getChildState } from '@/store/com'
import { macMetaOrCtrl } from '@/utils/util'
import { once } from '@/utils/dom'
import {
  Direction, getCursors,
  handleMove, handleZoom, handleRotate, handleChildrenRotate,
} from './index'
import { useContextMenu } from '../../editor-context-menu/index'
import ReferLine from './refer-line.vue'

const props = defineProps({
  com: {
    type: Object as PropType<DatavGroup>,
    required: true,
  },
  parentCom: {
    type: Object as PropType<DatavGroup>,
  },
  editable: {
    type: Boolean,
  },
})


checkComponentAttr(props.com)

const instance = getCurrentInstance()
const editorStore = useEditorStore()
const comStore = useComStore()
const { showMenu, hideMenu } = useContextMenu()

const isMoveing = ref(false)
const scale = computed(() => editorStore.canvas.scale)
const referLine = computed(() => editorStore.referLine)
const referLinePos = computed(() => {
  let { x, y } = props.com.attr
  const ps = getParentProps()
  ps.coms.forEach(m => {
    x += m.attr.x
    y += m.attr.y
  })
  return { x, y }
})

const transformClass = computed(() => ({
  selected: props.com.selected,
  hided: props.com.hided,
  locked: props.com.locked,
}))

const transformStyle = computed(() => {
  const { x, y, w, h } = props.com.attr
  return {
    top: 0,
    left: 0,
    width: `${w}px`,
    height: `${h}px`,
    transform: `translate(${x}px, ${y}px)`,
  }
})

const scaleStyle = computed(() => {
  const { zoom, sx, sy } = props.com.scaling
  return {
    transform: zoom ? `scale(${sx.toFixed(6)}, ${sy.toFixed(6)})` : 'none',
  }
})

const layerStyle = computed(() => {
  const style = {
    transform: `rotate(${props.com.attr.deg}deg)`,
    opacity: props.com.attr.opacity,
    overflow: 'visible',
    display: props.com.hided ? 'none' : 'block',
  }

  const { zoom, sx, sy } = props.com.scaling
  if (zoom) {
    style.transform = `scale(${(1 / sx).toFixed(6)}, ${(1 / sy).toFixed(6)}) ${style.transform} scale(${sx.toFixed(6)}, ${sy.toFixed(6)})`
  }

  return style
})

const handlerClass = computed(() => ({
  hided: !props.com.selected || props.com.locked,
}))

const handlerStyle = computed(() => {
  const { selected, attr } = props.com
  const cursor = selected ? 'move' : 'inherit'
  if (attr.apply3d) {
    return {
      cursor,
      perspective: `${attr.perspective}px`,
      'perspective-origin': `${attr.perspectiveOrigin.x}% ${attr.perspectiveOrigin.y}%`,
    }
  }

  return {
    cursor,
  }
})

const cursor = computed(() => getCursors(props.com.attr.deg))

const points = computed<{
  [k in Direction]: {
    name: string
    style: Partial<CSSProperties>
    rotateStyle?: Partial<CSSProperties>
  }
}>(() => {
  const { zoom, sx, sy } = props.com.scaling
  const transform = zoom
    ? `scale(${1 / sx / scale.value}, ${1 / sy / scale.value})`
    : `scale(${1 / scale.value}, ${1 / scale.value})`
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
  if (props.parentCom) {
    if (props.editable && !props.com.selected) {
      props.com.hovered = true
    }
  } else if (!props.com.selected) {
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

  comStore.select(props.com.id, props.com.parentId, isMult)
}

const showContextMenu = (ev: MouseEvent) => {
  if (props.parentCom && !props.editable) {
    showMenu(ev, props.parentCom)
  } else {
    showMenu(ev, props.com)
  }
}

const onDown = (ev: MouseEvent) => {
  if (props.parentCom && !props.editable) {
    const ps = getParentProps()
    const idx = ps.editables.lastIndexOf(false)
    const pins = ps.instances[idx]
    pins.exposed.onMove(ev)
  } else {
    onMove(ev)
  }
}

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
            editorStore.hideAlignLine(props.com.id)
            const ps = getParentProps()
            if (ps.coms.length > 0) {
              comStore.resizeParents(ps.coms)
            }
          } else if (ev.button === 0) {
            comStore.select(props.com.id, props.com.parentId)
          }
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

  const doZoom = (m: DatavComponent, isNormal: boolean) => {
    m.scaling.w = m.attr.w
    m.scaling.h = m.attr.h
    handleZoom(
      ev,
      dir,
      m,
      scale.value,
      isNormal,
      () => {
        m.scaling.zoom = true
        m.scaling.sx = m.scaling.w / m.attr.w
        m.scaling.sy = m.scaling.h / m.attr.h
      },
      () => {
        comStore.resizeChildren(m)
        m.scaling.zoom = false
        m.scaling.sx = 1
        m.scaling.sy = 1
        m.attr.w = m.scaling.w
        m.attr.h = m.scaling.h
        const ps = getParentProps()
        if (ps.coms.length > 0) {
          comStore.resizeParents(ps.coms)
        }
      },
    )
  }

  if (comStore.selectedComs.length > 1) {
    comStore.selectedComs.forEach(m => {
      doZoom(m, true)
    })
  } else {
    doZoom(props.com, editorStore.isNormalResizeMode)
  }
}

const onRotate = (ev: MouseEvent) => {
  hideMenu()
  comStore.selectedComs.forEach(m => {
    handleRotate(ev, instance.vnode.el as HTMLElement, m, deg => {
      handleChildrenRotate(m, deg)
    })
  })
}

const relativeState = computed(() => {
  let hovered = props.parentCom?.selected
  let selected = false
  if (!hovered) {
    const s = getChildState(props.com)
    hovered = s.hovered
    selected =  s.selected
  }
  return {
    hovered: hovered || selected,
    selected,
  }
})

const getRotate3d = (axis: string, deg: number) => {
  const isAxis = (axis1: string, axis2: string) => {
    return axis1 === axis2 ? 1 : 0
  }

  return `rotate3d(${isAxis(axis, 'x')}, ${isAxis(axis, 'y')}, ${isAxis(axis, 'z')}, ${deg}deg)`
}

const getSliderItemStyle = (item: DatavComponent) => {
  const { attr } = item
  const style: CSSProperties = {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'block',
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    width: 'auto',
    height: 'auto',
    position: 'absolute',
    transformOrigin: `${attr.w / 2 + attr.x}px ${attr.h / 2 + attr.y}`,
  }

  if ( props.com.attr.apply3d) {
    const config = props.com.config.find(m => m.transform3d.id === item.id)
    const { rotate3d: r, scale3d: s, translate3d: t } = config.transform3d
    style.transform = `translate3d(${t.x}px, ${t.y}px, ${t.z}px) scale3d(${s.x}, ${s.y}, 1) ${getRotate3d(r.axis, r.deg)}`
  }
  return style
}

const getParentProps = (): {
  coms: DatavComponent[]
  editables: boolean[]
  instances: ComponentInternalInstance[]
} => {
  const coms = []
  const editables = []
  const instances = []
  const getParent = (ins: ComponentInternalInstance) => {
    const pc = ins.props.parentCom
    if (pc) {
      coms.push(pc)
      editables.push(ins.props.editable ?? false)
      instances.push(ins.parent)
      getParent(ins.parent)
    }
  }

  getParent(instance)

  return {
    coms,
    editables,
    instances,
  }
}

const selectInnerItem = (ev: MouseEvent) => {
  if (props.parentCom && !props.editable) {
    selectCom(ev)
  }
}

defineExpose({
  onMove,
  selectCom,
})
</script>

<style lang="scss" scoped>
@import './style';
</style>
