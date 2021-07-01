import request from '@/utils/request'

const PreviewKey = 'DataV-Preview'

export async function getScreen(screenId: number) {
  await request.get('/screen', { params: { screenId } })

  try {
    const dataStr = localStorage.getItem(PreviewKey)
    if (dataStr) {
      return JSON.parse(dataStr)
    }
  } catch (error) {
    localStorage.removeItem(PreviewKey)
  }

  return null
}

export function saveScreen(data: any) {
  localStorage.setItem(PreviewKey, JSON.stringify(data))
  return request.post('/screen', data)
}
