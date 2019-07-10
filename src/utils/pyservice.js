
import axios from 'axios'
const pyservice = axios.create({
  // 在vue.config.js中配置了/back的映射，这样可以处理跨域问题
  baseURL: "/py", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  // 默认json格式数据
  headers: {
    'Content-Type': 'application/json'
  }
})

export default pyservice
