import axios from 'axios'
//本地测试
<<<<<<< HEAD
 const head = 'http://test.qdwanzhong.top/'
//线上
//const head = '../'
=======
const head = 'http://test.qdwanzhong.top/'
//线上
// const head = '../'
>>>>>>> 1f300fb10b641d4f75e3919ac156ce175dbdbead

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
