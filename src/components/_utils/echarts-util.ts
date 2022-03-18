import Accounting from 'accounting'

export const getAutoValue = (val: string | number) => {
  if (typeof val === 'number') {
    return val
  }

  return parseFloat(val) || null
}

export const getLimitValue = (val: string | number) => {
  if (val === 'dataMin' || val === 'dataMax') {
    return val
  }

  return getAutoValue(val)
}

export const valueFormater = (val: string, format: string) => {
  if (format === 'd') {
    return Accounting.toFixed(+val)
  }

  if (format === '.1f') {
    return Accounting.toFixed(+val, 1)
  }

  if (format === '.2f') {
    return Accounting.toFixed(+val, 2)
  }

  if (format === '.0%') {
    return `${Accounting.toFixed(parseFloat(val) * 100)}%`
  }

  if (format === '.1%') {
    return `${Accounting.toFixed(parseFloat(val) * 100, 1)}%`
  }

  if (format === '.2%') {
    return `${Accounting.toFixed(parseFloat(val) * 100, 2)}%`
  }

  if (format === 'th') {
    return Accounting.formatNumber(+val)
  }

  if (format === '.1t') {
    return Accounting.formatNumber(+val, 1)
  }

  if (format === '.2t') {
    return Accounting.formatNumber(+val, 2)
  }

  return val
}
