export interface DatavErrorCause {
  targetId: string | number
  origin: Error
  message?: string
  comId?: string
  comName?: string
  extra?: string
}

export class DatavError extends Error {
  constructor(name: string, message: string, public cause: DatavErrorCause) {
    super(message)

    this.name = name || 'Datav Error'
    this.cause = cause
  }
}
