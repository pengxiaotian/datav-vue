import { ElMessage } from 'element-plus'

type RetDataType = 'string' | 'json' | 'object'

interface RetData {
  code: number
  message: string
}

const parseError = (error: any, retDataType: RetDataType) => {
  const ret: RetData = {
    code: -1,
    message: 'error',
  }

  const res = error.response || { data: error }
  if (res && res.data) {
    const { status, code, message } = res.data
    ret.code = status || code || -1
    ret.message = message || res.data
  }

  if (retDataType === 'string') {
    return ret.message
  }

  if (retDataType === 'json') {
    return JSON.stringify(ret)
  }

  return ret
}

export const MessageUtil = {
  format(error: any) {
    return parseError(error, 'string') as string
  },
  formatJson(error: any) {
    return parseError(error, 'json') as string
  },
  formatObject(error: any) {
    return parseError(error, 'object') as RetData
  },

  success(message: string, showClose = true) {
    ElMessage({
      type: 'success',
      showClose,
      message,
    })
  },

  error(message: string, showClose = true) {
    ElMessage({
      type: 'error',
      showClose,
      message,
    })
  },
}
