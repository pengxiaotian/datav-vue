export interface BorderImage {
  id: string
  name: string
  src: string
  width?: number
  height?: number
  preview?: string
  border?: {
    width: string
    outset: string
    slice: string
    repeat: string
  }
}
