<template>
  <g-input
    v-if="componentType === componentTypes.input"
    v-model="strValue"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-input-number
    v-else-if="componentType === componentTypes.number"
    v-model="numValue"
    :min="min"
    :max="max"
    :step="step"
    :suffix="suffix"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-color-picker
    v-else-if="componentType === componentTypes.color"
    v-model="strValue"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <el-checkbox
    v-else-if="componentType === componentTypes.checkbox"
    v-model="boolValue"
  />
  <el-switch
    v-else-if="componentType === componentTypes.switch"
    v-model="boolValue"
  />
  <el-radio-group
    v-else-if="componentType === componentTypes.radio"
    v-model="strValue"
  >
    <el-radio-button
      v-for="em in enums"
      :key="em"
      :label="em"
    >
      {{ em }}
    </el-radio-button>
  </el-radio-group>
  <el-slider
    v-else-if="componentType === componentTypes.slider"
    v-model="numValue"
    :min="min"
    :max="max"
    :step="step"
    :show-tooltip="false"
    show-input
    input-size="mini"
    class="g-slider"
  />
  <g-select
    v-else-if="componentType === componentTypes.select"
    v-model="strValue"
    :data="[]"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
    disabled
  />
  <g-select
    v-else-if="componentType === componentTypes.fontFamily"
    v-model="strValue"
    :data="fontFamilys"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.fontWeight"
    v-model="strValue"
    :data="fontWeights"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.fontStyle"
    v-model="strValue"
    :data="fontStyles"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.hAlign"
    v-model="strValue"
    :data="hAligns"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.vAlign"
    v-model="strValue"
    :data="vAligns"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.writingMode"
    v-model="strValue"
    :data="writingModes"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.justify"
    v-model="strValue"
    :data="justifyContents"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.align"
    v-model="strValue"
    :data="aligns"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.angle"
    v-model="strValue"
    :data="angles"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.location"
    v-model="strValue"
    :data="locations"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.lineStyle"
    v-model="strValue"
    :data="lineStyles"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.fillType"
    v-model="strValue"
    :data="fillTypes"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-select
    v-else-if="componentType === componentTypes.repeatType"
    v-model="strValue"
    :data="repeatTypes"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <g-upload-image
    v-else-if="componentType === componentTypes.uploadImage"
    v-model="strValue"
    :is-inline="isFlat"
    :label="isFlat ? label : ''"
  />
  <span v-else>--</span>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, watch } from 'vue'
import { PropDataType, ComponentType } from '@/domains/dev/prop-config'
import {
  fontFamilys,
  fontWeights,
  fontStyles,
  hAligns,
  vAligns,
  writingModes,
  justifyContents,
  aligns,
  angles,
  locations,
  lineStyles,
  fillTypes,
  repeatTypes,
} from '@/data/select-options'

export default defineComponent({
  name: 'PreviewPropItem',
  props: {
    dataType: {
      type: String as PropType<PropDataType>,
      required: true,
    },
    componentType: {
      type: String as PropType<ComponentType>,
      required: true,
    },
    defaultValue: {
      type: [String, Number, Boolean, Array, Object],
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    step: {
      type: Number,
      default: 1,
    },
    suffix: String,
    label: String,
    isFlat: Boolean,
    enums: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    whichEnum: {
      type: Object as PropType<{
        field: string
        value: string
      }>,
      default: () => ({
        field: '',
        value: '',
      }),
    },
  },
  setup(props) {
    const componentTypes = ref({ ...ComponentType })

    const strValue = ref('')
    const numValue = ref(0)
    const boolValue = ref(false)
    const arrValue = ref<(string | number)[]>([])

    watch(
      () => props.componentType,
      () => {
        const dv = props.defaultValue
        if (dv !== undefined) {
          if (props.dataType === PropDataType.string) {
            strValue.value = dv as string
          } else if (props.dataType === PropDataType.number) {
            numValue.value = dv as number
          } else if (props.dataType === PropDataType.boolean) {
            boolValue.value = dv as boolean
          } else if (props.dataType === PropDataType.array) {
            arrValue.value = dv as (string | number)[]
          }
        }
      }, {
        immediate: true,
      })

    return {
      componentTypes,
      strValue,
      numValue,
      boolValue,
      arrValue,

      fontFamilys,
      fontWeights,
      fontStyles,
      hAligns,
      vAligns,
      writingModes,
      justifyContents,
      aligns,
      angles,
      locations,
      lineStyles,
      fillTypes,
      repeatTypes,
    }
  },
})
</script>
