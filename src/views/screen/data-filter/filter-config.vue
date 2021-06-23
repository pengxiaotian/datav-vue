<template>
  <div
    class="filter-wp"
    :class="{
      '--disabled': apiDataConfig.config.useFilter
    }"
  >
    <div class="filter-list">
      <filter-collapse-panel
        v-for="df in selectedFilters"
        :key="df.id"
        :data-filter="df"
      />
      <filter-collapse-panel
        v-if="newDataFilter"
        :data-filter="newDataFilter"
        is-new
      />
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
        <div class="new-filter-btn" @click="addFilter">
          <i class="el-icon-plus icon-add"></i>
        </div>
      </div>
    </div>
    <div class="filter-dragging-wp"></div>
    <div class="drag-indicator"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, ComputedRef, provide, inject } from 'vue'
import { FilterModule } from '@/store/modules/filter'
import { EditorModule } from '@/store/modules/editor'
import { ApiDataConfig } from '@/components/data-source'
import { DataFilter } from '@/components/data-filter'
import FilterCollapsePanel from './filter-collapse-panel.vue'

export default defineComponent({
  name: 'FilterConfig',
  components: {
    FilterCollapsePanel,
  },
  setup() {
    const filterId = ref<number | undefined>(undefined)
    const newDataFilter = ref<DataFilter | null>(null)

    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>
    const dataFilters = computed(() => {
      const ids = apiDataConfig.value.config.pageFilters.map(m => m.id)
      return FilterModule.dataFilters.filter(m => !ids.includes(m.id))
    })

    const selectedFilters = computed(() => {
      return apiDataConfig.value.config.pageFilters.reduce((prev, curr) => {
        const df = FilterModule.dataFilters.find(m => m.id == curr.id)
        if (df) {
          prev.push(df)
        }
        return prev
      }, [] as DataFilter[])
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
    }

    const addFilter = () => {
      if (!newDataFilter.value) {
        newDataFilter.value = {
          id: 0,
          name: '新建过滤器',
          code: 'return data;',
          origin: 'return data;',
          projectId: 0,
          createAt: '',
          updateAt: '',
        }
      }
    }

    const removeFilter = (id: number) => {
      if (id > 0) {
        apiDataConfig.value.config.pageFilters = apiDataConfig.value.config.pageFilters.filter(m => m.id !== id)
      } else {
        newDataFilter.value = null
      }
    }

    const saveFilter = async (data: DataFilter) => {
      if (data.id > 0) {
        await FilterModule.updateFilter(data)
      } else {
        const newId = await FilterModule.createFilter(data)
        apiDataConfig.value.config.pageFilters.push({ id: newId, enabled: true })
        newDataFilter.value = null
      }
    }

    provide('usedFilters', usedFilters)
    provide('enabledFilters', enabledFilters)
    provide('onUsedChange', onUsedChange)
    provide('editFilterName', editFilterName)
    provide('removeFilter', removeFilter)
    provide('saveFilter', saveFilter)

    return {
      filterId,
      apiDataConfig,
      dataFilters,
      selectedFilters,
      newDataFilter,
      selectFilter,
      addFilter,
    }
  },
})
</script>

<style lang="scss">
@import './style.scss';
</style>
