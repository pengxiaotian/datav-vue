<template>
  <router-view />
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { useMessage } from 'naive-ui'

export default defineComponent({
  setup() {
    // 为了兼容之前的旧代码，但是不推荐直接使用 `window.$message`
    window.$message = useMessage()
  },
})
</script>
