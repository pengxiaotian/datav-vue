<template>
  <n-drawer
    v-model:show="visible"
    width="500px"
    placement="left"
    class="filter-manager-drawer"
    to="#edit-main-wp"
  >
    <n-drawer-content closable>
      <template #header>
        <p class="filter-manager-title">
          数据过滤器<span class="create-filter" @click="addFilter">新建</span>
          <router-link
            :to="{ name: 'MyCase' }"
            target="_blank"
            rel="noopener noreferrer"
            class="filter-doc"
          >
            <n-icon>
              <IconDocument />
            </n-icon>
            <span>帮助文档</span>
          </router-link>
        </p>
      </template>
      <filter-collapse-panel
        v-if="newDataFilter"
        :data-filter="newDataFilter"
        :is-new="true"
        :draggable="false"
        :has-feedback="false"
        :removable="true"
      />
      <filter-collapse-panel
        v-for="df in dataFilters"
        :key="df.id"
        :data-filter="df"
        :draggable="false"
        :has-feedback="false"
        :publish="true"
        :removable="true"
        :show-time="true"
      />
      <div v-if="dataFilters.length === 0 && !newDataFilter" class="panel-info">
        <p class="info-text">过滤器列表为空，请创建后使用</p>
        <n-button :focusable="false" @click="addFilter">
          新建
        </n-button>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang='ts'>
import { h, defineComponent, ref, computed, watch, provide } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { ToolbarModule } from '@/store/modules/toolbar'
import { FilterModule } from '@/store/modules/filter'
import { EditorModule } from '@/store/modules/editor'
import { ApiDataConfig } from '@/components/data-source'
import { DataFilter } from '@/components/data-filter'
import { setDatavData } from '@/mixins/data-center'
import { IconWarning, IconDocument } from '@/icons'
import FilterCollapsePanel from './filter-collapse-panel.vue'

export default defineComponent({
  name: 'FilterManagerDrawer',
  components: {
    IconDocument,
    FilterCollapsePanel,
  },
  setup() {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const visible = ref(false)
    const newDataFilter = ref<DataFilter | null>(null)

    watch(() => ToolbarModule.filter.show, (nv: boolean) => {
      visible.value = nv
    })

    watch(visible, (nv: boolean) => {
      if (!nv) {
        ToolbarModule.filter.show = false
      }
    })

    const dataFilters = computed(() => FilterModule.dataFilters)
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

    const editFilterName = (val: string, df: DataFilter) => {
      const newName = val.trim()
      if (newName && df.name !== newName) {
        df.name = newName
        if (df.id > 0) {
          FilterModule.updateFilterName(df)
        }
      }
    }

    const removeFilter = (id: number) => {
      if (id > 0) {
        const d = nDialog.create({
          content: '是否删除数据过滤器，可能导致相关组件不可用。',
          negativeText: '取消',
          positiveText: '确定',
          iconPlacement: 'top',
          icon: () => h(IconWarning),
          onPositiveClick: async () => {
            d.loading = true
            try {
              await FilterModule.deleteFilter(id)
              const df = usedFilters.value[id]
              if (df) {
                const coms = [...EditorModule.coms, ...EditorModule.subComs].filter(m => df.ids.includes(m.id))
                coms.forEach(com => {
                  for (const key in com.apiData) {
                    const ad = com.apiData[key] as ApiDataConfig
                    const pf = ad.pageFilters.find(m => m.id === id)
                    ad.pageFilters = ad.pageFilters.filter(m => m.id !== id)
                    if (pf && pf.enabled) {
                      setDatavData(com.id, key, com.apis[key], ad)
                    }
                  }
                })
              }
            } catch (error) {
              nMessage.error(error.message)
            }
          },
        })
      } else {
        newDataFilter.value = null
      }
    }

    const saveFilter = async (data: DataFilter) => {
      if (data.id > 0) {
        await FilterModule.updateFilter(data)
        const df = usedFilters.value[data.id]
        if (df) {
          const coms = [...EditorModule.coms, ...EditorModule.subComs].filter(m => df.ids.includes(m.id))
          coms.forEach(com => {
            for (const key in com.apiData) {
              const ad = com.apiData[key] as ApiDataConfig
              const pf = ad.pageFilters.find(m => m.id === data.id)
              if (pf && pf.enabled) {
                setDatavData(com.id, key, com.apis[key], ad)
              }
            }
          })
        }
      } else {
        await FilterModule.createFilter(data)
        newDataFilter.value = null
      }
    }

    provide('usedFilters', usedFilters)
    provide('editFilterName', editFilterName)
    provide('removeFilter', removeFilter)
    provide('saveFilter', saveFilter)

    return {
      visible,
      dataFilters,
      newDataFilter,
      addFilter,
      removeFilter,
    }
  },
})
</script>

<style lang="scss">
@import './filter-manager-drawer.scss';
@import './style.scss';
</style>
