import { FieldConfig, FieldType } from './data-field'

export interface DataEventConfig {
  type: string | FieldType | FieldType[]
  description: string
  fields: Record<string, FieldConfig>
}
