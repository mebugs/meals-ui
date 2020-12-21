import request from '@/utils/request'

export function getTableList(params) {
  return request({
    url: '/code/getTableList',
    method: 'get',
    params: params
  })
}

export function getTableColumnList(params) {
  return request({
    url: '/code/getTableColumnList',
    method: 'get',
    params: { tableName: params }
  })
}

export function makeCode(data) {
  return request({
    url: '/code/make',
    method: 'post',
    data
  })
}
