<template>
  <div v-if="fields" class="field-wp">
    <div class="field-info">数据相应结果应为列表，列表元素包含如下字段</div>
    <div class="field-grid">
      <div class="field-item field-title">字段</div>
      <div class="field-item field-title">映射</div>
      <div class="field-item field-title">说明</div>
      <template v-for="(fc, fn) in fields" :key="fn">
        <div class="field-item">{{ fn }}</div>
        <div class="field-item">{{ fc.map || '-' }}</div>
        <div class="field-item">{{ fc.description || '-' }}</div>
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { FieldConfig } from '@/components/_models/data-field'

export default defineComponent({
  name: 'FieldGrid',
  props: {
    fields: {
      type: Object as PropType<Record<string, FieldConfig>>,
    },
  },
})
</script>

<style lang="scss" scoped>
$border: 1px solid #444546;

.field-wp {
  margin-top: 20px;
}

.field-grid {
  display: grid;
  margin-top: 10px;
  border-bottom: $border;
  border-left: $border;
  grid-template-columns: 1fr 1fr 2fr;

  .field-item {
    padding: 6px;
    border-top: $border;
    border-right: $border;
  }

  .field-title {
    background: rgb(255 255 255 / 3%);
  }
}
</style>
