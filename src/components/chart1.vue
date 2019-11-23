<template>
  <div style="width: 100%;max-height: 60vh;text-align: center;">
    <div id="container" :style = "{width: '80%', height: '60vh',margin: '1rem auto'}"></div>
    <ul class="menu" >
      <li v-for="(list,index) in area"  class="menuli" @click="setstcd(index)" :class="{active:changeBk == index}">{{list.name}}</li>
    </ul>
    <div class="bn_menu1">
      <!--      <button v-for="(list,index) in choosedata"  class="bn" @click="setdata(index)" :class="{active:changeBk == index}">{{list.day}}</button>-->
      <button  @click="dataChange(3)" :class="{active:choosedata == 3}" class="bn">未来三天</button>
      <button @click="dataChange(0)" :class="{active:choosedata == 0}" class="bn">{{today0}}</button>
      <button @click="dataChange(1)" :class="{active:choosedata == 1}" class="bn">{{today1}}</button>
      <button @click="dataChange(2)" :class="{active:choosedata == 2}" class="bn">{{today2}}</button>
    </div>
    <div class="bn_menu2">
      <select id="selectMethod" v-model="tiptip">
        <option :value="1">单点调整</option>
        <option :value="2">三点调整</option>
        <option :value="3">整体调整</option>
      </select>
      <button class="bn" @click="submit()">提交调整</button>
      <button class="bn" @click="saveAsImage()">保存为图片</button>
      <button class="bn" @click="cancell()">撤销</button>
    </div>
    <!--    <button class="bn" @click="tiptip=1">单点调整</button>-->
    <!--    <button class="bn" @click="tiptip=2">三点调整</button>-->
    <!--    <button class="bn" @click="tiptip=3">整体调整</button>-->
  </div>
</template>
<style>
  ul {
    list-style-type: none;
  }
  .bn_menu1{
    top: 76vh;
    width: 100%;
    position: absolute;
    text-align: center;
  }
  .bn_menu2{
    top: 80vh;
    width: 100%;
    position: absolute;
    text-align: center;
  }
  select{
    width: 8%;
    padding: 0.5rem;
    color: white;
    background-color: #344e76;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 2vh;
  }
  .menu {
    width: 10%;
    position: absolute;
    top: 10vh;
    left: 10px;
    z-index: 100;
  }
  .menuli {
    color: #000;
    width: 8rem;
    text-align: center;
    margin-top: 1rem;
    padding: 1rem 1rem;
    border: 1px solid #345eb0;
    border-radius: 8px;
    background-color: #344e76;
    color: white;
    cursor: pointer;
  }
  .active {
    background-color:#207fde !important;
  }
  .bn {
    border: 1px solid #345eb0;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    margin: 0 10px;
    background-color: #344e76;
    color: white;
    cursor: pointer;
  }
</style>
<script  type="text/ecmascript-6">
import echarts from 'echarts'
import axios from 'axios'
import index from '../router'
// var tiptip = 1
var moren = 'http://test.qdwanzhong.top'
//var moren = '..'
export default {
  name: 'chart1',
  data () {
    // this.dataChange(0)
    return {
      symbolSize: '20',
      tiptip: 1,
      stTime: '',
      edTime: '',
      stcd: 'E52',
      dom: '',
      myChart: '',
      xiuZheng: '',
      yuanShi: '',
      data_a: [[]],
      data_b: [[]],
      va: 0,
      today0: '',
      today1: '',
      today2: '',
      todayE: '',
      area: [
        {name: '乐清湾'},
        {name: '瓯江口海域'},
        {name: '洞头岛以东海域'},
        {name: '瑞安近岸海域'},
        {name: '平阳近岸海域'},
        {name: '苍南近岸海域'},
        {name: '南麂岛海域'},
        {name: '北麂岛海域'}
      ],
      choosedata: 0,
      changeBk: 0,
      jk: ''
    }
  },
  component: {
    echarts
  },
  props: ['szyb'],
  mounted () {
    // this.dom =
    this.myChart = echarts.init(document.getElementById('container'))
    this.dataChange(0)
    this.getData()
  },
  methods: {
    selectDay () {
      this.dataChange(this.va)
    },
    setstcd (stcd) {
      this.changeBk = stcd
      this.stcd = 'E' + (52 + stcd)
      this.getData()
    },
    drawLine () {
      let _this = this
      var app = {}
      var symbolSize = 20
      var tim = new Array()
      var yuanShi = this.yuanShi
      let this_ = this
      this.myChart.setOption({
        textStyle: {
          // color: 'rgba(96,232,255,1)'
        },
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(255,255,255,1)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,1)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        },
        title: {
          text: '',
          textStyle: {
            // color: 'rgba(241,251,255,1)'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var dataIndex = params.dataIndex
            if (this_.szyb === 'hl') {
              return '时间: ' + params[0].axisValue + '<br>浪高数值: ' + parseInt(params[0].value[1] * 100) / 100 + '米'
            } else if (this_.szyb === 'hw') {
              return '时间: ' + params[0].axisValue + '<br>温度数值: ' + parseInt(params[0].value[1] * 10) / 10 + '℃'
            } else if (this_.szyb === 'cx') {
              return '时间: ' + params[0].axisValue + '<br>潮位数值: ' + parseInt(params[0].value[1] * 100) / 100 + '米'
            }
            return '时间: ' + params[0].axisValue + '<br>数值: ' + parseInt(params[0].value[1] * 100) / 100 + '米'
          }
        },
        legend: {
          data: ['预测值修正版', '预测值实测版'],
          textStyle: {
            // color: 'white'
          }
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data:
              (function () {
                // console.log(this_.yuanShi)
                let sjgs
                if (this_.yuanShi.length === 24) {
                  sjgs = 23
                } else if (this_.yuanShi.length === 72) {
                  sjgs = 72
                }
                for (var i = 0; i < this_.yuanShi.length; i++) {
                  var s
                  if (i % 24 < 10) {
                    s = '0' + i % 24
                  } else {
                    s = i % 24
                  }
                  if (i <= 23) {
                    if (this_.yuanShi.length <= 24) {
                      tim[i] = this_.todayE + '\n' + s + ':00'
                    } else {
                      tim[i] = this_.todayE[0] + '\n' + s + ':00'
                    }
                  } else if (i < 47) {
                    tim[i] = this_.todayE[1] + '\n' + s + ':00'
                  } else {
                    tim[i] = this_.todayE[2] + '\n' + s + ':00'
                  }
                }
                console.log(this_.todayE)
                return tim
              })(),
          name: '时间',
          nameTextStyle:{fontSize: 14},
          axisLabel: {
            textStyle: {
              fontSize : 14     //更改坐标轴文字大小
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {onZero: false},
          minInterval: 0.01,
          name: (function () {
            if (this_.szyb === 'hl') {
              return '浪高/米'
            } else if (this_.szyb === 'hw') {
              return '温度/℃'
            } else if (this_.szyb === 'cx') {
              return '潮位/米'
            }
          })(),
          nameTextStyle:{fontSize: 14},
          axisLabel: {
            textStyle: {
              fontSize : 14     //更改坐标轴文字大小
            }
          },
        },
        // dataZoom: [
        //   // {
        //   //   type: 'slider',
        //   //   xAxisIndex: 0,
        //   //   filterMode: 'empty',
        //   //   backgroundColor: 'rgba(0,0,0,0.4)',
        //   //   borderColor: 'rgba(0,0,0,0)',
        //   //   handleStyle: {
        //   //
        //   //   }
        //   // },
        //   // {
        //   //   type: 'slider',
        //   //   yAxisIndex: 0,
        //   //   filterMode: 'empty'
        //   // },
        //   {
        //     type: 'inside',
        //     xAxisIndex: 0,
        //     filterMode: 'empty'
        //   },
        //   {
        //     type: 'inside',
        //     yAxisIndex: 0,
        //     filterMode: 'empty'
        //   }
        // ],
        series: [
          {
            id: 'a',
            type: 'line',
            smooth: true,
            name: '预测值修正版',
            symbol: 'circle',
            symbolSize: 5,
            itemStyle: {
              normal: {
                color: '#207fde',
                lineStyle: {
                  color: '#207fde'
                }
              }
            },
            data: this.data_a
          },
          {
            id: 'b',
            type: 'line',
            smooth: true,
            name: '预测值实测版',
            symbol: 'circle',
            symbolSize: 5,
            itemStyle: {
              normal: {
                color: 'rgba(21,29,68,0.8)',
                lineStyle: {
                  color: 'rgba(21,29,68,0.8)'
                }
              }
            },
            data:
                (function () {
                  this_.data_b = []
                  for (var i = 0; i < yuanShi.length; i++) {
                    this_.data_b[i] = []
                    this_.data_b[i][0] = i
                    if (this_.szyb === 'hl') {
                      this_.data_b[i][1] = eval(yuanShi[i].bg)
                    } else if (this_.szyb === 'hw') {
                      this_.data_b[i][1] = yuanShi[i].temperature
                    } else if (this_.szyb === 'cx') {
                      this_.data_b[i][1] = yuanShi[i].cw
                    }
                  }
                  console.log(this_.data_b)
                  return this_.data_b
                })()

          }
        ],
        toolbox: {
          feature: {
            // saveAsImage: {}
          },
          iconStyle: {

            borderColor: 'rgba(96,232,255,1)'
          }
        }
      })

      if (!app.inNode) {
        let this_ = this
        setTimeout(() => {
          // Add shadow circles (which is not visible) to enable drag.
          this.myChart.setOption({
            graphic: echarts.util.map(this_.data_a, function (item, dataIndex) {
              return {
                type: 'circle',
                position: this_.myChart.convertToPixel('grid', item),
                shape: {
                  cx: 0,
                  cy: 0,
                  r: symbolSize / 2
                },
                invisible: true,
                draggable: true,
                ondrag: echarts.util.curry(onPointDragging, dataIndex),
                onmousemove: echarts.util.curry(showTooltip, dataIndex),
                onmouseout: echarts.util.curry(hideTooltip, dataIndex),
                z: 100
              }
            })
          })
        }, true)

        window.addEventListener('resize', updatePosition)
      }

      this.myChart.on('dataZoom', updatePosition)
      function updatePosition () {
        this_.myChart.setOption({
          graphic: echarts.util.map(this_.data_a, function (item, dataIndex) {
            return {
              position: this_.myChart.convertToPixel('grid', item)
            }
          })
        })
      }

      function showTooltip (dataIndex) {
        this_.myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: dataIndex
        })
      }

      function hideTooltip (dataIndex) {
        this_.myChart.dispatchAction({
          type: 'hideTip'
        })
      }
      var xs, xe, ys, ye
      this.myChart.on('datazoom', function (params) {
        var opt = this_.myChart.getOption()
        var dzx = opt.dataZoom[0]
        var dzy = opt.dataZoom[1]
        xs = dzx.startValue
        xe = dzx.endValue
        ys = dzy.startValue
        ye = dzy.endValue
      })
      function onPointDragging (dataIndex, dx, dy) {
        var x_smy = this_.data_a[dataIndex][0], y_smy = this_.data_a[dataIndex][1]
        if (_this.tiptip === 3) {
          for (var i = this_.data_a.length - 1; i >= 0; i--) {
            if ((this_.data_a[i][0] >= xs && this_.data_a[i][0] <= xe && this_.data_a[i][1] >= ys && this_.data_a[i][1] <= ye) || xs == undefined) {
              this_.data_a[i][1] = this_.data_a[i][1] + this_.myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy
            }
          }
          // Update data
        } else if (_this.tiptip === 2) {
          this_.data_a[dataIndex][1] = this_.data_a[dataIndex][1] + this_.myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy
          if (dataIndex > 0 && dataIndex < this_.data_a.length - 1) {
            this_.data_a[dataIndex - 1][1] = this_.data_a[dataIndex - 1][1] + (this_.myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy) * 0.7
            this_.data_a[dataIndex + 1][1] = this_.data_a[dataIndex + 1][1] + (this_.myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy) * 0.7
          }
        } else if (_this.tiptip === 1) {
          this_.data_a[dataIndex][1] = this_.data_a[dataIndex][1] + this_.myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy
        }
        this_.myChart.setOption({
          series: [{
            id: 'a',
            data: this_.data_a
          }]
        })
        updatePosition()
      }
      if (this.myChart.option && typeof this.myChart.option === 'object') {
        this.myChart.setOption(option, true)
      }
    },
    dataChange (k) {
      this.choosedata = k
      var date = new Date()
      var date2 = new Date(date.getTime() + (k - 1) * 24 * 60 * 60 * 1000)
      var date3 = new Date(date.getTime() + (k + 1) * 24 * 60 * 60 * 1000)
      this.today0 = new Date(date.getTime() + 0 * 24 * 60 * 60 * 1000)
      this.today1 = new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000)
      this.today2 = new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000)
      this.today0 = this.format(this.today0, 2)
      this.today1 = this.format(this.today1, 2)
      this.today2 = this.format(this.today2, 2)
      this.todayE = null
      if (k === 0) {
        this.todayE = this.today0
      } else if (k === 1) {
        this.todayE = this.today1
      } else if (k === 2) {
        this.todayE = this.today2
      } else if (k === 3) {
        date2 = new Date(date.getTime() - 24 * 60 * 60 * 1000)
        date3 = new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000)
        this.todayE = []
        this.todayE[0] = this.today0
        this.todayE[1] = this.today1
        this.todayE[2] = this.today2
      }
      this.stTime = this.format(date2, 1)
      this.edTime = this.format(date3, 1)
      console.log(this.stTime)
      console.log(this.edTime)
      console.log(k)
      this.getData()
    },
    format (date, p) {
      var year = date.getYear() + 1900
      var month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      var day = date.getDate()
      if (day < 10) {
        day = '0' + day
      }
      if (p === 1) {
        return year + '-' + month + '-' + day
      } else {
        return month + '-' + day
      }
    },
    changeSzyb (k) {
      if (k === 0) {
        this.szyb = 'hl'
      } else if (k === 1) {
        this.szyb = 'hw'
      } else if (k === 2) {
        this.szyb = 'cx'
      }
    },
    getData () {
      // let _this=this
      let item = this.myChart
      if (this.szyb === 'hl') {
        this.jk = '/thirdparty/tpdata/cellHaiLang.do'
      } else if (this.szyb === 'hw') {
        this.jk = '/thirdparty/tpdata/cellShuiWen.do'
      } else if (this.szyb === 'cx') {
        this.jk = '/thirdparty/tpdata/cellChaoWei.do'
      }
      console.log(this.szyb)
      axios({
        url: moren + this.jk,
        methods: 'get',
        params: {
          startTime: this.stTime + ' 23:59:59',
          endTime: this.edTime + ' 00:00:00',
          stcd: this.stcd,
          type: '0'
        }
      }).then(res => {
        this.yuanShi = res.data.data,
        axios({
          url: moren + this.jk,
          methods: 'get',
          params: {
            startTime: this.stTime + ' 23:59:59',
            endTime: this.edTime + ' 00:00:00',
            stcd: this.stcd,
            type: '1'
          }

        }).then(res1 => {
          console.log(res1.data.data)
          this.data_a = []
          for (var i = 0; i < res1.data.data.length; i++) {
            this.data_a[i] = []
            this.data_a[i][0] = i
            if (this.szyb === 'hl') {
              this.data_a[i][1] = eval(res1.data.data[i].bg)
            } else if (this.szyb === 'hw') {
              this.data_a[i][1] = eval(res1.data.data[i].temperature)
            } else if (this.szyb === 'cx') {
              this.data_a[i][1] = eval(res1.data.data[i].cw)
            }
          }
          this.drawLine()
        })

        let _this = this
        // console.log(this.yuanShi)
      })
    },
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length

      let uInt8Array = new Uint8Array(rawLength)

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    },
    cancell () {
      this.data_a = this.data_b
      this.drawLine()
    },
    saveAsImage () {
      let content = this.myChart.getDataURL()

      let aLink = document.createElement('a')
      let blob = this.base64ToBlob(content)

      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)
      aLink.download = 'line.png'
      aLink.href = URL.createObjectURL(blob)
      aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    },
    submit () {
      var jarr = []
      var json1
      if (this.szyb === 'hl') {
        this.jk = '/thirdparty/tpdata/correctHaiLang.do'
        for (var i = 0; i < this.yuanShi.length; i++) {
          json1 = {
            tm: this.yuanShi[i].tm,
            zq: this.yuanShi[i].zq,
            lx: this.yuanShi[i].lx,
            bg: parseInt(this.data_a[i][1] * 100) / 100,
            stcd: this.yuanShi[i].stcd,
            type: '1'
          }
          jarr.push(json1)
        }
      } else if (this.szyb === 'hw') {
        this.jk = '/thirdparty/tpdata/correctShuiWen.do'
        for (var i = 0; i < this.yuanShi.length; i++) {
          json1 = {
            tm: this.yuanShi[i].tm,
            zq: this.yuanShi[i].zq,
            lx: this.yuanShi[i].lx,
            temperature: parseInt(this.data_a[i][1] * 10) / 10,
            stcd: this.yuanShi[i].stcd,
            type: '1'
          }
          jarr.push(json1)
        }
      } else if (this.szyb === 'cx') {
        this.jk = '/thirdparty/tpdata/correctChaoWei.do'
        for (var i = 0; i < this.yuanShi.length; i++) {
          json1 = {
            tm: this.yuanShi[i].tm,
            zq: this.yuanShi[i].zq,
            lx: this.yuanShi[i].lx,
            cw: parseInt(this.data_a[i][1] * 100) / 100,
            stcd: this.yuanShi[i].stcd,
            type: '1'
          }
          jarr.push(json1)
        }
      }
      console.log(JSON.stringify(jarr))
      // console.log(this.yuanShi[0].tm)
      axios({
        url: moren + this.jk,
        methods: 'get',
        params: {data: JSON.stringify(jarr)}
      }).then(res2 => {
        // console.log(res2)
        // console.log(res2.data.num)
        if (res2.data.num !== 0) {
          alert('保存成功！')
        } else {
          alert('保存失败！')
        }
      })
    }
  }
}
</script>
