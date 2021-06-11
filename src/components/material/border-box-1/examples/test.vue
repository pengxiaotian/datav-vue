<template>
  <div>
    <BorderBox1 :com="com">
      <div></div>
    </BorderBox1>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import BorderBox1 from '../src/index.vue'
import BorderBox_1 from '../src/border-box-1'

export default defineComponent({
  name: 'TextBorderBox1',
  components: {
    BorderBox1,
  },
  setup() {
    const com = ref(new BorderBox_1())

    return {
      com,
    }
  },
})
</script>
