import { Ref, ComputedRef } from 'vue'
import { createInjectionKey } from '@/utils/vue-util'

export interface TableBarDto {
  [key: string]: any
  $$datav_index: number
  value: number
  content: string
}

export interface TableBarInjection {
  pageIndex: Ref<number>
  maxNum: ComputedRef<number>
  watchFlag: Ref<number>
}

export const tableBarInjectionKey = createInjectionKey<TableBarInjection>('v-table-bar')
