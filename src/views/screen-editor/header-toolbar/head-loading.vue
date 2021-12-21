<template>
  <div :class="loadingClass"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ToolbarModule } from '@/store/modules/toolbar'

export default defineComponent({
  name: 'HeadLoading',
  computed: {
    loadingClass() {
      return {
        'loading-indicator': true,
        loading: ToolbarModule.loading > 0,
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.loading-indicator {
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 101;
  width: 100%;
  height: 0;
  background: -webkit-gradient(linear, 80% 46%, 10% 21%, from(#ff8754), to(#2483ff));
  transition: height 0.5s;

  &.loading {
    height: 1px;
    animation: head-lading 1s infinite ease-out;
  }
}

@keyframes head-lading {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(150%);
  }
}
</style>
