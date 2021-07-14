export enum FieldType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  array = 'array',
  object = 'object',
  null = 'null',
}

export interface FieldConfig {
  type: string | FieldType | FieldType[]
  description: string
  optional?: boolean
  map?: string
  custom?: boolean
}

/**
 * 创建字段
 */
export function createField(name: string, config?: Partial<FieldConfig>) {
  return {
    [name]: {
      type: 'string',
      map: '',
      description: '',
      optional: false,
      ...(config ?? {}),
    },
  }
}
