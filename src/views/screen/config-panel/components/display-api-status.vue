<template>
  <div>
    <template v-if="status === apiStatus.success">
      <i class="status-icon --success"></i>
    </template>
    <template v-else-if="status === apiStatus.failed">
      <i class="status-icon --failed"></i>
    </template>
    <template v-else-if="status === apiStatus.loading">
      <i class="status-icon validating"></i>
      <i class="status-icon validating"></i>
      <i class="status-icon validating"></i>
    </template>
    <template v-else>
      <i class="status-icon --incomplete"></i>
    </template>
    <span class="status-text">
      {{ statusText }}
    </span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, PropType } from 'vue'
import { ApiStatus } from '@/utils/enums/data-source'

export default defineComponent({
  name: 'DisplayApiStatus',
  props: {
    status: {
      type: String as PropType<ApiStatus>,
      default: ApiStatus.notfound,
    },
    successText: {
      type: String,
      default: '匹配成功',
    },
    failedText: {
      type: String,
      default: '匹配失败',
    },
    loadingText: {
      type: String,
      default: '匹配中',
    },
    optional: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const statusText = computed(() => {
      if (props.status === ApiStatus.success) {
        return props.successText
      }

      if (props.status === ApiStatus.failed) {
        return props.optional ? '可选' : props.failedText
      }

      if (props.status === ApiStatus.loading) {
        return props.loadingText
      }

      return '匹配未完成'
    })

    return {
      apiStatus: ApiStatus,
      statusText,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';
@import '~@/styles/loading';

.status-icon {
  @include square-loading-icon();

  &.--failed,
  &.--incomplete {
    background: $warn-main;
  }
}

.status-text {
  color: $font-color;
}
</style>
