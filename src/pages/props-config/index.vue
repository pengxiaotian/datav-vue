<template>
  <el-container>
    <el-header class="pc-header">
      <el-input size="large" placeholder="输入组件目录" />
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="12">
          <props-config-form :configs="list" />
        </el-col>
        <el-col :span="12">
          2
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { PropDto, initPropData } from '@/domains/dev/prop-config'
import MainTitle from '@/components/text/main-title/src/main-title'
import PropsConfigForm from '../components/props-config-form.vue'

export default defineComponent({
  name: 'PropsConfig',
  components: {
    PropsConfigForm,
  },
  setup() {
    const list = ref<PropDto[]>([])
    const dvc = new MainTitle()

    initPropData(dvc.config, list.value, '')

    return {
      list,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/themes/var';

.pc-header {
  padding: 20px;
}
</style>
