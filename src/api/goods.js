import request from '@/utils/request'

export function getGoodsList(params) {
  return request({
    url: '/goods',
    method: 'get',
    params
  })
}