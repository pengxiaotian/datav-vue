import { InjectionKey } from 'vue'

interface ProjectInjection {
  dragStart: Function
  dragEnd: Function
}

interface ProjectListInjection {
  publish: (appId: number) => void
}

export const projectInjectionKey: InjectionKey<ProjectInjection> = Symbol('projectInjectionKey')

export const projectListInjectionKey: InjectionKey<ProjectListInjection> = Symbol('projectListInjectionKey')
