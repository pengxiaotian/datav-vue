<template>
  <div>
    1
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { EditorModule } from '@/store/modules/editor'

export default defineComponent({
  name: 'PageConfig',
  setup() {
    const selectedCom = computed(() => EditorModule.selectedCom)

    return {
      selectedCom,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';

</style>
