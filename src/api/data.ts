import axios from 'axios'

export async function getStaticData(comPath: string) {
  return axios.get(`/data/${comPath}.json`)
}
