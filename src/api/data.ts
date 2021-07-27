import axios from 'axios'

export async function getStaticData(comId: string, comPath: string) {
  return axios.get(`/data/${comPath}.json?comId=${comId}`)
}
