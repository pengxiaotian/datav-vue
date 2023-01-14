<script lang="ts">
import { defineComponent, h, computed, ref, shallowRef, watch, nextTick, inject, onMounted, onUnmounted } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import gsap from 'gsap'
import { CarouselTable, CarouselTableSeries, defaultImg } from '../carousel-table'
import { CarouselTableDto, carouselTableInjectionKey } from '../context'


export default defineComponent({
  name: 'CarouselTableItem',
  props: {
    data: {
      type: Object as PropType<CarouselTableDto>,
      required: true,
    },
    tableWidth: {
      type: Number,
      required: true,
    },
    globalConfig: {
      type: Object as PropType<CarouselTable['config']['global']>,
      required: true,
    },
    config: {
      type: Object as PropType<CarouselTableSeries>,
      required: true,
    },
  },
  setup(props) {
    const { isHighLight } = inject(carouselTableInjectionKey)

    const showError = ref(false)
    const columnRef = ref(null)
    const marqueeTextRef = ref(null)
    const columnWidth = ref(0)
    const textWidth = ref(0)
    const transform = ref(0)
    const tween = shallowRef<gsap.core.Tween>(null)

    const textTypeStyle = computed(() => {
      const { width, textAlign, textStyle, isBr } = props.config
      let style = {
        display: 'inline-block',
        'vertical-align': 'middle',
        'background-color': 'transparent',
        'text-align': textAlign,
        overflow: 'hidden',
        width: `${width}%`,
        color: textStyle.color,
        fontFamily: textStyle.fontFamily,
        'font-size': `${textStyle.fontSize}px`,
        'font-weight': textStyle.fontWeight,
      }
      if (isBr) {
        style['word-break'] = 'break-all'
      } else {
        style['white-space'] = 'nowrap'
      }
      return style as CSSProperties
    })

    const getDefaultTransform = () => {
      const { textAlign } = props.config
      if (textAlign === 'left') {
        return 0
      }

      if (textAlign === 'center') {
        return (columnWidth.value - textWidth.value + 4) / 2
      }

      if (textAlign === 'right') {
        return columnWidth.value - textWidth.value + 4
      }

      return 0
    }

    const doMarquee = () => {
      const { ifRun } = props.globalConfig.textAnimate
      if (!ifRun || props.config.isBr) {
        return
      }

      nextTick(() => {
        if (columnRef.value) {
          columnWidth.value = columnRef.value.offsetWidth
        }

        if (marqueeTextRef.value) {
          textWidth.value = marqueeTextRef.value.offsetWidth + 4
        }

        const { isSpeed, animateDur, speedRate } = props.globalConfig.textAnimate
        if (textWidth.value > columnWidth.value) {
          const time = isSpeed ? speedRate * textWidth.value : animateDur
          tween.value = gsap.fromTo(transform, {
            value: getDefaultTransform(),
          }, {
            value: -textWidth.value,
            duration: time,
            ease: 'none',
            repeatDelay: 0.5,
            repeat: Infinity,
          })
        } else {
          stopLoop()
        }
      })
    }

    const getHighLightStyle = () => {
      const { textStyle } = props.globalConfig.highLight.hlStyle
      return isHighLight(props.data.$$datav_index)
        ? {
          display: 'inline-block',
          'background-image': 'none',
          'background-clip': 'unset',
          '-webkit-text-fill-color': 'initial',
          color: textStyle.color,
          'font-size': `${textStyle.fontSize}px`,
          'font-weight': textStyle.fontWeight,
          'font-family': textStyle.fontFamily,
        }
        : {
          display: 'inline-block',
        }
    }

    const createMarqueeImg = (imgSrc: string) => {
      return h('img', {
        src: showError.value
          ? (props.globalConfig.defaultImg || defaultImg)
          : imgSrc,
        class: 'marquee-img',
        style: {
          width: `${props.config.widthPercent}px`,
          'margin-left': 0,
          'margin-top': 0,
          'font-size': 0,
        },
        onError() {
          showError.value = true
        },
      })
    }

    const createMarquee = () => {
      const { data, config, tableWidth } = props
      const val = data[config.columnName]
      return [
        h('span', {
          ref: marqueeTextRef,
          class: 'marquee-text-span',
          style: getHighLightStyle(),
        }, val == null
          ? '-' : config.dataType === 'img'
            ? createMarqueeImg(val) : val,
        ),
        h('i', {
          style: {
            display: 'inline-block',
            width: `${config.isBr ? 0 : textWidth.value > columnWidth.value ? 0: tableWidth}px`,
          },
        }),
      ]
    }

    const createColumn = () => {
      const nodes: any[] = [createMarquee()]
      if (!props.config.isBr) {
        nodes.push(' ', createMarquee())
      }

      return h('div', {
        ref: columnRef,
        class: 'column cell-content',
        style: textTypeStyle.value,
      }, h('div', {
        class: 'marquee-text',
        style: {
          display: 'inline-block',
          transform: `translateX(${transform.value}px)`,
        },
      }, nodes))
    }

    const stopLoop = () => {
      tween.value?.kill()
      transform.value = getDefaultTransform()
    }


    watch([
      textTypeStyle,
      props.globalConfig.textAnimate,
      () => props.tableWidth,
      () => props.data[props.config.columnName],
    ], () => {
      if (props.config.dataType === 'img') {
        showError.value = false
      }

      stopLoop()
      doMarquee()
    })

    onMounted(() => {
      doMarquee()
    })

    onUnmounted(() => {
      stopLoop()
    })

    return {
      createColumn,
    }
  },
  render() {
    return this.createColumn()
  },
})
</script>
