function getCloudUrl () {
  this.$axios.get('http://test.qdwanzhong.top/thirdparty/tpdata/cloud.do').then((response) => {
    console.log(response.data)
    return response.data.items.url
  }).catch(e => {
    console.log('获取云图失败' + e)
  })
}

function getRaderUrl () {
  this.$axios.get('http://test.qdwanzhong.top/thirdparty/tpdata/radar.do').then((response) => {
    console.log(response.data)
    return response.data.items.url
  }).catch(e => {
    console.log('获取云图失败' + e)
  })
}

export { getCloudUrl, getRaderUrl }
