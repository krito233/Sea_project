import axios from 'axios'
//本地测试
 const head = 'http://test.qdwanzhong.top/'
//线上
//const head = '../'

function request (config) {
  const geturl = axios.create({
    baseURL: 'http://test.qdwanzhong.top',
    timeout: 5000
  })
  return geturl(config)
}

function getimg (url) {
  const getimgurl = axios.get({
    timeout: 5000
  })
  return getimgurl(url)
}

export {request, head, getimg}
