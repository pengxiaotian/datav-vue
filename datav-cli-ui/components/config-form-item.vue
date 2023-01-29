<template>
  <g-input
    v-if="componentType === componentTypes.input"
    v-model="strValue"
  />
  <g-input-number
    v-else-if="componentType === componentTypes.number"
    v-model="numValue"
  />
  <g-color-picker
    v-else-if="componentType === componentTypes.color"
    v-model="strValue"
    size="medium"
  />
  <g-checkbox
    v-else-if="componentType === componentTypes.checkbox"
    v-model="boolValue"
  />
  <g-switch
    v-else-if="componentType === componentTypes.switch"
    v-model="boolValue"
  />
  <g-radio-group
    v-else-if="componentType === componentTypes.radioBase"
    v-model="strValue"
    :data="pairs"
  />
  <g-radio-group
    v-else-if="componentType === componentTypes.radio"
    v-model="strValue"
    :data="pairs"
    is-button
  />
  <g-slider
    v-else-if="componentType === componentTypes.slider"
    v-model="numValue"
    size="medium"
  />
  <g-slider-range
    v-else-if="componentType === componentTypes.sliderRange"
    v-model="arrValue"
    size="medium"
    :min="0"
    :max="100"
  />
  <g-upload-image
    v-else-if="componentType === componentTypes.uploadImage"
    v-model="strValue"
  />
  <g-select-image
    v-else-if="componentType === componentTypes.selectImage"
    v-model="strValue"
    :images="[]"
  />
  <g-select-shape
    v-else-if="componentType === componentTypes.echartIcon"
    v-model="strValue"
    :shapes="selectOptions"
  />
  <g-select-suggest
    v-else-if="componentType === componentTypes.selectSuggest"
    v-model="strValue"
    :data="selectOptions"
    :filters="enums"
  />
  <g-select
    v-else-if="componentType === componentTypes.select"
    v-model="strValue"
    :data="pairs"
  />
  <template v-else-if="AllOptionKeys.includes(componentType + 's')">
    <g-radio-group
      v-if="flatValue"
      v-model="strValue"
      :data="selectOptions"
      is-button
    />
    <g-select
      v-else
      v-model="strValue"
      :data="selectOptions"
    />
  </template>
  <span v-else>--</span>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
import { GCheckbox, GInput, GInputNumber, GColorPicker, GSlider, GSwitch, GSliderRange, GUploadImage, GSelectImage, GSelectSuggest, GSelectShape, GSelect, GRadioGroup } from '~~/ui-components'
import { PropDataType, ComponentType, AllOptionKeys, getSelectedOptions } from '~~/domains/prop-data'

const props = defineProps({
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
  enums: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  pairs: {
    type: Array as PropType<{ key: string; value: string; }[]>,
    default: () => [],
  },
  flatValue: Boolean,
})

const componentTypes = ref({ ...ComponentType })
const strValue = ref('')
const numValue = ref(0)
const boolValue = ref(false)
const arrValue = ref<any[]>([])

const selectOptions = computed(() => {
  return getSelectedOptions(props.componentType)
})

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
        arrValue.value = dv as any[]
      }
    }
  }, {
    immediate: true,
  })
</script>
