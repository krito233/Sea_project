<template>
<div class="container">
    <div id="allmap"></div>
  <div class="btn">
    <button class="yuntu" @click="showyun">云图</button>
    <button class="yuntu" @click="showrader">雷达图</button>
    <button class="yuntu" @click="showwzfubiao">温州浮标</button>
    <button class="yuntu" @click="showjpfubiao(0)">台湾浮标</button>
    <button class="yuntu" @click="showjpfubiao(1)">日本浮标</button>
    <button class="yuntu" @click="cleanMarker">清除浮标</button>
  </div>
</div>
</template>

<script>
import {loadAmap} from './loadAmap'
import {request, head} from '../../net/request'
import {tw, wz, jp} from '../../assets/fubiaodata'
export default {
  name: 'AMap',
  data () {
    return {
      ak: '',
      wz: wz,
      tw: tw,
      jp: jp,
      myMap: '',
      cloud: '',
      iscloud: false,
      israder: false,
      cloudurl: '',
      icon: '',
      fubiaoList: [],
      textList: []
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
        this.icon = new AMap.Icon({
          size: new AMap.Size(31, 45),
          image: require('../../assets/locat.png'),
          zIndex: 0,
          imageSize: new AMap.Size(31, 45)
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
          url: '/thirdparty/tpdata/getPic.do',
          params: {
            type: 'cloud',
            kind: 0
          }
        }).then(res => {
          _this.cloudurl = res.data
          loadAmap().then(AMap => {
            _this.cloud = new AMap.ImageLayer({
              bounds: new AMap.Bounds([95, -2], [160, 43]),
              url: head + res.data.data[0].url, // 图片 Url
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
          url: '/thirdparty/tpdata/getPic.do',
          params: {
            type: 'radar',
            kind: 0
          }
        }).then(res => {
          _this.cloudurl = res.data
          // console.log(res.data.data[0].url)
          loadAmap().then(AMap => {
            _this.cloud = new AMap.ImageLayer({
              bounds: new AMap.Bounds([71.9282, 3.9079], [150.6026, 57.9079]),
              url: head + res.data.data[0].url, // 图片 Url
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
    },
    showwzfubiao () {
      if (this.fubiaoList !== []){
        this.cleanMarker()
      }
      let _this = this
      let list = this.wz
      request({
        url: '/thirdparty/tpdata/wz.do'
      }).then(res => {
        console.log('获取成功')
        loadAmap().then(AMap => {
          for (let i = 0; i < list.length; i++) {
            let job = list[i]
            let data = {job: job, index: i}
            let marker = new AMap.Marker({
              position: new AMap.LngLat(job.pos[0], job.pos[1]),
              offset: new AMap.Pixel(-15.5, -45),
              icon: _this.icon, // 添加 Icon 实例
              title: job.stnm,
              zIndex: 3,
              zooms: [5, 18],
              clickable: true,
              extData: data
            })
            marker.on('click', function () {
              for (let j = 0; j < _this.fubiaoList.length; j++) {
                _this.fubiaoList[j].setLabel(null)
                _this.fubiaoList[j].setzIndex(1)
              }
              this.setzIndex(500)
              // let index = this.getExtData().index
              marker.setLabel({
                offset: new AMap.Pixel(86, 147), // 设置文本标注偏移量
                content: '<div class="fubiao_info">' +
                  // '<button class="aui_close2" @click="{this.$refs["amap"].closeMarker(' + index + ')}">×</button>' +
                  '<p>当前潮位值：' + res.data.data[i].data[0].val + '</p><p>该点警戒值：' + res.data.data[i].data[0].wrz + '</p><p>时间：' + res.data.data[i].data[0].tm + '</p></div>', // 设置文本标注内容
                direction: 'top',
                zIndex: 500
              })
            })
            let text = new AMap.Text({
              text: job.stnm,
              position: new AMap.LngLat(job.pos[0], job.pos[1]),
              offset: new AMap.Pixel(-15.5, 10),
              zooms: [5, 18],
              zIndex: 500
            })
            text.setStyle({
              'font-size': '12px',
              'color': '#fff',
              'font-weight': 'bold',
              'background': '#000000',
              'border': '1px solid #fff'
            })
            _this.myMap.add(text)
            _this.textList.push(text)
            _this.fubiaoList.push(marker)
          }
          _this.myMap.add(_this.textList)
          _this.myMap.add(_this.fubiaoList)
        })
      }).catch(e => {
        console.log('获取失败' + e)
      })
    },
    showjpfubiao (flag) {
      this.cleanMarker()
      let _this = this
      let list = ''
      let url = '/thirdparty/tpdata/fb.do'
      if (flag === 0) {
        list = this.tw
      } else {
        list = this.jp
      }
      request({
        url: url
      }).then(res => {
        console.log('获取成功')
        loadAmap().then(AMap => {
          for (let i = 0; i < list.length; i++) {
            let job = list[i]
            let data = {job: job, index: i}
            let marker = new AMap.Marker({
              position: new AMap.LngLat(job.pos[0], job.pos[1]),
              offset: new AMap.Pixel(-15.5, -45),
              icon: _this.icon, // 添加 Icon 实例
              title: job.stnm,
              zIndex: 3,
              zooms: [5, 18],
              clickable: true,
              extData: data
            })
            marker.on('click', function () {
              for (let j = 0; j < _this.fubiaoList.length; j++) {
                _this.fubiaoList[j].setLabel(null)
                _this.fubiaoList[j].setzIndex(1)
              }
              this.setzIndex(500)
              // let index = this.getExtData().index
              if (flag === 0) {
                marker.setLabel({
                  offset: new AMap.Pixel(86, 147), // 设置文本标注偏移量
                  content: '<div class="fubiao_info2" style="padding: 5px 5px;">' +
                    // '<button class="aui_close2" @click="{this.$refs["amap"].closeMarker(' + index + ')}">×</button>' +
                    '<p>波浪周期：' + res.data.tw.data[i].items[0].blzq + '</p><p>浪高：' + res.data.tw.data[i].items[0].lg + '</p><p>浪向：' + res.data.tw.data[i].items[0].lx + '</p><p>时间：' + res.data.tw.data[i].items[0].tm + '</p></div>', // 设置文本标注内容
                  direction: 'top',
                  zIndex: 500
                })
              } else {
                marker.setLabel({
                  offset: new AMap.Pixel(86, 147), // 设置文本标注偏移量
                  content: '<div class="fubiao_info2">' +
                    // '<button class="aui_close2" @click="{this.$refs["amap"].closeMarker(' + index + ')}">×</button>' +
                    '<p>波浪周期：' + res.data.jpn.data[i].items[0].blzq + '</p><p>浪高：' + res.data.jpn.data[i].items[0].lg + '</p><p>浪向：' + res.data.jpn.data[i].items[0].lx + '</p><p>时间：' + res.data.jpn.data[i].items[0].tm + '</p></div>', // 设置文本标注内容
                  direction: 'top',
                  zIndex: 500
                })
              }
            })
            let text = new AMap.Text({
              text: job.stnm,
              position: new AMap.LngLat(job.pos[0], job.pos[1]),
              offset: new AMap.Pixel(-15.5, 10),
              zooms: [5, 18],
              zIndex: 500
            })
            text.setStyle({
              'font-size': '12px',
              'color': '#fff',
              'font-weight': 'bold',
              'background': '#000000',
              'border': '1px solid #fff'
            })
            _this.myMap.add(text)
            _this.textList.push(text)
            _this.fubiaoList.push(marker)
          }
          _this.myMap.add(_this.textList)
          _this.myMap.add(_this.fubiaoList)
        })
      }).catch(e => {
        console.log('获取失败' + e)
      })
    },
    cleanMarker () {
      if (this.fubiaoList !== []) {
        for (let i = 0; i < this.fubiaoList.length; i++){
          this.fubiaoList[i].setLabel(null)
        }
        this.myMap.remove(this.fubiaoList)
        this.myMap.remove(this.textList)
        this.fubiaoList = []
        this.textList = []
      } else {
        console.log('空')
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
  left: 200px;
  bottom: 20px;
  text-align: center
}

</style>
