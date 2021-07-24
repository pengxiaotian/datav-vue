import type { App } from 'vue'

export type SFCWithInstall<T> = T & { install(app: App): void; }

export interface DatavImageType {
  id: string
  name: string
  src: string
  width?: number
  height?: number
  preview?: string
  border: {
    width: string
    outset: string
    slice: string
    repeat: string
  }
}
