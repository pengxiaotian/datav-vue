import { FieldConfig, FieldType } from './data-field'

export interface DataEventConfig {
  type: string | FieldType | FieldType[]
  description: string
  fields: Record<string, FieldConfig>
}

export interface EventItemConfig {
  name: string
  description: string
  enable: boolean
  fields: {
    name: string
    map: string
    description: string
    custom?: boolean
  }[]
}
