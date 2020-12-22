import request from '@/utils/request'

export function getAllRole() {
  return request({
    url: '/sysRole/allList',
    method: 'get'
  })
}

export function pageRole(params) {
  return request({
    url: '/sysRole/rolePage',
    method: 'get',
    params: params
  })
}

export function getRoleInfo(params) {
  return request({
    url: '/sysRole/roleInfo/' + params,
    method: 'get'
  })
}

export function saveRole(data) {
  return request({
    url: '/sysRole/save',
    method: 'post',
    data
  })
}
