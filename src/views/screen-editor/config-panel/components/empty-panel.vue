<template>
  <div class="empty-panel normal-com">
    <n-icon class="completed">
      <IconComplete />
    </n-icon>
    <p>{{ content }}</p>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { IconComplete } from '@/icons'

export default defineComponent({
  name: 'EmptyPanel',
  components: {
    IconComplete,
  },
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
  color: var(--datav-font-color);
  flex-direction: column;
  align-items: center;

  &.normal-com {
    padding-top: 40%;
  }

  .completed {
    margin-bottom: 20px;
    font-size: 24px;
  }
}
</style>
