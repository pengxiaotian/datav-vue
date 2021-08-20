<template>
  <div>
    <el-empty description="我的数据-建设中">
      <template #image>
        <i style="font-size: 40px; color: #909399;" class="v-icon-my-data"></i>
      </template>
    </el-empty>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue'
import { useMessage } from 'naive-ui'

export default defineComponent({
  name: 'MyData',
  setup() {
    const nMessage = useMessage()

    onMounted(() => {
      nMessage.warning('建设中。。。')
    })
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';
</style>
