<template>
  <g-loading type="square" :spinning="true" class="g-async-loading" />
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AsyncLoading',
})
</script>
