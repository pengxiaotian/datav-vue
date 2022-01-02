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
  <n-checkbox
    v-else-if="componentType === componentTypes.checkbox"
    v-model:checked="boolValue"
  />
  <n-switch
    v-else-if="componentType === componentTypes.switch"
    v-model:value="boolValue"
  />
  <n-radio-group
    v-else-if="componentType === componentTypes.radio"
    v-model:value="strValue"
  >
    <n-radio-button v-for="pair in pairs" :key="pair.key" :value="pair.key">
      {{ pair.value }}
    </n-radio-button>
  </n-radio-group>
  <g-slider
    v-else-if="componentType === componentTypes.slider"
    v-model="numValue"
    size="medium"
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
  <g-select-suggest
    v-else-if="componentType === componentTypes.selectSuggest"
    v-model="strValue"
    :data="selectOptions"
    :filters="enums"
  />
  <g-select-shape
    v-else-if="componentType === componentTypes.legendIcon"
    v-model="strValue"
    :shapes="selectOptions"
  />
  <g-select
    v-else-if="componentType === componentTypes.select"
    v-model="strValue"
    :data="[]"
    disabled
  />
  <template v-else-if="AllOptionKeys.includes(componentType + 's')">
    <n-radio-group
      v-if="flatValue"
      v-model:value="strValue"
    >
      <n-radio-button v-for="em in selectOptions" :key="em.id" :value="em.id">
        {{ em.value }}
      </n-radio-button>
    </n-radio-group>
    <g-select
      v-else
      v-model="strValue"
      :data="selectOptions"
    />
  </template>
  <span v-else>--</span>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, computed, watch } from 'vue'
import { PropDataType, ComponentType, AllOptionKeys, getSelectedOptions } from '../props-config/config'

export default defineComponent({
  name: 'ConfigFormItem',
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
    enums: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    pairs: {
      type: Array as PropType<{ key: string; value: string; }[]>,
      default: () => [],
    },
    flatValue: Boolean,
  },
  setup(props) {
    const componentTypes = ref({ ...ComponentType })

    const strValue = ref('')
    const numValue = ref(0)
    const boolValue = ref(false)
    const arrValue = ref<(string | number)[]>([])

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
      AllOptionKeys,
      selectOptions,
    }
  },
})
</script>
