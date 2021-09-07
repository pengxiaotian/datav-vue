<template>
  <n-empty description="教程-建设中" class="--empty-ptb-40">
    <template #icon>
      <n-icon :size="40" color="#909399">
        <IconTutorial />
      </n-icon>
    </template>
  </n-empty>
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { IconTutorial } from '@/icons'

export default defineComponent({
  name: 'MyCase',
  components: {
    IconTutorial,
  },
  setup() {
    const nMessage = useMessage()

    onMounted(() => {
      nMessage.warning('建设中。。。')
    })
  },
})
</script>
