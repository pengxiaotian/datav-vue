<template>
  <el-input
    v-if="componentType === componentTypes.input"
    v-model="strValue"
  />
  <el-input-number
    v-else-if="componentType === componentTypes.number"
    v-model="numValue"
  />
  <el-checkbox
    v-else-if="componentType === componentTypes.checkbox"
    v-model="boolValue"
  />
  <el-switch
    v-else-if="componentType === componentTypes.switch"
    v-model="boolValue"
  />
  <template v-else-if="componentType === componentTypes.radio">
    <el-radio-group v-model="strValue">
      <el-radio-button
        v-for="em in enums"
        :key="em"
        :label="em"
      >
        {{ em }}
      </el-radio-button>
    </el-radio-group>
  </template>
  <g-color-picker
    v-else-if="componentType === componentTypes.color"
    v-model="strValue"
    size="medium"
  />
  <g-slider
    v-else-if="componentType === componentTypes.slider"
    v-model="numValue"
    input-size="medium"
    style="width: 232px;"
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
    :data="enums"
  />
  <el-select
    v-else-if="componentType === componentTypes.select"
    v-model="strValue"
    disabled
  >
    <el-option
      v-for="item in []"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else-if="AllOptionKeys.includes(componentType + 's')"
    v-model="strValue"
  >
    <el-option
      v-for="item in selectOptions"
      :key="item.id"
      :label="item.value"
      :value="item.id"
    />
  </el-select>
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
