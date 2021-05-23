
import _ from 'lodash'
import { isPlainObject, isArray, isNumber, isString } from '@/utils/util'


export enum PropDataType {
  unknown = 'unknown',
  number = 'number',
  string = 'string',
  boolean = 'boolean',
  object = 'object',
  array = 'array',
}

export enum ComponentType {
  none = 'none',
  input = 'input',
  number = 'number',
  checkbox = 'checkbox',
  switch = 'switch',
  color = 'color',
  select = 'select',
  fontFamily = 'fontFamily',
  fontWeight = 'fontWeight',
  fontStyle = 'fontStyle',
  hAlign = 'hAlign',
  vAlign = 'vAlign',
  writingMode = 'writingMode',
  justify = 'justify',
  align = 'align',
  angle = 'angle',
  location = 'location',
  lineStyle = 'lineStyle',
  fillType = 'fillType',
  box = 'box',
  decorate = 'decorate'
}

export enum DisplayMode {
  flat = 'flat',
  nest = 'nest',
}

export interface PropConfig {
  type: PropDataType
  component: ComponentType
  alias: string
  tip: string
  displayMode: DisplayMode
  toggleCol: string
  defaultValue: any
}

export const createPropConfig = () => {
  const data: PropConfig = {
    type: PropDataType.unknown,
    component: ComponentType.none,
    alias: '',
    tip: '',
    displayMode: DisplayMode.flat,
    toggleCol: '',
    defaultValue: null,
  }

  return data
}

export interface PropDto {
  key: string
  config: PropConfig
  path: string
  children?: PropDto[]
  cols?: string[]
}

export const initPropData = (data: any, arr: PropDto[], prev: string) => {
  const entries = Object.entries(data)
  for (const [key, val] of entries) {
    const pc = createPropConfig()
    const dto: PropDto = {
      key,
      config: pc,
      path: prev ? `${prev}.${key}` : key,
    }
    if (isString(val)) {
      pc.type = PropDataType.string
      pc.component = ComponentType.input
      pc.defaultValue = val
    } else if (isNumber(val)) {
      pc.type = PropDataType.number
      pc.component = ComponentType.number
      pc.defaultValue = val
    } else if (_.isBoolean(val)) {
      pc.type = PropDataType.boolean
      pc.component = ComponentType.switch
      pc.defaultValue = val
    } else if (isPlainObject(val)) {
      pc.type = PropDataType.object
      pc.displayMode = DisplayMode.nest
      dto.children = []
      dto.cols = Object.keys(val)
      initPropData(val, dto.children, dto.path)
    } else if (isArray(val) && val.length > 0) {
      pc.type = PropDataType.array
      pc.displayMode = DisplayMode.nest
      dto.children = []
      dto.cols = Object.keys(val[0])
      initPropData(val, dto.children, dto.path)
    }
    arr.push(dto)
  }
}
