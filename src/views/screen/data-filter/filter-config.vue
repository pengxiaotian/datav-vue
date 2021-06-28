<template>
  <div
    class="filter-wp"
    :class="{
      '--disabled': !apiDataConfig.config.useFilter
    }"
  >
    <div class="filter-list">
      <filter-collapse-panel
        v-for="(df, idx) in selectedFilters"
        :key="df.id"
        :index="idx"
        :data-filter="df"
      />
      <filter-collapse-panel
        v-if="newDataFilter"
        :data-filter="newDataFilter"
        :index="selectedFilters.length"
        is-new
        :draggable="false"
        :has-feedback="false"
        removable
      />
      <div ref="addPanelRef" class="add-filter" @dragenter="dragEnter">
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
    <div
      class="drag-indicator"
      :style="{
        display: dragInfo.visible ? 'block' : 'none',
        top: dragInfo.top
      }"
    ></div>
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
    const addPanelRef = ref(null)
    const dragInfo = ref({
      visible: false,
      top: '4px',
      from: 0,
      to: 0,
    })

    const apiDataConfig = inject('apiDataConfig') as ComputedRef<ApiDataConfig>
    const refreshData = inject('refreshData') as () => Promise<void>

    const dataFilters = computed(() => {
      const ids = apiDataConfig.value.pageFilters.map(m => m.id)
      return FilterModule.dataFilters.filter(m => !ids.includes(m.id))
    })

    const selectedFilters = computed(() => {
      return apiDataConfig.value.pageFilters.reduce((prev, curr) => {
        const df = FilterModule.dataFilters.find(m => m.id == curr.id)
        if (df) {
          prev.push(df)
        }
        return prev
      }, [] as DataFilter[])
    })

    const usedFilters = computed(() => {
      const coms = [...EditorModule.coms, ...EditorModule.subComs]
      const map = Object.create(null) as Record<number, { ids: string[]; names: string[]; }>
      coms.forEach(com => {
        for (const key in com.apiData) {
          const ad = com.apiData[key] as ApiDataConfig
          ad.pageFilters.forEach(m => {
            if (map[m.id]) {
              map[m.id].ids.push(com.id)
              map[m.id].names.push(com.alias)
            } else {
              map[m.id] = {
                ids: [com.id],
                names: [com.alias],
              }
            }
          })
        }
      })

      return map
    })

    const enabledFilters = computed(() => {
      return apiDataConfig.value.pageFilters.reduce((prev, curr) => {
        prev[curr.id] = curr.enabled
        return prev
      }, {} as Record<number, boolean>)
    })

    const selectFilter = (id: number) => {
      apiDataConfig.value.pageFilters.push({ id, enabled: true })
      refreshData()
    }

    const onUsedChange = (id: number, val: boolean) => {
      apiDataConfig.value.pageFilters.find(m => m.id === id).enabled = val
      refreshData()
    }

    const editFilterName = (val: string, df: DataFilter) => {
      const newName = val.trim()
      if (newName && df.name !== newName) {
        df.name = newName
        if (df.id > 0) {
          FilterModule.updateFilterName(df)
        }
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
        apiDataConfig.value.pageFilters = apiDataConfig.value.pageFilters.filter(m => m.id !== id)
        refreshData()
      } else {
        newDataFilter.value = null
      }
    }

    const saveFilter = async (data: DataFilter) => {
      if (data.id > 0) {
        await FilterModule.updateFilter(data)
        if (enabledFilters.value[data.id]) {
          refreshData()
        }
      } else {
        const newId = await FilterModule.createFilter(data)
        apiDataConfig.value.pageFilters.push({ id: newId, enabled: true })
        newDataFilter.value = null
        refreshData()
      }
    }

    const sortFilter = () => {
      const { from, to } = dragInfo.value
      if (from !== to) {
        const list = apiDataConfig.value.pageFilters
        list.splice(to, 0, ...list.splice(from, 1))
        refreshData()
      }
    }

    const updateIndicator = (visible: boolean, index: number, el: HTMLElement) => {
      dragInfo.value.visible = visible
      dragInfo.value.top = `${el.offsetTop - 6}px`
      if (visible) {
        dragInfo.value.to = index
      } else {
        dragInfo.value.from = index
        sortFilter()
      }
    }

    const dragEnter = () => {
      updateIndicator(true, selectedFilters.value.length, addPanelRef.value)
    }

    provide('usedFilters', usedFilters)
    provide('enabledFilters', enabledFilters)
    provide('onUsedChange', onUsedChange)
    provide('editFilterName', editFilterName)
    provide('removeFilter', removeFilter)
    provide('saveFilter', saveFilter)
    provide('updateIndicator', updateIndicator)

    return {
      filterId,
      apiDataConfig,
      dataFilters,
      selectedFilters,
      newDataFilter,
      addPanelRef,
      dragInfo,
      selectFilter,
      addFilter,
      dragEnter,
    }
  },
})
</script>

<style lang="scss">
@import './style.scss';
</style>
