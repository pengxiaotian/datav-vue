<template>
  <div class="datav">
    <Header />
    <div class="nav-main"></div>
    <div class="nav-shadow"></div>
    <div class="datav-main"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from './header.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Header,
  },
})
</script>

<style lang="scss">

</style>
