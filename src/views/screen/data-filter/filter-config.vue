<template>
  <div
    class="filter-wp"
    :class="{
      '--disabled': apiDataConfig.config.useFilter
    }"
  >
    <div class="filter-list">
      <div
        v-for="df in selectedFilters"
        :key="df.id"
        class="collapse-panel-wp filter-item --draggable ds-panel-filter"
      >
        <div class="panel-header">
          <div class="panel-title">
            <div class="filter-title">
              <i class="v-icon-drag drag-btn" draggable></i>
              <el-checkbox
                :model-value="enabledFilters[df.id]"
                class="enable-checkbox"
                @change="(val) => onUsedChange(df.id, val)"
              />
              <div class="filter-name">
                <g-input
                  v-if="df.editing"
                  :model-value="df.name"
                  :autofocus="true"
                  class="filter-name-input"
                  @change="(val) => editFilterName(val, df)"
                />
                <div v-else class="filter-name-text" :title="df.name">
                  {{ df.name }}
                </div>
              </div>
              <div class="action-wp --edit">
                <g-tooltip-popover content="重命名">
                  <i class="v-icon-edit edit-btn" @click="df.editing = true"></i>
                </g-tooltip-popover>
              </div>
              <div class="filter-count">
                <el-tooltip
                  :content="usedFilters[df.id].join(', ')"
                  effect="blue"
                  :enterable="false"
                  placement="top"
                  popper-class="filter-dep-info"
                >
                  <span>{{ usedFilters[df.id].length }} 个组件正在调用</span>
                </el-tooltip>
              </div>
              <div class="action-wp">
                <g-tooltip-popover content="删除">
                  <i class="v-icon-close del-btn" @click="delFilter(df.id)"></i>
                </g-tooltip-popover>
              </div>
              <div class="filter-dot"></div>
            </div>
          </div>
          <div class="toggle-btn">
            <i class="el-icon-arrow-right toggle-icon"></i>
          </div>
        </div>
      </div>
      <div class="add-filter">
        <el-select
          :model-value="filterId"
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
    <div class="filter-dragging-wp"></div>
    <div class="drag-indicator"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, ComputedRef, inject, computed } from 'vue'
import { FilterModule } from '@/store/modules/filter'
import { EditorModule } from '@/store/modules/editor'
import { ApiDataConfig } from '@/components/data-source'

export default defineComponent({
  name: 'FilterConfig',
  setup() {
    const filterId = ref<number | undefined>(undefined)

    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>
    const dataFilters = computed(() => {
      const ids = apiDataConfig.value.config.pageFilters.map(m => m.id)
      return FilterModule.dataFilters.filter(m => !ids.includes(m.id))
    })

    const usedFilters = computed(() => {
      const coms = [...EditorModule.coms, ...EditorModule.subComs]
      const map = Object.create(null) as Record<number, string[]>
      coms.forEach(com => {
        for (const key in com.apiData) {
          const ad = com.apiData[key] as ApiDataConfig
          ad.config.pageFilters.forEach(m => {
            if (map[m.id]) {
              map[m.id].push(com.alias)
            } else {
              map[m.id] = [com.alias]
            }
          })
        }
      })

      return map
    })

    const selectedFilters = computed(() => {
      const ids = apiDataConfig.value.config.pageFilters.map(m => m.id)
      return FilterModule.dataFilters.filter(m => ids.includes(m.id))
    })

    const enabledFilters = computed(() => {
      return apiDataConfig.value.config.pageFilters.reduce((prev, curr) => {
        prev[curr.id] = curr.enabled
        return prev
      }, {} as Record<number, boolean>)
    })

    const selectFilter = (id: number) => {
      apiDataConfig.value.config.pageFilters.push({ id, enabled: true })
    }

    const onUsedChange = (id: number, val: boolean) => {
      apiDataConfig.value.config.pageFilters.find(m => m.id === id).enabled = val
    }

    const editFilterName = (val: string, df: any) => {
      const newName = val.trim()
      if (newName) {
        df.name = newName
      }
      delete df.editing
    }

    const delFilter = (id: number) => {
      apiDataConfig.value.config.pageFilters = apiDataConfig.value.config.pageFilters.filter(m => m.id !== id)
    }

    return {
      filterId,
      apiDataConfig,
      dataFilters,
      usedFilters,
      selectedFilters,
      enabledFilters,
      selectFilter,
      onUsedChange,
      editFilterName,
      delFilter,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
