import request from '@/utils/request'

const baseurl = "/api/account"

export function login(data) {
  return request({
    url: baseurl+'/login',
    method: 'post',
    data: data
  })
}


export function logout() {
  return request({
    url: baseurl+'/logout',
    method: 'post'
  })
}
export function loginCode() {
  return request({
    url: baseurl+'/login/code',
    method: 'get'
  })
}

/**
 *
 * @param data { email: string }
 */
export function registerMail(data) {
  return request({
    url: baseurl+'/register/mail',
    method: 'post',
    data:data
  })
}

/**
 * 注册
 * @param data
 * {
    "email":"",
    "code":"code",
    "name":"name",
    "password":"pass"
  }
 */
export function register(data) {
  return request({
    url: baseurl+'/register/code',
    method: 'post',
    data:data
  })
}
