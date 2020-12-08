import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getUserBase() {
  return request({
    url: '/user/base',
    method: 'get'
  })
}

export function saveUser(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

export function pageUser(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params: params
  })
}

export function getUser(params) {
  return request({
    url: '/user/get?id=' + params,
    method: 'get'
  })
}
