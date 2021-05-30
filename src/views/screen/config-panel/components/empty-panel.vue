<template>
  <div class="empty-panel normal-com">
    <i class="v-icon-complete completed"></i>
    <p>{{ content }}</p>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EmptyPanel',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.empty-panel {
  display: flex;
  width: 100%;
  padding: 0 16px;
  color: #bcc9d4;
  flex-direction: column;
  align-items: center;

  &.normal-com {
    height: 100%;
    padding-top: 40%;
  }

  .completed {
    margin-bottom: 20px;
    font-size: 24px;
  }
}
</style>
