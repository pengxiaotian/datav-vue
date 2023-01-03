<template>
  <n-drawer
    v-model:show="visible"
    width="500px"
    placement="left"
    :trap-focus="false"
    class="filter-manager-drawer"
    to="#edit-main-wp"
    show-mask
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
            <n-icon :size="12">
              <IconDocument />
            </n-icon>
            <span>帮助文档</span>
          </router-link>
        </p>
      </template>
      <filter-collapse-item
        v-if="newDataFilter"
        :data-filter="newDataFilter"
        :is-new="true"
        :draggable="false"
        :has-feedback="false"
        :removable="true"
      />
      <filter-collapse-item
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
import { useToolbarStore } from '@/store/toolbar'
import { useFilterStore } from '@/store/filter'
import { useComStore } from '@/store/com'
import { useEditorStore } from '@/store/editor'
import { ApiDataConfig, ApiKeyName } from '@/components/_models/data-source'
import { DataFilter } from '@/components/_models/data-filter'
import { setComponentData } from '@/components/_mixins/use-data-center'
import { IconWarning, IconDocument } from '@/icons'
import FilterCollapseItem from './filter-collapse-item.vue'
import { filterManagerInjectionKey } from './config'

export default defineComponent({
  name: 'FilterManagerDrawer',
  components: {
    IconDocument,
    FilterCollapseItem,
  },
  setup() {
    const nMessage = useMessage()
    const nDialog = useDialog()
    const toolbarStore = useToolbarStore()
    const filterStore = useFilterStore()
    const comStore = useComStore()
    const editorStore = useEditorStore()
    const visible = ref(false)
    const newDataFilter = ref<DataFilter | null>(null)

    watch(() => toolbarStore.filter.show, (nv: boolean) => {
      visible.value = nv
    })

    watch(visible, (nv: boolean) => {
      if (!nv) {
        toolbarStore.filter.show = false
      }
    })

    const dataFilters = computed(() => filterStore.dataFilters)
    const usedFilters = computed(() => {
      const map = Object.create(null) as Record<number, { ids: string[]; names: string[]; }>
      const coms = [...comStore.coms, ...comStore.subComs]
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
          projectId: editorStore.screen.id,
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
          filterStore.updateName(df)
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
              await filterStore.delete(id)
              const df = usedFilters.value[id]
              if (df) {
                [...comStore.coms, ...comStore.subComs]
                  .filter(m => df.ids.includes(m.id))
                  .forEach(com => {
                    for (const key in com.apiData) {
                      const apiKey = key as ApiKeyName
                      const ad = com.apiData[apiKey]
                      const pf = ad.pageFilters.find(m => m.id === id)
                      ad.pageFilters = ad.pageFilters.filter(m => m.id !== id)
                      if (pf && pf.enabled) {
                        setComponentData(com.id, apiKey, com.apis[apiKey], ad)
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
        await filterStore.update(data)
        const df = usedFilters.value[data.id]
        if (df) {
          [...comStore.coms, ...comStore.subComs]
            .filter(m => df.ids.includes(m.id))
            .forEach(com => {
              for (const key in com.apiData) {
                const apiKey = key as ApiKeyName
                const ad = com.apiData[apiKey]
                const pf = ad.pageFilters.find(m => m.id === data.id)
                if (pf && pf.enabled) {
                  setComponentData(com.id, apiKey, com.apis[apiKey], ad)
                }
              }
            })
        }
      } else {
        await filterStore.create(data)
        newDataFilter.value = null
      }
    }

    provide(filterManagerInjectionKey, {
      usedFilters,
      editFilterName,
      removeFilter,
      saveFilter,
    })

    return {
      visible,
      dataFilters,
      newDataFilter,
      addFilter,
    }
  },
})
</script>

<style lang="scss">
@import './filter-manager-drawer.scss';
@import './style.scss';
</style>
