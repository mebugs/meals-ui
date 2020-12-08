import request from '@/utils/request'

export function getAllRole() {
  return request({
    url: '/sysRole/allList',
    method: 'get'
  })
}
