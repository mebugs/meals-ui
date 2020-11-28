import request from '@/utils/request'

export function getTableList() {
  return request({
    url: '/code/getTableList',
    method: 'get'
  })
}

export function getTableColumnList(data) {
  return request({
    url: '/code/getTableColumnList',
    method: 'get',
    params: { tableName: data }
  })
}

export function makeCode(data) {
  return request({
    url: '/code/make',
    method: 'post',
    data
  })
}

