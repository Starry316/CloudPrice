import Mock from 'mockjs'

const data = Mock.mock({
  'list|15': [{
    'id|+1': 0,
    type: '@sentence(1, 10)',
    'os|1': ['linux', 'windows'],
    serverRoom: '@sentence(1, 10)',
  }],
  'actualList|20':[
    '@integer(0, 20)'
  ],
  'predictList|20':[
    '@integer(0, 20)'
  ],
  'serverRoomList|10':[
    '@sentence(1, 5)'
  ],
  'typeList|10':[
    '@sentence(1, 5)'
  ]
})



export default [
  {
    url: '/cloud/list',
    type: 'get',
    response: config => {
      const mockData = Mock.mock({
        'list|15': [{
          'id|+1': 0,
          type: '@sentence(1, 10)',
          'os|1': ['linux', 'windows'],
          serverRoom: '@sentence(1, 10)',
        }],
      })
      const list = mockData.list
      const { page } = config.body
      return {
        code: 20000,
        data: {
          list: list,
        }
      }
    }
  },

  {
    url: '/cloud/history',
    type: 'get',
    response: config => {

      const expectedData = data.predictList
      const actualData = data.actualList
      const chartData = {
        expectedData: expectedData,
        actualData: actualData,

      }
      return {
        code: 20000,
        data: {
          list: chartData
        }
      }
    }
  },

  {
    url: '/cloud/serverInfo',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          serverRoomList: data.serverRoomList,
          typeList: data.typeList
        }
      }
    }
  }

]
