export type ColorMappingScaleType = 'ordinal' | 'linear' | 'threshold'

export interface ColorMappingScaleConfig {
  scheme: string
  range: string[]
  domain: (string | number)[]
  pin: boolean[]
  custom: boolean
  abnormal: string
  excepted: string
}

export interface ColorMappingConfig {
  mapping: boolean
  fixed: {
    type: string
    value: string
  }
  scale: {
    type: ColorMappingScaleType
  } & ColorMappingScaleConfig
  ordinal?: ColorMappingScaleConfig
  linear?: ColorMappingScaleConfig
  threshold?: ColorMappingScaleConfig
}
