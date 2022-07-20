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
      @contextmenu="showMenu($event, com)"
      @click.stop
      @dblclick.stop="selectInnerItem"
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

<script lang='ts' setup>
import { PropType, computed, getCurrentInstance, ref, ComponentInternalInstance } from 'vue'
import type { CSSProperties } from 'vue'
import { DatavComponent, checkComponentAttr } from '@/components/_models/datav-component'
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

const props = defineProps({
  com: {
    type: Object as PropType<DatavComponent>,
    required: true,
  },
  parentCom: {
    type: Object as PropType<DatavComponent>,
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
    display: props.com.hided ? 'none' : 'block',
    transform: zoom ? `scale(${sx.toFixed(6)}, ${sy.toFixed(6)})` : undefined,
  }
})

const handlerClass = computed(() => ({
  hided: !props.com.selected || props.com.locked,
}))

const handlerStyle = computed(() => {
  const style = {
    cursor: props.com.selected ? 'move' : 'inherit',
    transform: `rotate(${props.com.attr.deg}deg)`,
  }

  const { zoom, sx, sy } = props.com.scaling
  if (zoom) {
    style.transform = `scale(${(1 / sx).toFixed(6)}, ${(1 / sy).toFixed(6)}) ${style.transform} scale(${sx.toFixed(6)}, ${sy.toFixed(6)})`
  }

  return style
})

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

const relativeState = computed(() => {
  return {
    hovered: props.parentCom?.selected,
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
    handleRotate(ev, instance.vnode.el as HTMLElement, m)
  })
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
    if (props.parentCom.selected) {
      selectCom(ev)
    } else {
      const ps = getParentProps()
      ps.instances[0].exposed.selectCom(ev)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
