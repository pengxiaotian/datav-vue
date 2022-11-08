import { InjectionKey, ComputedRef } from 'vue'
import { DatavComponent } from '@/components/_models/datav-component'
import { ApiKeyName, ApiConfig, ApiDataConfig } from '@/components/_models/data-source'
import { DebugDataType } from '@/store/debug'

export interface SourceDrawerInjection {
  dataStatus?: ComputedRef<{ [k in DebugDataType]?: string }>
  refreshData: () => Promise<void>
}

interface SourcePanelInjection {
  apiName: ApiKeyName
  apiConfig: ComputedRef<ApiConfig>
  apiDataConfig: ComputedRef<ApiDataConfig>
}

interface InteractionInjection {
  addField: (eventName: string) => void
  deleteField: (eventName: string, idx: number) => void
  updateField: (eventName: string, fields: {
    name: string
    map: string
  }[]) => void
  toggleEnable: (eventName: string, enable: boolean) => void
}

export const parentComInjectionKey: InjectionKey<ComputedRef<DatavComponent>> = Symbol('parentComInjectionKey')

export const subComInjectionKey: InjectionKey<ComputedRef<DatavComponent>> = Symbol('subComInjectionKey')

export const comInjectionKey: InjectionKey<ComputedRef<DatavComponent>> = Symbol('comInjectionKey')

export const changePanelInjectionKey: InjectionKey<(panelName: string) => void> = Symbol('changePanelInjectionKey')

export const interactionInjectionKey: InjectionKey<InteractionInjection> = Symbol('interactionInjectionKey')

export const sourceDrawerInjectionKey: InjectionKey<SourceDrawerInjection> = Symbol('sourceDrawerInjectionKey')

export const sourcePanelInjectionKey: InjectionKey<SourcePanelInjection> = Symbol('sourcePanelInjectionKey')
