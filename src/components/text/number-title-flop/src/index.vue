<template>
  <div>
    NumberTitleFlop
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { useDataCenter } from '@/mixins/data-center'
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
    const { datav_data } = useDataCenter(props.com)

    console.log(datav_data)
  },
})
</script>
