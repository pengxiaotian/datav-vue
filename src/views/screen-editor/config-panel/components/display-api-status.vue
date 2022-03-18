<template>
  <div>
    <template v-if="status === apiStatus.loading">
      <i class="status-icon validating"></i>
      <i class="status-icon validating"></i>
      <i class="status-icon validating"></i>
    </template>
    <template v-else-if="status === apiStatus.success || status === apiStatus.completed">
      <i class="status-icon" :class="`--${status}`"></i>
    </template>
    <template v-else-if="optional">
      <i class="status-icon --success"></i>
    </template>
    <template v-else>
      <i class="status-icon" :class="`--${status}`"></i>
    </template>
    <span class="status-text">
      {{ statusText }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, PropType } from 'vue'
import { ApiStatus } from '@/components/_models/data-source'

export default defineComponent({
  name: 'DisplayApiStatus',
  props: {
    status: {
      type: String as PropType<ApiStatus | string>,
      default: ApiStatus.incomplete,
    },
    loadingText: {
      type: String,
      default: '匹配中',
    },
    successText: {
      type: String,
      default: '匹配成功',
    },
    failedText: {
      type: String,
      default: '未找到字段',
    },
    completedText: {
      type: String,
      default: '配置完成',
    },
    incompleteText: {
      type: String,
      default: '配置未完成',
    },
    optional: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const statusText = computed(() => {
      if (props.status === ApiStatus.loading) {
        return props.loadingText
      }

      if (props.status === ApiStatus.success) {
        return props.successText
      }

      if (props.status === ApiStatus.completed) {
        return props.completedText
      }

      if (props.optional) {
        return '可选'
      }

      if (props.status === ApiStatus.failed) {
        return props.failedText
      }

      if (props.status === ApiStatus.incomplete) {
        return props.incompleteText
      }

      return props.status
    })

    return {
      apiStatus: ApiStatus,
      statusText,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/loading';

.status-icon {
  @include square-loading-icon();

  &.--failed,
  &.--incomplete {
    background: var(--datav-warn-color);
  }
}

.status-text {
  color: var(--datav-font-color);
}
</style>
