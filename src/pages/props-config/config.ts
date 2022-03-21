
import { isPlainObject, isArray, isNumber, isString, isBool } from '@/utils/util'
import { ToolboxType } from '@/domains/editor'
import {
  fontFamilys,
  fontWeights,
  fontStyles,
  hAligns,
  vAligns,
  writingModes,
  justifyContents,
  aligns,
  angles,
  legendLocations,
  titleLocations,
  lineStyles,
  fillTypes,
  repeatTypes,
  echartsLablePositions,
  animationEasings,
  selectSuggests,
  legendIcons,
  orients,
  axisTypes,
  valueFormats,
  timeFormats,
  imageTypes,
} from '@/data/select-options'

// 用于生成模板
export const AllOptionKeys = ['fontFamilys', 'fontWeights', 'fontStyles', 'hAligns', 'vAligns', 'writingModes', 'justifyContents', 'aligns', 'angles', 'legendLocations', 'titleLocations', 'lineStyles', 'fillTypes', 'repeatTypes', 'echartsLablePositions', 'animationEasings', 'selectSuggests', 'legendIcons', 'orients', 'axisTypes', 'valueFormats', 'timeFormats', 'imageTypes']

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
  legendLocation = 'legendLocation',
  titleLocation = 'titleLocation',
  lineStyle = 'lineStyle',
  fillType = 'fillType',
  repeatType = 'repeatType',
  uploadImage = 'uploadImage',
  selectImage = 'selectImage',
  echartsLablePosition = 'echartsLablePosition',
  animationEasing = 'animationEasing',
  selectSuggest = 'selectSuggest',
  legendIcon = 'legendIcon',
  orient = 'orient',
  axisType = 'axisType',
  valueFormat = 'valueFormat',
  timeFormat = 'timeFormat',
  imageType = 'imageType',
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
  pairs: { key: string; value: string; }[]
  whichEnum: {
    field: string
    value: string
  }
  flatValue: boolean
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
    pairs: [],
    whichEnum: {
      field: '',
      value: '',
    },
    flatValue: false,
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
        virtualPath = `slotProps.item${prev.substring(idx + 2)}.${key}`
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
    const jsonItem = jsonArr.find(m => m.key === tsItem.key && m.path === tsItem.path)
    if (jsonItem) {
      const defaultConfig = {
        type: tsItem.config.type,
        defaultValue: tsItem.config.defaultValue,
      }

      tsItem.config = {
        ...tsItem.config,
        ...jsonItem.config,
        ...defaultConfig,
      }

      if (tsItem.children && tsItem.children.length > 0
        && jsonItem.children && jsonItem.children.length > 0) {
        mixinPropData(tsItem.children, jsonItem.children)
      }
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

export const getSelectedOptions = (type: ComponentType) => {
  if (type === ComponentType.fontFamily) {
    return fontFamilys
  }

  if (type === ComponentType.fontWeight) {
    return fontWeights
  }

  if (type === ComponentType.fontStyle) {
    return fontStyles
  }

  if (type === ComponentType.hAlign) {
    return hAligns
  }

  if (type === ComponentType.vAlign) {
    return vAligns
  }

  if (type === ComponentType.writingMode) {
    return writingModes
  }

  if (type === ComponentType.justifyContent) {
    return justifyContents
  }

  if (type === ComponentType.align) {
    return aligns
  }

  if (type === ComponentType.angle) {
    return angles
  }

  if (type === ComponentType.legendLocation) {
    return legendLocations
  }

  if (type === ComponentType.titleLocation) {
    return titleLocations
  }

  if (type === ComponentType.lineStyle) {
    return lineStyles
  }

  if (type === ComponentType.fillType) {
    return fillTypes
  }

  if (type === ComponentType.repeatType) {
    return repeatTypes
  }

  if (type === ComponentType.echartsLablePosition) {
    return echartsLablePositions
  }

  if (type === ComponentType.animationEasing) {
    return animationEasings
  }

  if (type === ComponentType.legendIcon) {
    return legendIcons
  }

  if (type === ComponentType.selectSuggest) {
    return selectSuggests
  }

  if (type === ComponentType.orient) {
    return orients
  }

  if (type === ComponentType.axisType) {
    return axisTypes
  }

  if (type === ComponentType.valueFormat) {
    return valueFormats
  }

  if (type === ComponentType.timeFormat) {
    return timeFormats
  }

  if (type === ComponentType.imageType) {
    return imageTypes
  }

  return []
}
