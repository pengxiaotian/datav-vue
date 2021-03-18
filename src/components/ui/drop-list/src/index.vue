<template>
  <div class="drop-list-wp">
    <div class="item-container">
      <slot></slot>
    </div>
  </div>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GDropList',
})
</script>
