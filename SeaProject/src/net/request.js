import axios from 'axios'

const head = 'http://test.qdwanzhong.top/'

function request (config) {
  const geturl = axios.create({
    baseURL: 'http://test.qdwanzhong.top',
    timeout: 5000
  })
  return geturl(config)
}

export {request, head}
