
const tokens = {
  admin: {
    token: 'admin-token'
  },
  user: {
    token: 'user-token'
  }
}

const users = {
  'admin-token': {
    role: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'user-token': {
    role: ['user'],
    introduction: 'I am an User',
    avatar: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3434964180,3432166125&fm=85&app=63&f=JPEG?w=121&h=75&s=2CC0985EC2A2C7FD0EBDFABE0300501D',
    name: 'Normal User'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // user logout
  {
    url: '/user/modifyProfile',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: {
          introduction: "mock data",
          telephone: "123456789",
          email: "123456789@123.com"
        }
      }
    }
  }
]
