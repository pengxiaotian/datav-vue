import type { App } from 'vue'

declare type SFCWithInstall<T> = T & { install(app: App): void; }

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

declare type easingFunc = (percent: number) => number;
declare type AnimationEasing = keyof typeof easing | easingFunc | 'spline';
declare const easing: {
    linear(k: number): number
    quadraticIn(k: number): number
    quadraticOut(k: number): number
    quadraticInOut(k: number): number
    cubicIn(k: number): number
    cubicOut(k: number): number
    cubicInOut(k: number): number
    quarticIn(k: number): number
    quarticOut(k: number): number
    quarticInOut(k: number): number
    quinticIn(k: number): number
    quinticOut(k: number): number
    quinticInOut(k: number): number
    sinusoidalIn(k: number): number
    sinusoidalOut(k: number): number
    sinusoidalInOut(k: number): number
    exponentialIn(k: number): number
    exponentialOut(k: number): number
    exponentialInOut(k: number): number
    circularIn(k: number): number
    circularOut(k: number): number
    circularInOut(k: number): number
    elasticIn(k: number): number
    elasticOut(k: number): number
    elasticInOut(k: number): number
    backIn(k: number): number
    backOut(k: number): number
    backInOut(k: number): number
    bounceIn(k: number): number
    bounceOut(k: number): number
    bounceInOut(k: number): number
}

export {
  SFCWithInstall,
  AnimationEasing,
  DatavImageType,
}
