import axios from 'axios'

export async function getStaticData(comId: string, comPath: string) {
  if (comPath) {
    return axios.get(`/data/${comPath}.json?comId=${comId}`)
  }

  return Promise.reject('Not Found')
}
