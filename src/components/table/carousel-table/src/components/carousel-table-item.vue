<script lang="ts">
import { defineComponent, h, computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import { debounce } from 'lodash-es'
import gsap from 'gsap'
import { CarouselTable, CarouselTableSeries, defaultImg } from '../carousel-table'


export default defineComponent({
  name: 'CarouselTableItem',
  props: {
    data: {
      type: Object,
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
    const showError = ref(false)
    const columnRef = ref(null)
    const marqueeTextRef = ref(null)
    const columnWidth = ref(0)
    const textWidth = ref(0)
    const transform = ref(0)
    const timeId = ref(0)

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
          const t = isSpeed ? speedRate * textWidth.value : animateDur
          timeId.value = window.setTimeout(() => {
            doMarquee()
          }, t * 1000)

          gsap.fromTo(transform, {
            value: 0,
          }, {
            duration: t,
            value: textWidth.value,
            ease: 'none',
          })
        } else {
          transform.value = 0
        }
      })
    }

    const debouncedDoMarquee = debounce(doMarquee, 500)

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
          style: 'display: inline-block',
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
          transform: `translateX(-${transform.value}px)`,
        },
      }, nodes))
    }

    watch([
      textTypeStyle,
      props.globalConfig.textAnimate,
      () => props.data[props.config.columnName],
    ], () => {
      if (props.config.dataType === 'img') {
        showError.value = false
      }

      clearTimeout(timeId.value)
      debouncedDoMarquee()
    })

    onMounted(() => {
      debouncedDoMarquee()
    })

    onUnmounted(() => {
      clearTimeout(timeId.value)
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
