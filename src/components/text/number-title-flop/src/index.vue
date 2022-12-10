<template>
  <div class="datav-wrapper" :style="wrapperStyle">
    <div ref="titleRef" :style="titleStyle">
      {{ titleText }}
    </div>
    <div :style="counterStyle">
      <span :style="prefixStyle">
        {{ prefixText }}
      </span>
      <span
        v-for="(n, i) in realNumber"
        :key="i"
        :style="[n === separatingSymbol ? separateCharStyle : numberStyle]"
      >
        {{ n }}
      </span>
      <span :style="suffixStyle">
        {{ suffixText }}
      </span>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, toRef, computed, watchEffect } from 'vue'
import type { CSSProperties } from 'vue'
import gsap from 'gsap'
import Accounting from 'accounting'
import NP from 'number-precision'
import { useDataCenter, getFieldMap } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import { calcStrWidth } from '@/utils/string-util'
import { NumberTitleFlop } from './number-title-flop'

export default defineComponent({
  name: 'VNumberTitleFlop',
  props: {
    com: {
      type: Object as PropType<NumberTitleFlop>,
      required: true,
    },
  },
  setup(props) {
    const apiStore = useApiStore()
    useDataCenter(props.com)
    const titleRef = ref(null)

    const dv_data = computed(() => {
      return apiStore.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const numVal = ref(0)
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const titleText = computed((): string => {
      return dv_data.value[dv_field.value.title] || config.value.title.content
    })

    const prefixText = computed((): string => {
      return dv_data.value[dv_field.value.prefix] ?? config.value.counter.prefix.content
    })

    const suffixText = computed((): string => {
      return dv_data.value[dv_field.value.suffix] ?? config.value.counter.suffix.content
    })

    const separatingSymbol = computed(() => {
      return config.value.numbers.separatingSymbol
        ? config.value.numbers.separatingSymbol.charAt(0)
        : ','
    })

    const decimalSymbol = computed(() => {
      return config.value.numbers.decimalSymbol
        ? config.value.numbers.decimalSymbol.charAt(0)
        : '.'
    })

    const duration = computed(() => {
      return config.value.numbers.duration > 0
        ? config.value.numbers.duration
        : 0
    })

    const realNumber = computed(() => {
      const { numbers } = config.value
      let value = Accounting.toFixed(numVal.value, numbers.decimal)
      const hasDecimal = value.includes('.')
      let [lStr, rStr = ''] = value.split('.')
      if (numbers.digit > 0) {
        const _digit = numbers.digit - rStr.length
        if (_digit > 0) {
          lStr = (Array(_digit).join('0') + lStr).slice(-_digit)
        } else {
          lStr = '0'
          rStr = rStr.slice(0, _digit || -1)
        }
      }

      if (numbers.separatingChart) {
        lStr = lStr.replace(/(?=\B(\d{3})+($|\.))/g, separatingSymbol.value)
      }

      const rn = hasDecimal ? `${lStr}${decimalSymbol.value}${rStr}` : lStr
      return rn.split('')
    })

    const wrapperStyle = computed(() => {
      const arrangement = config.value.global.arrangement
      let style = {}
      if (arrangement === 'top') {
        style = {
          display: 'block',
          alignItems: 'start',
          flexDirection: 'column',
        }
      } else if (arrangement === 'left') {
        style = {
          display: 'flex',
          alignItems: 'baseline',
          flexDirection: 'row',
        }
      } else if (arrangement === 'bottom') {
        style = {
          display: 'flex',
          alignItems: 'start',
          flexDirection: 'column-reverse',
        }
      }
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        ...style,
      } as Partial<CSSProperties>
    })

    const titleStyle = computed(() => {
      const { fontFamily, arrangement, distance } = config.value.global
      const { textStyle } = config.value.title

      const style: Partial<CSSProperties> = {
        display: 'flex',
        alignItems: 'center',
        color: textStyle.color,
        fontWeight: textStyle.fontWeight as any,
        fontFamily: `${fontFamily}, Arial, sans-serif`,
        fontSize: `${textStyle.fontSize}px`,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        lineHeight: 'normal',
        margin: '0px',
        justifyContent: textStyle.textAlign,
        width: '100%',
      }

      if (arrangement === 'top') {
        style.margin = `0px 0px ${distance}px`
      } else if (arrangement === 'left') {
        style.width = 'auto'
        style.margin = `0px ${distance}px 0px 0px`
      } else if (arrangement === 'bottom') {
        style.margin = `${distance}px 0px 0px`
      }
      return style
    })

    const counterStyle = computed(() => {
      const { title, counter, numbers, global } = config.value
      const style: Partial<CSSProperties> = {
        display: 'flex',
        alignItems: 'baseline',
        color: numbers.textStyle.color,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        justifyContent: counter.justifyContent,
        fontFamily: counter.fontFamily,
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }

      const titleFont = `${title.textStyle.fontWeight} ${title.textStyle.fontSize}px ${global.fontFamily}, Arial, sans-serif`
      const titleContainerW = calcStrWidth(titleText.value, titleFont)
      const titleContainerH = title.textStyle.fontSize + 10
      const arrangement = global.arrangement
      if (arrangement === 'top' || arrangement === 'bottom') {
        style.width = `${attr.value.w}px`
        style.height = `${attr.value.h - titleContainerH}px`
      } else if (arrangement === 'left') {
        style.width = `${attr.value.w - titleContainerW}px`
        style.height = `${attr.value.h}px`
      }
      return style
    })

    const prefixStyle = computed(() => {
      const { prefix, margin } = config.value.counter
      return {
        marginRight: `${margin.preNum}px`,
        color: prefix.textStyle.color,
        fontSize: `${prefix.textStyle.fontSize}px`,
        fontWeight: prefix.textStyle.fontWeight,
        VerticalAlign: 'super',
        fontFamily: config.value.global.fontFamily,
      } as CSSProperties
    })

    const suffixStyle = computed(() => {
      const { suffix, margin } = config.value.counter
      return {
        marginLeft: `${margin.numSuff}px`,
        color: suffix.textStyle.color,
        fontSize: `${suffix.textStyle.fontSize}px`,
        fontWeight: suffix.textStyle.fontWeight,
        VerticalAlign: 'super',
        fontFamily: config.value.global.fontFamily,
      } as CSSProperties
    })

    const numberStyle = computed(() => {
      const { numbers } = config.value
      const style: Partial<CSSProperties> = {
        display: 'inline-block',
        textIndent: '0.02em',
        letterSpacing: '0.02em',
        height: 'auto',
        lineHeight: 'normal',
        backgroundColor: numbers.bgColor,
        fontSize: `${numbers.textStyle.fontSize}px`,
        fontWeight: numbers.textStyle.fontWeight as any,
        marginRight: `${numbers.marginRight}em`,
        borderRadius: `${numbers.bgRadius}px`,
      }
      if (numbers.fixedWidth > 0) {
        style.width = `${numbers.fixedWidth}px`
      }
      return style
    })

    const separateCharStyle = computed(() => {
      const { numbers } = config.value
      const style: Partial<CSSProperties> = {
        display: 'inline-block',
        textIndent: '0.02em',
        letterSpacing: '0.02em',
        height: 'auto',
        lineHeight: 'normal',
        fontSize: `${numbers.textStyle.fontSize}px`,
        fontWeight: numbers.textStyle.fontWeight as any,
        marginRight: `${numbers.marginRight}em`,
        borderRadius: `${numbers.bgRadius}px`,
      }
      if (numbers.bgSeparating) {
        style.backgroundColor = numbers.bgColor
      }
      return style
    })

    watchEffect(() => {
      const { numbers } = config.value
      let num: number = dv_data.value[dv_field.value.value] || 0
      const divisor = numbers.divisor || 0
      if (divisor !== 0) num = NP.divide(num, divisor)

      if (numbers.animation) {
        gsap.to(numVal, {
          duration: duration.value / 1000,
          value: num,
        })
      } else {
        numVal.value = num
      }
    })

    return {
      titleRef,
      titleText,
      prefixText,
      suffixText,
      separatingSymbol,
      decimalSymbol,
      duration,
      realNumber,
      wrapperStyle,
      titleStyle,
      counterStyle,
      prefixStyle,
      suffixStyle,
      numberStyle,
      separateCharStyle,
    }
  },
})
</script>
