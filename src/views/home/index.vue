<template>
  <div class="datav">
    <nav-header />
    <nav-main />
    <div class="nav-shadow"></div>
    <div class="datav-main">
      <div class="datav-content">
        <my-project />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavHeader from './nav-header.vue'
import NavMain from './nav-main.vue'
import MyProject from './my-project.vue'

export default defineComponent({
  name: 'Home',
  components: {
    NavHeader,
    NavMain,
    MyProject,
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.datav {
  .nav-shadow {
    background: linear-gradient(180deg, transparent, $background-color);
    height: 50px;
    position: relative;
    width: 100%;
    z-index: 1;
  }

  .datav-main {
    user-select: none;

    .datav-content {
      position: relative;
      color: $background-color;
    }
  }
}
</style>
