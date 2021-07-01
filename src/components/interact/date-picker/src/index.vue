<template>
  <div>
    DatePicker
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef } from 'vue'
import { useDataCenter } from '@/mixins/data-center'
import { ApiModule } from '@/store/modules/api'
import { DatePicker } from './date-picker'

export default defineComponent({
  name: 'VDatePicker',
  props: {
    com: {
      type: Object as PropType<DatePicker>,
      required: true,
    },
  },
  setup(props) {
    useDataCenter(props.com)

    const datav_data = computed(() => {
      return ApiModule.dataMap[props.com.id]
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    return {
    }
  },
})
</script>
