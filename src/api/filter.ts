import request from '@/utils/request'

export function getFilters(projectId: number) {
  return request.get('/filter', { params: { projectId } })
}

export function createFilter(data: any) {
  return request.post('/filter', data)
}

export function updateFilter(data: any) {
  return request.put(`/filter/${data.id}`, data)
}

export function updateFilterName(data: any) {
  return request.put(`/filter/${data.id}/name`, data)
}

export function deleteFilter(id: number) {
  return request.delete(`/filter/${id}`)
}
