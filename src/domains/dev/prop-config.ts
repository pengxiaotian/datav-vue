
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
  repeatType='repeatType',
  uploadImage = 'upload-image',
}

export enum DisplayMode {
  single = 'single',
  flat = 'flat',
  nest = 'nest',
  nestArray = 'nest-array',
}

export interface PropConfig {
  type: PropDataType
  component: ComponentType
  alias: string
  tip: string
  displayMode: DisplayMode
  features: ToolboxType[]
  layout: ToolboxType.horizontal | ToolboxType.vertical
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
    layout: ToolboxType.horizontal,
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
  virtualPath: string
  children?: PropDto[]
  cols?: string[]
}

export const initPropData = (data: any, arr: PropDto[], prev: string) => {
  const entries = Object.entries(data)
  for (const [key, val] of entries) {
    const pc = createPropConfig()
    const path = prev ? `${prev}.${key}` : key
    let virtualPath = ''
    if (prev && prev.endsWith('.0')) {
      virtualPath = `slotProps.item.${key}`
    }
    const dto: PropDto = {
      key,
      config: pc,
      path,
      virtualPath,
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
