<template>
  <div>
    Screen: {{ screenId }}
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, onMounted, ref } from 'vue'
import { getScreen } from '@/api/screen'
import { Screen } from '@/domains/screen'
import { MessageUtil } from '@/utils/message-util'

export default defineComponent({
  name: 'Screen',
  props: {
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true)
    const srceen = ref<Partial<Screen>>({})

    const screenId = computed(() => {
      return typeof props.projectId === 'string'
        ? parseInt(props.projectId) : props.projectId
    })

    onMounted(async () => {
      try {
        const res = await getScreen(screenId.value)
        if (res.data.code === 0) {
          srceen.value = res.data.data
          document.title = `${res.data.data.name} | 编辑器`
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        MessageUtil.error(MessageUtil.format(error))
      } finally {
        loading.value = false
      }
    })

    return {
      screenId,
      loading,
      srceen,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';
</style>
