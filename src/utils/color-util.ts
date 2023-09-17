export const isColor = (targetColor: string) => {
  const opt = new Option()
  opt.style.background = targetColor
  return !!opt.style.background
}

export const colorToJson = (targetColor: string, defaultColor: string) => {
  if (targetColor) {
    const opt = new Option()
    let isGradient = false
    const arr = targetColor.split(';').map(m => m.trim())
    if (arr.length > 2) {
      isGradient = true
      let str = arr[0]
      for (let i = 1; i < arr.length; i++) {
        str += `, ${arr[i]}%`
      }
      opt.style.background = `linear-gradient(${str})`
    } else {
      opt.style.background = targetColor
    }

    if (opt.style.background) {
      if (isGradient) {
        const angle = parseFloat(arr[0])
        const stops = []
        for (let i = 1; i < arr.length; i++) {
          const [color, offset] = arr[i].split(' ')
          stops.push({
            color: color.trim(),
            offset: parseFloat(offset),
          })
        }
        return JSON.stringify({ angle, stops })
      }
      return targetColor
    }
  }
  return defaultColor
}

export const jsonToColor = (colorStr: string, transform = true) => {
  if (isColor(colorStr)) {
    return colorStr
  }

  const { angle, stops } = JSON.parse(colorStr)
  let str = `${angle}deg`
  for (let i = 0; i < stops.length; i++) {
    const { color, offset } = stops[i]
    str += transform ? `,${color} ${offset}%` : `;${color} ${offset}`
  }
  return transform ? `linear-gradient(${str})` : str
}
