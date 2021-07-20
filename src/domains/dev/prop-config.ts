
import { isPlainObject, isArray, isNumber, isString, isBool } from '@/utils/util'
import { ToolboxType } from '@/utils/enums'


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
  radio = 'radio',
  color = 'color',
  slider = 'slider',
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
}

export enum DisplayMode {
  single = 'single',
  flat = 'flat',
  nest = 'nest',
}

export interface PropConfig {
  type: PropDataType
  component: ComponentType
  alias: string
  tip: string
  displayMode: DisplayMode
  features: ToolboxType[]
  toggleCol: string
  defaultValue: any
  min: number
  max: number
  step: number
  suffix: string
  enums: string[]
  whichEnum: {
    field: string
    value: string
  }
}

export const createPropConfig = () => {
  const data: PropConfig = {
    type: PropDataType.unknown,
    component: ComponentType.none,
    alias: '',
    tip: '',
    displayMode: DisplayMode.single,
    features: [],
    toggleCol: '',
    defaultValue: null,
    min: 0,
    max: 100,
    step: 1,
    suffix: '',
    enums: [],
    whichEnum: {
      field: '',
      value: '',
    },
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
    } else if (isBool(val)) {
      pc.type = PropDataType.boolean
      pc.component = ComponentType.switch
      pc.defaultValue = val
    } else if (isPlainObject(val)) {
      pc.type = PropDataType.object
      pc.displayMode = DisplayMode.nest
      dto.children = []
      dto.cols = key === '0' ? [] : Object.keys(val)
      initPropData(val, dto.children, dto.path)
    } else if (isArray(val) && val.length > 0) {
      pc.type = PropDataType.array
      pc.displayMode = DisplayMode.nest
      dto.children = []
      // dto.cols = Object.keys(val[0])
      initPropData([val[0]], dto.children, dto.path)
    }
    arr.push(dto)
  }
}
