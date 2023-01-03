<template>
  <div
    class="filter-wp"
    :class="{
      '--disabled': !apiDataConfig.config.useFilter
    }"
  >
    <div class="filter-list">
      <filter-collapse-item
        v-for="(df, idx) in selectedFilters"
        :key="df.id"
        :index="idx"
        :data-filter="df"
      />
      <filter-collapse-item
        v-if="newDataFilter"
        :data-filter="newDataFilter"
        :index="selectedFilters.length"
        :is-new="true"
        :draggable="false"
        :has-feedback="false"
        :removable="true"
      />
      <div ref="addPanelRef" class="add-filter" @dragenter="dragEnter">
        <n-select
          :value="filterId"
          :options="dataFilters"
          filterable
          :fallback-option="false"
          placeholder="添加过滤器"
          class="datav-new-select filter-select"
          @update:value="selectFilter"
        >
          <template #empty>
            <span class="datav-empty">过滤器列表为空，请创建后使用</span>
          </template>
        </n-select>
        <div class="new-filter-btn" @click="addFilter">
          <n-icon class="icon-add">
            <IconPlus />
          </n-icon>
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
import { defineComponent, ref, computed, provide, inject } from 'vue'
import { useFilterStore } from '@/store/filter'
import { useComStore } from '@/store/com'
import { useEditorStore } from '@/store/editor'
import { ApiDataConfig } from '@/components/_models/data-source'
import { DataFilter } from '@/components/_models/data-filter'
import { IconPlus } from '@/icons'
import FilterCollapseItem from './filter-collapse-item.vue'
import { filterManagerInjectionKey, filterConfigInjectionKey } from './config'
import { sourceDrawerInjectionKey, sourcePanelInjectionKey } from '../config-panel/config'

export default defineComponent({
  name: 'FilterPanel',
  components: {
    IconPlus,
    FilterCollapseItem,
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

    const filterStore = useFilterStore()
    const comStore = useComStore()
    const editorStore = useEditorStore()
    const { apiDataConfig } = inject(sourcePanelInjectionKey)
    const { refreshData } = inject(sourceDrawerInjectionKey)

    const dataFilters = computed(() => {
      const ids = apiDataConfig.value.pageFilters.map(m => m.id)
      return filterStore.dataFilters
        .filter(m => !ids.includes(m.id))
        .map(m => ({
          value: m.id,
          label: m.name,
        }))
    })

    const selectedFilters = computed(() => {
      return apiDataConfig.value.pageFilters.reduce((prev, curr) => {
        const df = filterStore.dataFilters.find(m => m.id == curr.id)
        if (df) {
          prev.push(df)
        }
        return prev
      }, [] as DataFilter[])
    })

    const usedFilters = computed(() => {
      const coms = [...comStore.coms, ...comStore.subComs]
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
          filterStore.updateName(df)
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
          projectId: editorStore.screen.id,
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
        await filterStore.update(data)
        if (enabledFilters.value[data.id]) {
          refreshData()
        }
      } else {
        const newId = await filterStore.create(data)
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

    provide(filterManagerInjectionKey, {
      usedFilters,
      editFilterName,
      removeFilter,
      saveFilter,
    })

    provide(filterConfigInjectionKey, {
      enabledFilters,
      onUsedChange,
      updateIndicator,
    })

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
