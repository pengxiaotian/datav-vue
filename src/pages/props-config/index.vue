<template>
  <el-container>
    <el-header>
      <el-input />
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="12">
          <el-collapse @change="handleChange">
            <el-collapse-item title="一致性 Consistency" name="1">
              <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
              <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            </el-collapse-item>
          </el-collapse>
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

const testData = {
  name: '',
}

export default defineComponent({
  name: 'PropsConfig',
  setup() {
    const data = ref(testData)

    return {
      data,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/styles/themes/var';
</style>
