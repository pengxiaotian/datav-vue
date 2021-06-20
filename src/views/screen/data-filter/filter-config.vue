<template>
  <div class="filter-wp">
    <div class="filter-list">
      <div class="add-filter">
        <el-select
          v-model="filterId"
          size="mini"
          filterable
          placeholder="添加过滤器"
          class="datav-new-select filter-select"
          popper-class="datav-new-select-option"
          @change="selectFilter"
        >
          <el-option
            v-for="item in dataFilters"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <div class="new-filter-btn">
          <i class="el-icon-plus icon-add"></i>
        </div>
      </div>
    </div>
    <div class="drag-indicator"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { FilterModule } from '@/store/modules/filter'

export default defineComponent({
  name: 'FilterConfig',
  props: { },
  setup() {
    const filterId = ref<number | undefined>(undefined)
    const filterIds = ref<number[]>([])
    const dataFilters = computed(() => FilterModule.dataFilters)

    const selectFilter = (id: number) => {
      if (id) {
        filterId.value = id
        filterIds.value.push(id)
      }
    }

    return {
      dataFilters,
      filterId,
      filterIds,
      selectFilter,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/themes/var';

.filter-wp {
  position: relative;
  padding: 10px;
  background: $datav-data-form-bgcolor;
  border: $config-panel-border;

  .filter-list {
    transition: opacity 0.2s;
  }
}

.add-filter {
  display: flex;

  .filter-select {
    flex: 1;
    margin: 0;
  }
}

.new-filter-btn {
  width: 30px;
  margin-left: 10px;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
  border: 1px solid $datav-data-filter-color;
  transition: border-color 0.1s;

  .icon-add {
    font-size: 12px;
    font-weight: 700;
    transition: color 0.1s;
  }

  &:hover {
    border-color: $hover-color;

    .icon-add {
      color: $hover-color;
    }
  }
}

.drag-indicator {
  position: absolute;
  top: 5px;
  left: 0;
  display: none;
  width: 100%;
  height: 2px;
  padding: 0 5px;
  background: $hover-color;
  border-radius: 1px;
  transition: 0.2s ease;
  background-clip: content-box;
}
</style>
