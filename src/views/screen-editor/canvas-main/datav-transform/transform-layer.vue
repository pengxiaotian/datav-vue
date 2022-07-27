<script lang="ts">
import { defineComponent, h, PropType, computed, getCurrentInstance, ref, ComponentInternalInstance, withModifiers } from 'vue'
import type { CSSProperties } from 'vue'
import { DatavComponent, checkComponentAttr, ComType } from '@/components/_models/datav-component'
import { DatavGroup } from '@/components/_internal/group'
import { useEditorStore } from '@/store/editor'
import { useComStore, getChildState } from '@/store/com'
import { macMetaOrCtrl } from '@/utils/util'
import { once } from '@/utils/dom'
import { Direction, ControlPoint, getCursors, handleMove, handleZoom, handleRotate, handleChildrenRotate } from './index'
import { useContextMenu } from '../../editor-context-menu/index'
import ReferLine from './refer-line.vue'


export default defineComponent({
  name: 'TransformLayer',
  props: {
    com: {
      type: Object as PropType<DatavGroup | DatavComponent>,
      required: true,
    },
    parentCom: {
      type: Object as PropType<DatavGroup | DatavComponent>,
    },
    editable: Boolean,
  },
  setup(props, ctx) {
    checkComponentAttr(props.com)

    const instance = getCurrentInstance()
    const editorStore = useEditorStore()
    const comStore = useComStore()
    const { showMenu, hideMenu } = useContextMenu()

    const isMoveing = ref(false)
    const isLayer = computed(() => props.com.type === ComType.layer)
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
      'datav-transform': true,
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

    const scaleClass = computed(() => ({
      'datav-scale': true,
      hovered: props.com.hovered,
      '--relative-hovered': relativeState.value.hovered,
    }))

    const scaleStyle = computed(() => {
      const { zoom, sx, sy } = props.com.scaling
      const transform = zoom ? `scale(${sx.toFixed(6)}, ${sy.toFixed(6)})` : undefined
      if (isLayer.value) {
        return {
          transform: transform || 'none',
        }
      }
      return {
        display: props.com.hided ? 'none' : 'block',
        transform,
      }
    })

    const layerStyle = computed(() => {
      const { hided, attr, scaling } = props.com
      const style = {
        overflow: 'visible',
        display: hided ? 'none' : 'block',
        transform: `rotate(${attr.deg}deg)`,
        opacity: attr.opacity,
      }

      const { zoom, sx, sy } = scaling
      if (zoom) {
        style.transform = `scale(${(1 / sx).toFixed(6)}, ${(1 / sy).toFixed(6)}) ${style.transform} scale(${sx.toFixed(6)}, ${sy.toFixed(6)})`
      }

      return style
    })

    const handlerStyle = computed(() => {
      const { selected, attr } = props.com as DatavGroup
      const style: CSSProperties = {
        cursor: selected ? 'move' : 'inherit',
      }

      if (isLayer.value) {
        if (attr.apply3d) {
          style.perspective = `${attr.perspective}px`
          style.perspectiveOrigin = `${attr.perspectiveOrigin.x}% ${attr.perspectiveOrigin.y}%`
        }
      } else {
        const { zoom, sx, sy } = props.com.scaling
        style.transform = zoom
          ? `scale(${(1 / sx).toFixed(6)}, ${(1 / sy).toFixed(6)}) ${style.transform} scale(${sx.toFixed(6)}, ${sy.toFixed(6)})`
          : `rotate(${props.com.attr.deg}deg)`
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

    const cursor = computed(() => getCursors(props.com.attr.deg))

    const points = computed<ControlPoint>(() => {
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

    const relativeState = computed(() => {
      let hovered = props.parentCom?.selected
      let selected = false
      if (isLayer.value && !hovered) {
        const s = getChildState(props.com)
        hovered = s.hovered || s.selected
        selected =  s.selected
      }
      return {
        hovered,
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

      const { attr: ga, config: gc } = props.com as DatavGroup
      if (ga.apply3d) {
        const config = gc.find(m => m.transform3d.id === item.id)
        const { rotate3d: r, scale3d: s, translate3d: t } = config.transform3d
        style.transform = `translate3d(${t.x}px, ${t.y}px, ${t.z}px) scale3d(${s.x}, ${s.y}, 1) ${getRotate3d(r.axis, r.deg)}`
      }
      return style
    }

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
      if (isMult || !props.com.selected) {
        comStore.select(props.com.id, props.com.parentId, isMult)
      }
    }

    const showContextMenu = (ev: MouseEvent) => {
      if (props.parentCom && !props.editable) {
        const ps = getParentProps()
        const idx = ps.editables.lastIndexOf(false)
        showMenu(ev, ps.coms[idx])
      } else {
        showMenu(ev, props.com)
      }
    }

    const onDown = (ev: MouseEvent) => {
      if (props.parentCom && !props.editable) {
        const ps = getParentProps()
        const idx = ps.editables.lastIndexOf(false)
        const pins = ps.instances[idx]
        // @ts-ignore
        pins.proxy.onMove(ev)
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
            if (isLayer.value) {
              comStore.resizeChildren(m)
            }

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
          if (isLayer.value) {
            handleChildrenRotate(m, deg)
          }
        })
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
          // @ts-ignore
          ps.instances[0].proxy.selectCom(ev)
        }
      }
    }

    const createSliderItem = (item: DatavComponent | DatavGroup) => {
      return h('div', {
        key: item.id,
        class: 'slider-item',
        style: getSliderItemStyle(item),
      }, {
        default: () => ctx.slots.default({
          data: item,
          editable: relativeState.value.selected,
        }),
      })
    }

    const createComItem = () => {
      return h('div', {
        class: 'datav-com',
        style: comStyle.value,
      }, {
        default: () => [
          ctx.slots.default(),
          h('div', {
            class: 'datav-wrapper-event-disable',
            style: wrapperStyle.value,
          }),
        ],
      })
    }

    const createPoint = <T extends Direction>(k: T, p: ControlPoint[T]) => {
      const point = h('span', {
        class: 'control-point',
        style: p.style,
        onMousedown: withModifiers((ev: MouseEvent) => {
          onZoom(ev, k)
        }, ['stop']),
      })

      if (p.rotateStyle) {
        return h('i', {
          class: `${p.name}-handler`,
          'data-html2canvas-ignore': true,
        }, h('span', {
          class: 'rotate-handler',
          style: p.rotateStyle,
          onMousedown: withModifiers((ev: MouseEvent) => {
            onRotate(ev)
          }, ['stop']),
        }, point))
      }

      return h('i', {
        class: `${p.name}-handler`,
        'data-html2canvas-ignore': true,
      }, point)
    }

    const createTransform = () => {
      return h('div', {
        class: {
          'transform-handler': true,
          hided: !props.com.selected || props.com.locked,
        },
        style: handlerStyle.value,
      }, {
        default: () => {
          let list = []
          if (isLayer.value) {
            list = props.com.children.map(m => createSliderItem(m))
          } else {
            list.push(createComItem())
          }

          for (const [k, v] of Object.entries(points.value)) {
            list.push(createPoint(k as Direction, v))
          }

          list.push(h('div', { class: 'transform-bg' }))
          return list
        },
      })
    }

    const createSlider = () => {
      return h('div', {
        class: 'datav-layer slider',
        style: layerStyle.value,
      }, createTransform())
    }

    return {
      scale,
      referLine,
      referLinePos,
      transformClass,
      transformStyle,
      scaleClass,
      scaleStyle,
      createTransform,
      createSlider,
      onEnter,
      onLeave,
      onDown,
      onMove,
      selectCom,
      showContextMenu,
      selectInnerItem,
    }
  },
  render() {
    const { scale, referLine, referLinePos } = this
    return h('div', {
      class: this.transformClass,
      style: this.transformStyle,
    }, {
      default: () => {
        return [
          referLine.enable && this.$props.com.selected
            ? h(ReferLine, { scale, pos: referLinePos }) : null,
          h('div', {
            class: this.scaleClass,
            style: this.scaleStyle,
            onMouseenter: withModifiers(this.onEnter, ['stop']),
            onMouseleave: withModifiers(this.onLeave, ['stop']),
            onMousedown: withModifiers(this.onDown, ['stop']),
            onContextmenu: withModifiers(this.showContextMenu, ['stop']),
            onDblclick: withModifiers(this.selectInnerItem, ['stop']),
            onClick: withModifiers(() => {}, ['stop']),
          },
          this.$props.com.type === ComType.layer
            ? this.createSlider()
            : this.createTransform(),
          ),
        ]
      },
    })
  },
})
</script>

<style lang="scss" scoped>
@import './style';
</style>
