import request from '@/utils/request'

export function login(data) {
  return request({

    url: '/api/account/login',
    method: 'post',
    data: JSON.stringify(data)
  })
}

export function register(data) {
  return request({
    url: '/user/signup',
    method: 'post',
    data
  })
}



export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function modifyProfile(data) {
  return request({
    url: '/user/modifyProfile',
    method: 'post',
    params:{ data }
  })
}

export function modifyPassword(data) {
  return request({
    url: '/user/modifyPassword',
    method: 'post',
    params:{ data }
  })
}
