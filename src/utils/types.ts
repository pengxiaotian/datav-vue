import type { App } from 'vue'
import type { ECBasicOption } from 'echarts/types/dist/shared'

declare type SFCWithInstall<T> = T & { install(app: App): void; }

declare type AnimationEasing = ECBasicOption['animationEasing'];

declare interface DatavImageType {
  id: string
  name: string
  src: string
  width?: number
  height?: number
  preview?: string
  border?: {
    width: string
    outset: string
    slice: string
    repeat: string
  }
}

export {
  SFCWithInstall,
  AnimationEasing,
  DatavImageType,
}
