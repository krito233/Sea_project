import axios from 'axios'

function request (config) {
  const geturl = axios.create({
    baseURL: 'http://test.qdwanzhong.top',
    timeout: 5000
  })
  return geturl(config)
}

export {request}
