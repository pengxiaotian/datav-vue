import { createInjectionKey } from '@/utils/vue-util'

export interface CarouselTableDto {
  $$datav_index: number
  [key: string]: any
}

export interface CarouselTableInjection {
  isHighLight: (rowNum: number) => boolean
}

export const carouselTableInjectionKey = createInjectionKey<CarouselTableInjection>('v-carousel-table')
