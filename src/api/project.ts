import request from '@/utils/request'

export function getProjects() {
  return request.get('/project')
}

export function createProject(data: any) {
  return request.post('/project', data)
}

export function updateProjectName(id: number, name: string) {
  return request.put(`/project/${id}/name`, { name })
}

export function deleteProject(id: number) {
  return request.delete(`/project/${id}`)
}

export function updateProjectGroup(id: number, data: any) {
  return request.put(`/project/${id}/group`, data)
}

export function copyProject(id: number) {
  return request.post(`/project/${id}/action/copy`)
}
