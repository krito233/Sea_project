<template>
  <div class="container">
    <div class="fw" v-if="mode===1">
      <div class="his">
        <div class="header">
          <div class="tit">浮标历史数据查询</div>
          <button class="aui_close" @click="changemode(0)">×</button>
        </div>
        <div class="main">
          <div class="top">
            <div class="lead">时间：</div>
            <vdate ref="tdate" style="width: 50%"/>
            <div class="lead">站点：</div>
            <div class="select">
              <select id="selectMethod" v-model="fub">
                <option :value="fb.stcd" v-if="fubiaotype==='tw'" v-for="fb in tw">{{fb.stnm}}</option>
                <option :value="fb.stcd" v-if="fubiaotype==='wz'" v-for="fb in wz">{{fb.stnm}}</option>
                <option :value="fb.stcd" v-if="fubiaotype==='jp'" v-for="fb in jp">{{fb.stnm}}</option>
              </select>
            </div>
            <div class="search" @click="search">搜索</div>
            <div class="search" @click="tableToExcel">下载</div>
            <a id="down" href="" style="display: none"></a>
          </div>
          <div class="table">
            <table class="table_a">
              <tr>
                <th>时间</th>
                <th v-if="fubiaotype==='wz'">潮位</th>
                <th v-if="fubiaotype==='wz'">警戒值</th>
                <th v-if="fubiaotype!=='wz'">波浪周期</th>
                <th v-if="fubiaotype!=='wz'">浪高</th>
                <th v-if="fubiaotype!=='wz'">浪向</th>
              </tr>
              <tr v-for="(info, index) in tblist">
                <td>{{info.tm}}</td>
                <td v-if="fubiaotype==='wz'">{{info.val}}</td>
                <td v-if="fubiaotype==='wz'">{{info.wrz}}</td>
                <td v-if="fubiaotype!=='wz'">{{info.blzq}}</td>
                <td v-if="fubiaotype!=='wz'">{{info.lg}}</td>
                <td v-if="fubiaotype!=='wz'">{{info.lx}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div id="allmap"></div>
    <p v-if="iscloud" class="radartit">{{time}}</p>
    <p v-if="israder" class="radartit">{{time}}</p>
    <!--<p v-if="isshowfubiao" class="radartit">{{fubiaoinfo}}</p>-->
    <div class="zuo">
      <img v-if="istuli" class="tuli" src="../../assets/tuli.png"/>
<!--      <p class="copyright">青岛海之声科技有限公司技术服务</p>-->
    </div>
    <div id="volet_clos">
      <div id="volet" :class="{activex:isshowfubiaowin}" style="text-align: center;color: black">
        <p>{{fbname}}</p>
        <p style="cursor: pointer;float:right;color:rgb(68,114,196);font-size: 1rem;" @click="changemode(1)">历史数据查询</p>
<!--        <p v-if="mode===1" style="cursor: pointer;float:right;color:rgb(68,114,196);font-size: 1rem;" @click="changemode(0)">收起</p>-->
        <table class="table_tw">
          <tr>
            <th>时间</th>
            <th v-if="fubiaotype==='wz'">潮位</th>
            <th v-if="fubiaotype==='wz'">警戒值</th>
            <th v-if="fubiaotype!=='wz'">波浪周期</th>
            <th v-if="fubiaotype!=='wz'">浪高</th>
            <th v-if="fubiaotype!=='wz'">浪向</th>
          </tr>
          <tr v-for="(info, index) in fubiaoinfo" v-if="index<3">
            <td>{{info.tm}}</td>
            <td v-if="fubiaotype==='wz'">{{info.val}}</td>
            <td v-if="fubiaotype==='wz'">{{info.wrz}}</td>
            <td v-if="fubiaotype!=='wz'">{{info.blzq}}</td>
            <td v-if="fubiaotype!=='wz'">{{info.lg}}</td>
            <td v-if="fubiaotype!=='wz'">{{info.lx}}</td>
          </tr>
        </table>
        <p style="margin-top: 4vh;" v-if="fubiaotype!=='wz'">历史浪高图</p>
        <p style="margin-top: 4vh;" v-if="fubiaotype ==='wz'">历史潮位图</p>
        <div id="container2" class="chartClass"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {loadAmap} from './loadAmap'
import {request, head} from '../../net/request'
import {tw, wz, jp} from '../../assets/fubiaodata'
import chart1 from '../chart1'
import echarts from 'echarts'
import vdate from './vdate'
import laydate from '../../../static/laydate/laydate.js'
import ElementUI from 'element-ui'
// import  from 'iview/src/components/checkbox'

export default {
  name: 'AMap',
  components: {
    chart1,
    vdate
  },
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
      textList: [],
      maptype: true,
      allTyphoons: [],
      ty_pointList: [],
      lnglat: '',
      cir: '',
      typhoon_img: '',
      telist: [],
      istyphoon: false,
      typhoonList: [],
      pointList: [],
      tylist: [],
      json: '',
      tfbh: '',
      time: '',
      fubiaotype: '',
      istuli: false,
      dataList: [[]],
      myChart2: '',
      dataTList: [],
      // isshowfubiao: false,
      isshowfubiaowin: false,
      fubiaoinfo: [],
      fbname: '',
      jpfbimg: '',
      mode: 0,
      startdate: null,
      enddate: null,
      fub: '',
      tblist: ''
    }
  },
  mounted () {
    laydate.render({
      elem: '#start1',
      done: (value) => {
        this.startdate = value
      }
    })
    laydate.render({
      elem: '#end1',
      done: (value) => {
        this.enddate = value
      }
    })
    console.log(this.myMap)
    this.initAmap()
    console.log('加载了')
  },
  methods: {
    initAmap () {
      let _this = this
      loadAmap().then(AMap => {
        console.log('地图加载成功')
        _this.myMap = new AMap.Map('allmap', {
          // mapStyle: 'amap://styles/b822e859c146f419a23db9748b0251f7',
          center: [120.397428, 29.90923],
          zoom: 5
        })
        _this.icon = new AMap.Icon({
          size: new AMap.Size(40, 40),
          image: require('../../assets/locate.png'),
          zIndex: 0,
          imageSize: new AMap.Size(40, 40)
        })
        _this.typhoon_img = new AMap.Icon({
          size: new AMap.Size(64, 64),
          image: require('../../assets/typnoon_d.png'),
          zIndex: 1,
          imageSize: new AMap.Size(64, 64)
        })
      }, e => {
        alert('地图加载失败' + e)
      })
      request('/thirdparty/tpdata/typhoonList.do').then(res => {
        this.tylist = res.data
      }).catch(e => {
        console.log('获取失败' + e)
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
          _this.time = res.data.data[res.data.data.length-1].tm.substring(0, 4) + '年' + res.data.data[res.data.data.length-1].tm.substring(5, 7) + '月' + res.data.data[res.data.data.length-1].tm.substring(8, 10) + '日' + res.data.data[res.data.data.length-1].tm.substring(11, 17) + '云图'
          loadAmap().then(AMap => {
            _this.cloud = new AMap.ImageLayer({
              bounds: new AMap.Bounds([95, -2], [160, 43]),
              url: head + res.data.data[res.data.data.length-1].url, // 图片 Url
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
          _this.time = res.data.data[res.data.data.length-1].tm.substring(0, 4) + '年' + res.data.data[res.data.data.length-1].tm.substring(5, 7) + '月' + res.data.data[res.data.data.length-1].tm.substring(8, 10) + '日' + res.data.data[res.data.data.length-1].tm.substring(11, 17) + '雷达图'
          // console.log(res.data.data[0].url)
          loadAmap().then(AMap => {
            _this.cloud = new AMap.ImageLayer({
              bounds: new AMap.Bounds([71.9282, 3.9079], [150.6026, 57.9079]),
              url: head + res.data.data[res.data.data.length-1].url, // 图片 Url
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
      if (this.fubiaoList !== []) {
        this.cleanMarker()
      }
      this.fubiaotype = 'wz'
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
              offset: new AMap.Pixel(-20, -40),
              icon: _this.icon, // 添加 Icon 实例
              title: job.stnm,
              zIndex: 3,
              zooms: [5, 18],
              clickable: true,
              extData: data
            })
            marker.on('click', function () {
              let this_ = _this
              this_.isshowfubiaowin = true
              _this.mode = 0
              // console.log(this.getExtData().index)
              this_.fbname = this.getExtData().job.stnm
              this_.fub = this.getExtData().job.stnm
              request({
                url: '/thirdparty/tpdata/wz.do',
                params: {day: 2}
              }).then(res2 => {
                  // console.log(res2.data.error)
                  this_.dataList = null
                  this_.dataList = []
                  this_.fubiaoinfo = []
                  this_.dataTList = []
                if(res2.data.error === '0'){
                  this_.fubiaoinfo = res2.data.data[i].data
                  for (let x = 0; x < res2.data.data[i].data.length; x++) {
                    this_.dataList[x] = []
                    this_.dataList[x][0] = x
                    if (res2.data.data[i].data[x].val === '-') {
                      this_.dataList[x][1] = ''
                    } else {
                      this_.dataList[x][1] = eval(res2.data.data[i].data[x].val)
                    }
                    this_.dataTList[x] = res2.data.data[i].data[x].tm
                  }
                }else {
                    alert('获取潮位数据失败')
                }
                // console.log(this_.dataList)
                this_.drawHistory(2)
              })
              for (let j = 0; j < _this.fubiaoList.length; j++) {
                _this.fubiaoList[j].setLabel(null)
                _this.fubiaoList[j].setzIndex(1)
              }
              this.setzIndex(500)
            })
            let text = new AMap.Text({
              text: job.stnm,
              position: new AMap.LngLat(job.pos[0], job.pos[1]),
              offset: new AMap.Pixel(0, -50),
              zooms: [5, 18],
              zIndex: 500
            })
            text.setStyle({
              'font-size': '12px',
              'color': '#5C3300',
              'font-weight': 'bold',
              'background': 'rgba(0,0,0,0)',
              'border': '0',
              'border-radius': '0'
            })
            _this.myMap.add(text)
            _this.textList.push(text)
            _this.fubiaoList.push(marker)
          }
          _this.myMap.add(_this.textList)
          _this.myMap.add(_this.fubiaoList)
          _this.myMap.setZoomAndCenter(10, new AMap.LngLat(120.803000, 27.971900))
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
        this.fubiaotype = 'tw'
      } else {
        this.fubiaotype = 'jp'
        list = this.jp
      }
      request({
        url: url,
        params: {
          day: 2
        }
      }).then(res => {
        console.log('获取成功')
        // console.log(res.data.jpn.data[0].items[0].lx.length)
        // console.log(res.data.jpn.data[0].items[0].lx[0])
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
              _this.mode = 0
              _this.isshowfubiaowin = true
              _this.fbname = this.getExtData().job.stnm
              _this.fub = this.getExtData().job.stnm
              for (let j = 0; j < _this.fubiaoList.length; j++) {
                _this.fubiaoList[j].setLabel(null)
                _this.fubiaoList[j].setzIndex(1)
              }
              this.setzIndex(500)
              // let index = this.getExtData().index
              if (flag === 0) {
                let this_ = _this
                request({
                  url: '/thirdparty/tpdata/fb.do',
                  params: {
                    day: 2
                  }
                }).then(res2 => {
                   // console.log(res2)
                    this_.dataList = null
                    this_.dataList = []
                    this_.fubiaoinfo = []
                    this_.dataTList = []
                  if(!res2.data.tw.error){
                    this_.fubiaoinfo = res2.data.tw.data[i].items
                    for (let x = 0; x < res2.data.tw.data[i].items.length; x++) {
                      this_.dataList[x] = []
                      this_.dataList[x][0] = x
                      if (res2.data.tw.data[i].items[x].lg === '-') {
                        this_.dataList[x][1] = ''
                      } else {
                        this_.dataList[x][1] = eval(res2.data.tw.data[i].items[x].lg)
                      }
                      this_.dataTList[x] = res2.data.tw.data[i].items[x].tm
                    }
                    // console.log(this_.dataList)
                  }
                  else {
                      alert('获取浪高数据失败')
                  }
                  this_.drawHistory(2)
                })
                // marker.setLabel({
                //   offset: new AMap.Pixel(125, 345), // 设置文本标注偏移量
                //   content: '<div class="fubiao_info2" style="padding: 5px 5px;">' +
                //       // '<button class="aui_close2" @click="{this.$refs["amap"].closeMarker(' + index + ')}">×</button>' +
                //       '<p>波浪周期：' + res.data.tw.data[i].items[0].blzq + '</p><p>浪高：' + res.data.tw.data[i].items[0].lg + '</p><p>浪向：' + res.data.tw.data[i].items[0].lx + '</p><p>时间：' + res.data.tw.data[i].items[0].tm + '</p></div><div id="container3"  class="chartClass" style="width: 100%; height: 20vh;"></div>', // 设置文本标注内容
                //   direction: 'top',
                //   zIndex: 500
                // })
              } else {
                  // console.log(res)
                  _this.dataList = null
                  _this.dataList = []
                  _this.fubiaoinfo = []
                  _this.dataTList = []
                if(!res.data.jpn.error){
                  _this.fubiaoinfo = res.data.jpn.data[i].items
                  for (let x = 0; x < _this.fubiaoinfo.length; x++) {
                    _this.dataList[x] = []
                    _this.dataList[x][0] = x
                    if (_this.fubiaoinfo[x].lg === '-') {
                      _this.dataList[x][1] = ''
                    } else {
                      _this.dataList[x][1] = eval(_this.fubiaoinfo[x].lg)
                    }
                    _this.dataTList[x] = _this.fubiaoinfo[x].tm
                  }}else {
                    alert('获取浪高数据失败')
                }
                // console.log(_this.fubiaoinfo)
                _this.drawHistory(3)
                // _this.fbname = this.getExtData().job.stnm
                request({
                  url: '/thirdparty/tpdata/getPic.do',
                  params: {
                    type: 'jpn',
                    kind: 0,
                    stcd: res.data.jpn.data[i].stcd
                  }
                }).then(ans => {
                  console.log(ans)
                  _this.jpfbimg = _this.head + ans.data.data[0].url
                  // marker.setLabel({
                  //   offset: new AMap.Pixel(125, 345), // 设置文本标注偏移量
                  //   content: '<div class="fubiao_info2">' +
                  //   // '<button class="aui_close2" @click="{this.$refs["amap"].closeMarker(' + index + ')}">×</button>' +
                  //   '<p>波浪周期：' + res.data.jpn.data[i].items[0].blzq + '</p><p>浪高：' + res.data.jpn.data[i].items[0].lg + '</p><p>浪向：' + res.data.jpn.data[i].items[0].lx + '</p><p>时间：' + res.data.jpn.data[i].items[0].tm + '</p><img style="width: 100%;" src="' + head + ans.data.data[0].url + '"></div>', // 设置文本标注内容
                  //   direction: 'top',
                  //   zIndex: 500
                  // })
                }).catch(e => {
                  console.log('获取失败' + e)
                })
              }
            })
            let text = new AMap.Text({
              text: job.stnm,
              position: new AMap.LngLat(job.pos[0], job.pos[1]),
              offset: new AMap.Pixel(0, -50),
              zooms: [5, 18],
              zIndex: 500
            })
            text.setStyle({
              'font-size': '12px',
              'color': '#5C3300',
              'font-weight': 'bold',
              'background': 'rgba(0,0,0,0)',
              'border': '0',
              'border-radius': '0'
            })
            _this.myMap.add(text)
            _this.textList.push(text)
            _this.fubiaoList.push(marker)
          }
          _this.myMap.add(_this.textList)
          _this.myMap.add(_this.fubiaoList)
          _this.myMap.setZoomAndCenter(6, new AMap.LngLat(124.1028, 24.3653))
        })
      }).catch(e => {
        console.log('获取失败' + e)
      })
    },
    cleanMarker () {
      if (this.fubiaoList !== []) {
        for (let i = 0; i < this.fubiaoList.length; i++) {
          this.fubiaoList[i].setLabel(null)
        }
        this.myMap.remove(this.fubiaoList)
        this.myMap.remove(this.textList)
        this.fubiaoList = []
        this.textList = []
      } else {
        console.log('空')
      }
    },
    drawHistory (k) {
      let this_ = this
      // console.log('233')
      this.myChart2 = echarts.init(document.getElementById('container2'))
      // if (k === 2) {
      //   this.myChart2 = echarts.init(document.getElementById('container2'))
      // } else {
      //   this.myChart2 = echarts.init(document.getElementById('container3'))
      // }
      this.myChart2.setOption({
        xAxis: {
          type: 'category',
          data: this_.dataTList.reverse(),
          name: '',
          axisLabel : {
              show: true,
              interval:24,
              rotate:0,
              textStyle: {
                  color: '#333'
              },
              fontSize: 10,

            formatter: function (value, index) {
                var date = new Date(value);
                var texts = [(date.getMonth() + 1), date.getDate()];
                texts.unshift(date.getYear()+1900);
                return texts.join('/');
            }

          },
        },
        yAxis: {
          type: 'value',
          name:(function () {
              if (this_.fubiaotype ==='wz'){
                  return '潮位/m'
              }
              else {
                  return '浪高/m'
              }
          }) (),
        },
        grid: {
          left: '10%',
          right: '5%',
          top: '20%',
          bottom: '15%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var dataIndex = params.dataIndex
              if (this_.fubiaotype ==='wz'){
                  return '时间: ' + params[0].axisValue + '<br>潮位数值: ' + params[0].value[1] + '米'
              }
              else {
                  return '时间: ' + params[0].axisValue + '<br>浪高数值: ' + params[0].value[1] + '米'
              }
          }
        },
        series: [{
          data: this_.dataList.reverse(),
          type: 'line'
        }]
      })
    },
    changetype () {
      if (this.maptype === true) {
        this.maptype = !this.maptype
        loadAmap().then(AMap => {
          this.myMap = new AMap.Map('allmap', {
            center: [120.397428, 29.90923],
            zoom: 5
          })
        })
      } else {
        this.maptype = !this.maptype
        loadAmap().then(AMap => {
          this.myMap = new AMap.Map('allmap', {
            mapStyle: 'amap://styles/b822e859c146f419a23db9748b0251f7',
            center: [120.397428, 29.90923],
            zoom: 5
          })
        })
      }
    },
    typhoon (tpbh) {
      console.log(this.istyphoon)
      if (this.istyphoon === false) {
        this.istyphoon = true
        this.newShowTyphoon(tpbh)
        this.tfbh = tpbh
      } else {
        this.istyphoon = false
        // this.hideTyphoon()
        if (this.tfbh !== tpbh) {
          this.istyphoon = true
          this.newShowTyphoon(tpbh)
          this.tfbh = tpbh
        }
      }
    },
    newShowTyphoon (tpbh) {
      let _this = this
      request({
        url: '/thirdparty/tpdata/typhoonPath.do',
        params: {
          id: tpbh
        }
      }).then(res => {
        _this.allTyphoons = res.data.data
        console.log(res.data)
        _this.myMap.setZoom(5)
        _this.drawLuJing(0)
      })
    },
    drawLuJing (i) {
      if (this.allTyphoons.length <= parseInt(i)) {
        return
      }
      this.json = this.allTyphoons[i]
      // console.log(json)
      i++
      this.drawPoint(0, i)
    },
    drawPoint (i, list_index) {
      let _this = this
      // console.dir(list_index)
      // console.log(JSON.parse(json))
      let allTyphoonData = _this.json
      // console.log(allTyphoonData)
      let point = allTyphoonData.points[i]
      // console.log(allTyphoonData.points[2].longitude)
      // console.log(point)
      loadAmap().then(AMap => {
        let lnglat = new AMap.LngLat(point.longitude, point.latitude)
        // console.log(lnglat)
        // console.log(point.longitude)
        let cir = new AMap.CircleMarker({
          center: lnglat,
          strokeColor: '#333',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: _this.getPointColor(point.strong),
          zIndex: 100,
          radius: 7,
          extData: point
        })
        // console.dir(cir.getOptions())
        _this.myMap.panTo(lnglat)
        if (i === 0) {
          // console.log(allTyphoonData.points)
          let observeTime2 = allTyphoonData.points[0].time
          // console.log(observeTime2)
          // console.log(allTyphoonData.name)
          let cont = allTyphoonData.name + '：' + observeTime2.substring(5, 7) + '月' + observeTime2.substring(8, 10) + '日' + observeTime2.substring(11, 13) + '时' + observeTime2.substring(15, 16) + '分'
          let startText = new AMap.Text({
            text: "<div style='font-size:12px;padding:5px 4px 5px 4px;box-shadow: 3px 3px 2px #888888;border-radius:5px;background-color:#ffffff;'>" + cont + '</div>',
            position: lnglat,
            zooms: [6, 18],
            offset: new AMap.Pixel(0, -20)
          })
          _this.telist.push(startText)
          _this.myMap.add(startText)
          _this.myMap.panTo(lnglat)
        } else {
          let old_point = allTyphoonData.points[i - 1]
          let old_lnglat = new AMap.LngLat(old_point.longitude, old_point.latitude)
          let list_LngLat = [lnglat, old_lnglat]
          let line = new AMap.Polyline({
            path: list_LngLat,
            zIndex: 50,
            strokeColor: '#415bff',
            strokeWeight: 1.5
          })
          _this.typhoonList.push(line)
          _this.myMap.add(line)
        }
        if (i === allTyphoonData.points.length - 1) {
          let observeTime2 = allTyphoonData.points[allTyphoonData.points.length - 1].time
          let f_time = allTyphoonData.name + '：' + observeTime2.substring(5, 7) + '月' + observeTime2.substring(8, 10) + '日' + observeTime2.substring(11, 13) + '时' + observeTime2.substring(14, 16) + '分<br/>'
          // cont = "<div class='typhoon_info'> <div style='height:18px;width:18px;position:absolute;right:5px;top:5px;' onclick='closeMarker()'><img src='static/images/close.png' height=100% width=100% /></div>"
          let cont = "<div class='typhoon_info'>"
          cont += "<div class='head'>" + f_time + '</div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>当前位置</p><p style='color:##5B3200;margin-left:10px;'>经度" + allTyphoonData.points[i].longitude + ',纬度' + allTyphoonData.points[i].latitude + '</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>中心气压</p><p style='color:##5B3200;margin-left:10px;'>" + allTyphoonData.points[i].pressure + '百帕</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>最大风速</p><p style='color:##5B3200;margin-left:10px;'>" + allTyphoonData.points[i].speed + '米/秒</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>风</p><p style='color:#aaaaaa;margin-left:26px;'>力</p><p style='color:##5B3200;margin-left:10px;'>" + allTyphoonData.points[i].power + '级</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>等</p><p style='color:#aaaaaa;margin-left:26px;'>级</p><p style='color:##5B3200;margin-left:10px;'>" + allTyphoonData.points[i].strong + '</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>移动速度</p><p style='color:##5B3200;margin-left:10px;'>" + allTyphoonData.points[i].move_speed + '米/秒</p></div>'
          cont += '</div>'
          let endText = new AMap.Text({
            text: cont,
            position: lnglat,
            zooms: [4, 18],
            offset: new AMap.Pixel(0, -110)
          })
          // map.remove(telist);
          _this.telist.push(endText)
          _this.myMap.add(endText)
          // 添加终点台风图片
          let startLngLat_1 = new AMap.LngLat(allTyphoonData.points[allTyphoonData.points.length - 1].longitude, allTyphoonData.points[allTyphoonData.points.length - 1].latitude)
          let list_LngLat_1 = [startLngLat_1]
          let marker = new AMap.Marker({
            position: startLngLat_1,
            offset: new AMap.Pixel(-30, -30),
            icon: _this.typhoon_img, // 添加 Icon 实例
            // cont: "<img src='../../assets/typnoon_d.png' height=60px width=60px class='fc'/>",
            zIndex: -1,
            clickable: true,
            extData: allTyphoonData.points[allTyphoonData.points.length - 1]
          })
          marker.on('click', function (e) {
            _this.myMap.remove(_this.telist)
            _this.telist.push(endText)
            _this.myMap.add(endText)
          })
          console.dir(marker.getzIndex())
          _this.pointList.push(marker)
          _this.myMap.add(marker)
          marker.setzIndex(1)
        }
        _this.ty_pointList.push(lnglat)
        cir.on('click', function () {
          let jo = this.getExtData()
          // console.log(jo)
          let o_time = jo.time.substring(5, 7) + '月' + jo.time.substring(8, 10) + '日' + jo.time.substring(11, 13) + '时' + jo.time.substring(14, 16) + '分'
          let cont = "<div class='typhoon_info'>"
          cont += "<div class='head'>" + o_time + '</div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>当前位置</p><p style='color:##5B3200;margin-left:10px;'>经度" + jo.longitude + ',纬度' + jo.latitude + '</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>中心气压</p><p style='color:##5B3200;margin-left:10px;'>" + jo.pressure + '百帕</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>最大风速</p><p style='color:##5B3200;margin-left:10px;'>" + jo.speed + '米/秒</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>风</p><p style='color:#aaaaaa;margin-left:26px;'>力</p><p style='color:##5B3200;margin-left:10px;'>" + jo.power + '级</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>等</p><p style='color:#aaaaaa;margin-left:26px;'>级</p><p style='color:##5B3200;margin-left:10px;'>" + jo.strong + '</p></div>'
          cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>移动速度</p><p style='color:##5B3200;margin-left:10px;'>" + jo.move_speed + '米/秒</p></div>'
          cont += '</div>'
          let te = new AMap.Text({
            text: cont,
            position: new AMap.LngLat(jo.longitude, jo.latitude),
            offset: new AMap.Pixel(0, -130)
          })
          _this.myMap.remove(_this.telist)
          _this.telist.push(te)
          _this.myMap.add(te)
        })
        _this.pointList.push(cir)
        _this.myMap.add(cir)
        i++
        if (i === allTyphoonData.points.length) {
          _this.forcastPoint(allTyphoonData)
          setTimeout(() => {
            _this.drawLuJing(list_index)
          }, 1000)
          return
        }
        setTimeout(() => { _this.drawPoint(i, list_index) }, 25)
      })
    },
    forcastPoint (json) {
      let for_num = 1
      let _this = this
      if (json.points.length < 2) {
        for_num = json.points.length
      }
      loadAmap().then(AMap => {
        for (let ten = 1; ten <= for_num; ten++) {
          let forecast = json.points[json.points.length - ten].forecast
          if (forecast === null) {
            forecast = []
          }
          let startLngLat = new AMap.LngLat(json.points[json.points.length - ten].longitude, json.points[json.points.length - ten].latitude)
          let list_LngLat = [startLngLat]
          for (let i = 0; i < forecast.length; i++) {
            // console.log(forecast.length)
            for (let j = 1; j < forecast[i].points.length; j++) {
              let point = forecast[i].points[j]
              // console.log(forecast[i].sets)
              let lnglat = new AMap.LngLat(point.longitude, point.latitude)
              let cir = new AMap.CircleMarker({
                center: lnglat,
                strokeColor: '#333', // getPointColor(point.strong),
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: _this.getPointColor(point.strong),
                zIndex: 100,
                radius: 7,
                extData: point
              })
              cir.on('click', function () {
                let jo = this.getExtData()
                _this.myMap.panTo(new AMap.LngLat(jo.longitude, jo.latitude))
                let o_time = '预报:' + jo.time.substring(5, 7) + '月' + jo.time.substring(8, 10) + '日' + jo.time.substring(11, 13) + '时' + jo.time.substring(14, 16) + '分'
                let cont = "<div class='typhoon_info'>"
                cont += "<div class='head'>" + o_time + '</div>'
                cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>当前位置</p><p style='color:##5B3200;margin-left:10px;'>经度" + jo.longitude + ',纬度' + jo.latitude + '</p></div>'
                // cont+="<div style='width:180px;margin-left:10px;height:1px;background-color:#E5E5E5;padding:0;'></div>";
                cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>中心气压</p><p style='color:##5B3200;margin-left:10px;'>" + (jo.pressure || '--') + '百帕</p></div>'
                // cont+="<div style='width:180px;margin-left:10px;height:1px;background-color:#E5E5E5;padding:0;'></div>";
                cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>最大风速</p><p style='color:##5B3200;margin-left:10px;'>" + (jo.speed || '--') + '米/秒</p></div>'
                cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>风</p><p style='color:#aaaaaa;margin-left:26px;'>力</p><p style='color:##5B3200;margin-left:10px;'>" + (jo.power || '--') + '级</p></div>'
                cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>等</p><p style='color:#aaaaaa;margin-left:26px;'>级</p><p style='color:##5B3200;margin-left:10px;'>" + (jo.strong || '--') + '</p></div>'
                cont += "<div style='display:flex;border-bottom:1px solid #E5E5E5;'><p style='color:#aaaaaa;margin-left:10px;'>移动速度</p><p style='color:##5B3200;margin-left:10px;'>" + (jo.move_speed || '--') + '米/秒</p></div>'
                cont += '</div>'
                let te = new AMap.Text({
                  text: cont,
                  position: new AMap.LngLat(jo.longitude, jo.latitude),
                  offset: new AMap.Pixel(0, -130)
                })
                _this.myMap.remove(_this.telist)
                _this.telist.push(te)
                _this.myMap.add(te)
              })

              _this.pointList.push(cir)
              list_LngLat.push(new AMap.LngLat(point.longitude, point.latitude))
              _this.myMap.add(cir)
            }

            let line = new AMap.Polyline({
              path: list_LngLat,
              zIndex: 50,
              strokeStyle: 'dashed',
              strokeColor: _this.getForcastColor(forecast[i].sets),
              strokeWeight: 2
            })
            list_LngLat = [startLngLat]
            _this.typhoonList.push(line)
            _this.myMap.add(line)
          }
        }
      })
    },
    hideTyphoon () {
      this.istyphoon = false
      this.myMap.remove(this.pointList)
      this.myMap.remove(this.typhoonList)
      this.myMap.remove(this.telist)
      this.telist = []
      this.pointList = []
      this.typhoonList = []
    },
    getPointColor (strong) {
      switch (strong) {
        case '热带低压(TD)':
          return '#30FC31'
        case '热带风暴(TS)':
          return '#307EFA'
        case '强热带风暴(STS)':
          return '#FAF82F'
        case '台风(TY)':
          return '#FABA31'
        case '强台风(STY)':
          return '#F08BF4'
        case '超强台风(Super TY)':
          return '#FA3031'
        default:
          return '#FFFFFF'
      }
    },
    getForcastColor (jigou) {
      switch (jigou) {
        case '中国':
          return '#D23441'
        case '美国':
          return '#E844F1'
        case '日本':
          return '#78A848'
        case '中国香港':
          return '#7CE3D6'
        case '中国台湾':
          return '#E2E3B0'
        case '韩国':
          return '#6A9895'
        case '欧洲':
          return '#2D53A8'
        default:
          return '#FFFFFF'
      }
    },
    showtuli () {
      this.istuli = !this.istuli
    },
    changetuli (flag) {
      this.istuli = flag
    },
    changemode (flag) {
      this.mode = flag
      this.tblist = this.fubiaoinfo
    },
    search () {
      this.startTime = this.$refs['tdate'].startdate
      this.endTime = this.$refs['tdate'].enddate
      if (this.fubiaotype === 'wz') {
        console.log(this.fub)
        console.log(this.startTime)
        request({
          url: '/thirdparty/tpdata/wz.do',
          params: {
            stcd: this.fub,
            startTime: this.startTime + ' 00:00:00',
            endTime: this.endTime + ' 23:00:00'
          }
        }).then(res => {
          console.log(res)
          for (let i = 0; i < res.data.data.length; i++) {
            if (this.fub === res.data.data[i].stcd) {
              this.tblist = res.data.data[i].data
              console.log(res.data.data[i].data)
              break
            }
          }
          // this.tblist = res.data
        }).catch(e => {
          console.log(e)
        })
      } else {
        request({
          url: '/thirdparty/tpdata/fb.do',
          params: {
            // stcd: this.fub,
            startTime: this.startTime + ' 00:00:00',
            endTime: this.endTime + ' 23:00:00'
          }
        }).then(res => {
          console.log(this.fub)
          console.log(res)
          if (this.fubiaotype === 'jp') {
            console.log(1)
            for (let i = 0; i < res.data.jpn.data.length; i++) {
              if (this.fub === res.data.jpn.data[i].stcd) {
                this.tblist = res.data.jpn.data[i].items
                console.log(res.data.jpn.data[i].items)
                break
              }
            }
          } else {
            console.log(2)
            for (let i = 0; i < res.data.tw.data.length; i++) {
              if (this.fub === res.data.tw.data[i].stcd) {
                this.tblist = res.data.tw.data[i].items
                console.log(res.data.tw.data[i].items)
                break
              }
            }
          }

          // this.tblist = res.data
        }).catch(e => {
          console.log(e)
        })
      }
    },
    tableToExcel () {
      const jsonData = this.tblist
      // 列标题
      let str = ''
      if (this.fubiaotype === 'wz') {
        str = '<tr><td>潮位</td><td>时间</td><td>警戒值</td></tr>'
      } else {
        str = '<tr><td>时间</td><td>浪高</td><td>浪向</td><td>波浪周期</td></tr>'
      }
      // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < jsonData.length; i++) {
        str += '<tr>'
        for (let item in jsonData[i]) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          str += `<td>${ jsonData[i][item] + '\t'}</td>`
        }
        str += '</tr>'
      }
      // Worksheet名
      let worksheet = this.fbname
      let uri = 'data:application/vnd.ms-excel;base64,'

      // 下载的表格模板数据
      let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset='UTF-8'><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`
      // 下载模板
      let filename = this.fbname
      if (this.startTime) {
        filename = filename + '_' +  this.startTime + '--' + this.endTime
      }
      let down = document.getElementById('down')
      down.href = uri + this.base64(template)
      down.download = filename
      down.click()
    },
    base64 (s) {
      return window.btoa(unescape(encodeURIComponent(s)))
    }
  }
}
</script>

<style scoped>
  .container {
    width: 86.5%;
    height: 100vh;
    top: 0;
    left: 13.5%;
    position: relative;
    background: linear-gradient(135deg, transparent $tl, $bg 0) top left;
    /*text-align: center;*/
  }
  #allmap {
    width: 100%;
    height: 100%;
  }
  .radartit {
    position: absolute;
    font-size: 1.2rem;
    top: 10px;
    right: 20px;
    z-index: 0;
  }
  .btn {
    position: absolute;
    left: 200px;
    bottom: 20px;
    text-align: center
  }
  .typhoon_info{
    box-shadow:3px 3px 2px #888888;
    width:230px;
    height:auto;
    border-radius:10px;
    background-color:#ffffff;
  }
  .typhoon_info>.head{
    padding:8px 0px 8px 0px;
    border-top-right-radius:10px;
    border-top-left-radius:10px;
    background-color:#AADAFF;
    color:#333333;width:100%;
    font-size:15px;
    text-align:center;
  }
  .typhoon_info>div{
    padding:5px 0px 5px 0px;width:100%;
  }
  .typhoon_info>div>p{
    margin:0;
    font-size:13px;
  }
  .copyright {
    background-color: #fff;
  }
  .tuli {
    width: 14rem;
  }
  .zuo {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .chartClass{
    width: 100%;
    height: 100%;
  }
  #volet_clos {
    position: fixed;
    top: 80px;
    right: 0;
  }
  #volet span {
    cursor: pointer;
    font-size: 1.1rem;
    color: #000;
  }
  #volet {
    width: 25vw;
    max-height: 60vh;
    padding: 10px;
    background: #fff;
    color: #fff;
    /*display: none;*/
    z-index: 0;
    overflow: auto;
  }
  #container2{
    margin-top: 8vh;
    width: 25vw;
    height: 26vh;
  }
  table{
    border-spacing: 0px!important;
    width: 100%;
    margin-top: 3rem;
  }
  #volet p{
    float: left;
    font-size: 1.2rem;
    color: #000;
    cursor: pointer;
  }
  tr{
    display: table-row;
    border: 1px solid #555;
    font-size: 12px;
    padding: 3px;
    vertical-align: top;
    text-align: center;
  }
  th{
    font-size: 1em;
    padding: 5px;
  }
  tr:nth-child(odd) {
    background-color: #f6f4f0;
  }
  tr:first-child {
    color: #fff;
    background-color: #555;
  }
  td{
    display: table-cell;
    line-height: 2em;
    min-width: 2vw;
    border: 1px solid #d4d4d4;
    padding: 5px;
    vertical-align: top;
    font-size: 1em;
  }
  #volet a.ouvrir,
  #volet a.fermer {
    padding: 10px 25px;
    background: #555;
    color: #fff;
    text-decoration: none;
  }

  #volet {
    position: absolute;
    border-radius: 8px;
    border: 1px solid #fff;
    right: -27vw;  /* test fixed + scroll, on retire la position top */
    -webkit-transition: all .5s ease-in;
    -moz-transition: all .5s ease-in;
    transition: all .5s ease-in;
    min-height: 400px;
    box-shadow: #95a1ad 3px 3px;
  }
  #volet a.ouvrir,
  #volet a.fermer {
    position: absolute;
    left: -79px;
    top: 150px;
    -webkit-transform: rotate(270deg);
    -moz-transform: rotate(270deg);
    -o-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    -moz-radius: 0 0 8px 8px;
    border-radius: 8px 8px 0 0;
  }
  #volet a.fermer {
    display: none;
  }
  .activex {
    right: 10px!important;
    /*display: block!important;*/
    z-index: 500;
    -webkit-transition: all .5s ease-in!important;
    -moz-transition: all .5s ease-in!important;
    transition: all .5s ease-in!important;
  }
  #volet::-webkit-scrollbar {/*滚动条整体样式*/
    margin-right: 3px;
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    /*scrollbar-arrow-color:red;*/
  }
  #volet::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
    scrollbar-arrow-color:red;
  }
  #volet::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .fw {
    position: absolute;
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,.4);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .aui_close {
    width: 20px;
    height: 20px;
    z-index: 1000;
    line-height: 20px;
    display: block;
    /*position: absolute;*/
    right:50px;
    top: 1.5vh;
    font-family: Helvetica, STHeiti,serif;
    _font-family: '\u9ed1\u4f53', 'Book Antiqua', Palatino;
    font-size: 18px;
    border-radius: 20px;
    background: #999;
    color: #FFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    -moz-transition: linear .06s;
    -webkit-transition: linear .06s;
    transition: linear .06s;
    padding: 0;
    text-align: center;
    text-decoration: none;
    outline: none;
    cursor: pointer;
  }
  .aui_close:hover {
    width: 24px;
    height: 24px;
    line-height: 24px;
    right:50px;
    top:1vh;
    color: #FFF;
    box-shadow: 0 1px 3px rgba(209, 40, 42,1);
    background: #d1282a;
    border-radius: 24px;
    transition: all 0.2s ease-out;
    opacity: 0.8;
  }
  .his {
    width: 60%;
    height: 75%;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    /*display: flex;*/
    /*flex-wrap: wrap;*/
  }
  .header {
    box-sizing: border-box;
    margin-top: 10px;
    padding-left: 20px;
    width: 100%;
    height: 30px;
    display: flex;
    flex-wrap: nowrap;
    border-bottom: 2px solid #95a1ad;
  }
  .tit {
    width: 95%;
    font-size: 1.3rem;
    font-weight: 600;
  }
  .main {
    width: 100%;
    height: 40px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .top {
    width: 100%;
    padding: 0 35px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .select {
    /*width: 10%;*/
  }
  select {
    /*width: 100%;*/
    /*padding: 0.5rem;*/
    padding: 0 5px;
    color: #000;
    /*background-color: #344e76;*/
    text-align: center;
    border-radius: 5px;
    border: 1px solid #000;
    cursor: pointer;
    /*margin-top: 2vh;*/
  }
  .table {
    padding: 0 35px;
    width: 100%;
    height: 65vh;
    overflow: auto;
  }
  .table_a {
    margin-top: 10px;
  }
  .search {
    margin-left: 5px;
    font-size: 0.9rem;
    padding: 3px;
    background-color: #344e76;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
  }
</style>
