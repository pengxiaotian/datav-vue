import { ColorMappingScaleType } from './interface'

export const getDefaultColor = (scaleType: ColorMappingScaleType) => {
  if (scaleType === 'ordinal') {
    return {
      scheme: 'cat-7',
      range: [
        '{"stops":[{"offset":1,"color":"rgba(36, 131, 255, 0.97)"},{"offset":100,"color":"#88bafe"}],"angle":90}',
        '{"stops":[{"offset":0,"color":"rgb(77, 177, 86)"},{"offset":100,"color":"rgb(128, 252, 139)"}],"angle":90}',
        '{"stops":[{"offset":0,"color":"rgb(5, 186, 242)"},{"offset":99,"color":"rgb(68, 239, 242)"}],"angle":90}',
        '{"stops":[{"offset":0,"color":"#f2ed29"},{"offset":99,"color":"#f9f68a"}],"angle":90}',
        '{"stops":[{"offset":0,"color":"rgb(239, 81, 9)"},{"offset":98,"color":"rgb(249, 135, 1)"}],"angle":90}',
        '{"stops":[{"offset":2,"color":"#8c57e4"},{"offset":100,"color":"rgba(224, 131, 255, 0.97)"}],"angle":90}',
        '{"stops":[{"offset":0,"color":"rgba(36, 131, 255, 0.97)"},{"offset":99,"color":"rgb(131, 183, 252)"}],"angle":90}',
      ],
      domain: Array(7).fill(''),
      pin: Array(7).fill(false),
      custom: false,
      excepted: 'yellow',
      abnormal: '#808080',
    }
  }

  const num = scaleType === 'linear' ? 7 : 8
  const domain = Array(num).fill(0).map((m, i) => Math.floor(1000 / (num - 1)) * i)
  domain[num - 1] = Math.max(1000, domain[num - 1])
  return {
    scheme: 'seq-7',
    range: ['#96ccff', '#7fb9ff', '#69a6ff', '#5293ff', '#3b7fff', '#256cff', '#0e59ff'],
    domain,
    pin: Array(7).fill(false),
    custom: false,
    excepted: 'yellow',
    abnormal: '#808080',
  }
}
