import request from '@/utils/request'

export function getAllAuthTree() {
  return request({
    url: '/sysAuth/allAuthTree',
    method: 'get'
  })
}
