export function warn(location: string, message: string): void {
  console.error(`[datav/${location}]: ${message}`)
}

export function throwError(location: string, message: string): never {
  throw new Error(`[datav/${location}]: ${message}`)
}
