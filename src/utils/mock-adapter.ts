import MockAdapter from 'axios-mock-adapter'
import request from '@/utils/request'

const mockAdapter = new MockAdapter(request, { delayResponse: 1000 })

export default mockAdapter
