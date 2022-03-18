import type { App } from 'vue'
import type { ECBasicOption } from 'echarts/types/dist/shared'

declare type SFCWithInstall<T> = T & { install(app: App): void; }

declare type AnimationEasing = ECBasicOption['animationEasing'];

export {
  SFCWithInstall,
  AnimationEasing,
}
