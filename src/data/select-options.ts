import { AnimationEasing } from '@/utils/enums'

export const fontFamilys = [
  { id: 'Microsoft Yahei', value: '微软雅黑' },
  { id: 'SimSun', value: '宋体' },
  { id: 'SimHei', value: '黑体' },
  { id: 'LiSu', value: '隶书' },
  { id: 'YouYuan', value: '幼圆' },
  { id: 'tahoma', value: 'tahoma' },
  { id: 'arial', value: 'arial' },
  { id: 'sans-serif', value: 'sans-serif' },
]

export const fontWeights = [
  { id: 'lighter', value: '细' },
  { id: 'normal', value: '正常' },
  { id: 'bolder', value: '粗' },
  { id: '100', value: '100' },
  { id: '200', value: '200' },
  { id: '300', value: '300' },
  { id: '400', value: '400' },
  { id: '500', value: '500' },
  { id: '600', value: '600' },
  { id: '700', value: '700' },
  { id: '800', value: '800' },
  { id: '900', value: '900' },
]

export const fontStyles = [
  { id: 'italic', value: '斜体' },
  { id: 'normal', value: '正常' },
]

export const hAligns = [
  { id: 'left', value: '左对齐' },
  { id: 'center', value: '居中对齐' },
  { id: 'right', value: '右对齐' },
]

export const vAligns = [
  { id: 'top', value: '上对齐' },
  { id: 'middle', value: '居中对齐' },
  { id: 'bottom', value: '下对齐' },
]

export const writingModes = [
  { id: 'horizontal-tb', value: '水平' },
  { id: 'vertical-rl', value: '垂直' },
]

export const justifyContents = [
  { id: 'flex-start', value: '左对齐' },
  { id: 'center', value: '居中对齐' },
  { id: 'flex-end', value: '右对齐' },
]

export const aligns = [
  { id: 'flex-start', value: '上对齐' },
  { id: 'center', value: '居中对齐' },
  { id: 'flex-end', value: '下对齐' },
]

export const angles = [
  { id: 'horizontal', value: '水平' },
  { id: 'bevel', value: '斜角' },
  { id: 'vertical', value: '垂直' },
]

export const locations = [
  { id: 'top-center', value: '顶部居中' },
  { id: 'top-left', value: '顶部居左' },
  { id: 'top-right', value: '顶部居右' },
  { id: 'bottom-center', value: '底部居中' },
  { id: 'bottom-left', value: '底部居左' },
  { id: 'bottom-right', value: '底部居右' },
]

export const lineStyles = [
  { id: 'solid', value: '实线' },
  { id: 'dotted', value: '虚线' },
]

export const fillTypes = [
  { id: 'solid', value: '实体填充' },
  { id: 'gradient', value: '渐变填充' },
]

export const repeatTypes = [
  { id: 'no-repeat', value: '不重复，拉伸满' },
  { id: 'repeat', value: '水平和垂直重复' },
  { id: 'repeat-x', value: '水平重复' },
  { id: 'repeat-y', value: '垂直重复' },
]

export const echartsLablePositions = [
  { id: 'top', value: '顶部' },
  { id: 'left', value: '左侧' },
  { id: 'right', value: '右侧' },
  { id: 'bottom', value: '底部' },
  { id: 'inside', value: '内部' },
  { id: 'insideLeft', value: '内-左侧' },
  { id: 'insideRight', value: '内-右侧' },
  { id: 'insideTop', value: '内-顶部' },
  { id: 'insideBottom', value: '内-底部' },
  { id: 'insideTopLeft', value: '内-顶部居左' },
  { id: 'insideBottomLeft', value: '内-底部居左' },
  { id: 'insideTopRight', value: '内-顶部居右' },
  { id: 'insideBottomRight', value: '内-顶部居右' },
]

export const animationEasings = Object.keys(AnimationEasing).map(m => ({ id: m, value: m }))
