export enum MoveType {
  up,
  down,
  top,
  bottom,
}

export enum ZoomMode {
  /**
   * 全屏铺满
   */
  auto,
  /**
   * 等比缩放宽度铺满
   */
  width,
  /**
   * 等比缩放高度铺满
   */
  height,
  /**
   * 等比缩放高度铺满并且可以左右移动
   */
  full,
  /**
   * 不缩放
   */
  disabled,
}

export enum ToolboxType {
  vertical = 'vertical',
  horizontal = 'horizontal',
  copy = 'copy',
  add = 'add',
  remove = 'remove',
}

export const AnimationEasing = {
  linear: 'linear',
  quadraticIn: 'quadraticIn',
  quadraticOut: 'quadraticOut',
  quadraticInOut: 'quadraticInOut',
  cubicIn: 'cubicIn',
  cubicOut: 'cubicOut',
  cubicInOut: 'cubicInOut',
  quarticIn: 'quarticIn',
  quarticOut: 'quarticOut',
  quarticInOut: 'quarticInOut',
  quinticIn: 'quinticIn',
  quinticOut: 'quinticOut',
  quinticInOut: 'quinticInOut',
  sinusoidalIn: 'sinusoidalIn',
  sinusoidalOut: 'sinusoidalOut',
  sinusoidalInOut: 'sinusoidalInOut',
  exponentialIn: 'exponentialIn',
  exponentialOut: 'exponentialOut',
  exponentialInOut: 'exponentialInOut',
  circularIn: 'circularIn',
  circularOut: 'circularOut',
  circularInOut: 'circularInOut',
  elasticIn: 'elasticIn',
  elasticOut: 'elasticOut',
  elasticInOut: 'elasticInOut',
  backIn: 'backIn',
  backOut: 'backOut',
  backInOut: 'backInOut',
  bounceIn: 'bounceIn',
  bounceOut: 'bounceOut',
  bounceInOut: 'bounceInOut',
}
