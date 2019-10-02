import axios from 'axios'

const head = 'http://test.qdwanzhong.top/'

function request (config) {
  const geturl = axios.create({
    baseURL: 'http://test.qdwanzhong.top',
    timeout: 5000
  })
  return geturl(config)
}

function getimg (config) {
  request(config).then(res => {
    console.log(res.data)
    return res.data
  }).catch(e => {
    console.log('获取失败' + e)
  })
}

export {request, head, getimg}
