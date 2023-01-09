import { Ref } from 'vue'
import { createInjectionKey } from '@/utils/vue-util'

export interface TableBarDto {
  content: string
  value: number
}

export interface TableBarInjection {
  maxNum: Ref<number>
  flag: Ref<number>
}

export const tableBarInjectionKey = createInjectionKey<TableBarInjection>('v-table-bar')
