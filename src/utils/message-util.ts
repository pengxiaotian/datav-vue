import { ElMessage, ElMessageBox } from 'element-plus'

interface RetDataMap {
  string: string
  json: string
  object: {
    code: number
    message: string
  }
}

function parseError<K extends keyof RetDataMap>(error: any, type: K): RetDataMap[K] {
  const retData = {
    code: -1,
    message: 'error',
  }

  const res = error.response || { data: error }
  if (res && res.data) {
    const { status, code, message } = res.data
    retData.code = status || code || -1
    retData.message = message || res.data
  }

  const ret = type === 'string'
    ? retData.message : type === 'json'
      ? JSON.stringify(retData) : retData

  return ret as RetDataMap[K]
}

export const MessageUtil = {
  format(error: any) {
    return parseError(error, 'string')
  },
  formatJson(error: any) {
    return parseError(error, 'json')
  },
  formatObject(error: any) {
    return parseError(error, 'object')
  },

  success(message: string, showClose = true) {
    ElMessage({
      type: 'success',
      showClose,
      message,
    })
  },

  warning(message: string, showClose = true) {
    ElMessage({
      type: 'warning',
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

export const MessageBoxUtil = {
  confirm(message: string, callback: Function, title = '') {
    ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
    })
      .then(() => {
        callback()
      })
      .catch(() => {})
  },
  async confirmAsync(message: string, callback: Function, options?: {
    title?: string
    success?: Function
    error?: Function
  }) {
    const opt = {
      title: '',
      ...(options || {}),
    }
    await ElMessageBox.confirm(message, opt.title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true,
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '执行中...'

          try {
            await callback()
            done()
          } catch (error) {
            MessageUtil.error(MessageUtil.format(error))
          } finally {
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
          }
        } else {
          done()
        }
      },
    })
      .then(() => {
        if (typeof opt.success === 'function') {
          opt.success()
        }
      })
      .catch(() => {
        if (typeof opt.error === 'function') {
          opt.error()
        }
      })
  },
}
