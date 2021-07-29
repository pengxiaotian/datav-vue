
import { isPlainObject, isArray, isNumber, isString, isBool } from '@/utils/util'
import { ToolboxType } from '@/utils/enums'
import { AllOptionKeys } from '@/data/select-options'


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
  justifyContent = 'justifyContent',
  align = 'align',
  angle = 'angle',
  location = 'location',
  lineStyle = 'lineStyle',
  fillType = 'fillType',
  repeatType = 'repeatType',
  uploadImage = 'uploadImage',
  selectImage = 'selectImage',
  echartsLablePosition = 'echartsLablePosition',
  animationEasing = 'animationEasing'
}

export enum DisplayMode {
  single = 'single',
  flat = 'flat',
  nest = 'nest',
  nestArray = 'nest-array',
  inline = 'inline',
  inlineSingle = 'inline-single',
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
  isHide: boolean
  defaultValue: any
  min: number
  max: number
  step: number
  InfiniteMin: boolean
  InfiniteMax: boolean
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
    isHide: false,
    defaultValue: null,
    min: 0,
    max: 100,
    step: 1,
    InfiniteMin: false,
    InfiniteMax: false,
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

    // TODO: 简单处理只有一级数组的情况
    let virtualPath = ''
    if (prev) {
      const idx = prev.indexOf('.0')
      if (idx > -1) {
        virtualPath = `slotProps.item${prev.substr(idx + 2)}.${key}`
      }
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

export const mixinPropData = (tsArr: PropDto[], jsonArr: PropDto[]) => {
  for (let i = 0; i < tsArr.length; i++) {
    const tsItem = tsArr[i]
    const jsonItem = jsonArr[i]
    if (tsItem.key === jsonItem.key && tsItem.path === jsonItem.path) {
      tsItem.config = {
        ...tsItem.config,
        ...jsonItem.config,
      }
    }

    if (tsItem.children && tsItem.children.length > 0
      && jsonItem.children && jsonItem.children.length > 0) {
      mixinPropData(tsItem.children, jsonItem.children)
    }
  }
}

export const getUsedSelectOptions = (dtos: PropDto[]) => {
  const opts = new Set<string>()
  const loop = (list: PropDto[]) => {
    list.forEach(item => {
      const key = `${item.config.component}s`
      if (AllOptionKeys.includes(key)) {
        opts.add(key)
      }
      if (item.children && item.children.length > 0) {
        loop(item.children)
      }
    })
  }

  loop(dtos)
  return [...opts]
}
