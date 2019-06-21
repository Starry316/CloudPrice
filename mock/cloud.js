import Mock from 'mockjs'

const data = Mock.mock({
  'list|5': [{
    'id|+1': 0,

    type: '@sentence(1, 10)',
    'os|1': ['linux', 'windows'],
    serverRoom: '@sentence(1, 10)',
  }],
})


export default [
  {
    url: '/cloud/list',
    type: 'get',
    response: config => {
      const list = data.list
      return {
        code: 20000,
        data: {
          list: list,

        }
      }
    }
  }
]
