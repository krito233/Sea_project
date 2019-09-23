<template>
<div class="container">
    <div id="allmap"></div>
  <div class="btn">
    <button class="yuntu" @click="showyun">云图</button>
    <button class="yuntu" @click="showrader">雷达图</button>
  </div>
</div>
</template>

<script>
import {loadAmap} from './loadAmap'
import {request} from '../../net/request'
export default {
  name: 'AMap',
  data () {
    return {
      ak: '',
      myMap: '',
      cloud: '',
      iscloud: false,
      israder: false,
      cloudurl: ''
    }
  },
  mounted () {
    console.log(this.myMap)
    this.initAmap()
    console.log('加载了')
  },
  methods: {
    initAmap () {
      loadAmap().then(AMap => {
        console.log('地图加载成功')
        this.myMap = new AMap.Map('allmap', {
          mapStyle: 'amap://styles/b822e859c146f419a23db9748b0251f7',
          center: [120.397428, 29.90923],
          zoom: 5
        })
      }, e => {
        alert('地图加载失败' + e)
      })
    },
    showyun () {
      let _this = this
      _this.cleanrader()
      if (_this.iscloud === false) {
        request({
          url: '/thirdparty/tpdata/cloud.do'
        }).then(res => {
          _this.cloudurl = res.data
          loadAmap().then(AMap => {
            _this.cloud = new AMap.ImageLayer({
              bounds: new AMap.Bounds([95, -2], [160, 43]),
              url: res.data.items[0].url, // 图片 Url
              zIndex: 2,
              opacity: 0.7,
              zooms: [3, 18] // 设置可见级别，[最小级别，最大级别]
            })
            _this.myMap.add(_this.cloud)
            console.log('获取云图数据成功')
            _this.iscloud = true
          }, e => {
            alert('获取云图数据失败' + e)
          })
        }).catch(e => {
          console.log('获取云图失败' + e)
        })
      } else {
        this.myMap.remove(_this.cloud)
        this.iscloud = false
        console.log('删除成功')
      }
    },
    showrader () {
      let _this = this
      _this.cleancloud()
      if (_this.israder === false) {
        request({
          url: '/thirdparty/tpdata/radar.do'
        }).then(res => {
          _this.cloudurl = res.data
          loadAmap().then(AMap => {
            _this.cloud = new AMap.ImageLayer({
              bounds: new AMap.Bounds([71.9282, 3.9079], [150.6026, 57.9079]),
              url: res.data.items[0].url, // 图片 Url
              zIndex: 2,
              opacity: 0.7,
              zooms: [3, 18] // 设置可见级别，[最小级别，最大级别]
            })
            _this.myMap.add(_this.cloud)
            console.log('获取雷达图数据成功')
            _this.israder = true
          }, e => {
            alert('获取雷达图数据失败' + e)
          })
        }).catch(e => {
          console.log('获取雷达图失败' + e)
        })
      } else {
        this.myMap.remove(_this.cloud)
        this.israder = false
        console.log('删除成功')
      }
    },
    cleancloud () {
      if (this.iscloud === true) {
        this.iscloud = false
        this.myMap.remove(this.cloud)
      }
    },
    cleanrader () {
      if (this.israder === true) {
        this.israder = false
        this.myMap.remove(this.cloud)
      }
    }
  }
}
</script>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
    position: relative;
  /*text-align: center;*/
}
#allmap {
    width: 100%;
    height: 100%;
}
.btn {
    position: absolute;
    bottom: 20px;
    text-align: center
}
</style>
