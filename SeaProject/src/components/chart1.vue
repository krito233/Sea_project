<template>
  <div style="width: 100%;max-height: 70vh;text-align: center">
    <div id="container" :style = "{width: '80%', height: '70vh',margin: '2rem auto'}"></div>
    <ul class="menu">
      <li @click="setstcd('E52')">乐清湾</li>
      <li @click="setstcd('E53')">瓯江口海域</li>
      <li @click="setstcd('E54')">洞头岛以东海域</li>
      <li @click="setstcd('E55')">瑞安近岸海域</li>
      <li @click="setstcd('E56')">平阳近岸海域</li>
      <li @click="setstcd('E57')">苍南近岸海域</li>
      <li @click="setstcd('E58')">南麂岛海域</li>
      <li @click="setstcd('E59')">北麂岛海域</li>
    </ul>
    <button class="bn" @click="dataChange(0)">今天</button>
    <button class="bn" @click="dataChange(1)">明天</button>
    <button class="bn" @click="dataChange(2)">后天</button>
    <button class="bn" @click="submit()">提交调整</button>
    <button class="bn" @click="tiptip=1">单点调整</button>
    <button class="bn" @click="tiptip=2">三点调整</button>
    <button class="bn" @click="tiptip=3">整体调整</button>
  </div>
</template>
<style>
  ul {
    list-style-type: none;
  }
  .menu {
    width: 20%;
    position: absolute;
    top: 50px;
    left: 10px;
  }
  .menu li {
    color: #000;
    width: 8rem;
    text-align: center;
    margin-top: 1rem;
    padding: 1rem 1rem;
    border: 1px solid #345eb0;
    border-radius: 8px;
    background-color: #999999;
  }
  .bn {
    border: 1px solid #345eb0;
    border-radius: 8px;
    padding: 1rem 1rem;
    background-color: #999999;
    color: #000;
  }
</style>
<script  type="text/ecmascript-6">
import echarts from 'echarts'
import axios from 'axios'
// var tiptip = 1
var moren = 'http://test.qdwanzhong.top'
var stTime
var edTime

export default {
  name: 'chart1',
  data () {
    // this.dataChange(0)
    return {
      symbolSize: '20',
      tiptip: 1,
      stTime: stTime,
      edTime: edTime,
      stcd: 'E52',
      dom: '',
      myChart: '',
      xiuZheng: '',
      yuanShi: '',
      data_a: [[]],
      data_b: [[]]
    }
  },
  component: {
    echarts
  },
  mounted () {
    // this.dom =
    this.myChart = echarts.init(document.getElementById('container'))
    this.dataChange(0)
    this.getData()
    // console.log(this.ddd)
  },
  methods: {
    setstcd (stcd) {
      this.stcd = stcd
      // console.log('done')
      this.drawLine()
    },
    drawLine () {
      let _this =this
      // this.dom = document.getElementById("container")
      /// this.myChart = echarts.init(this.dom)
      var app = {}
      var symbolSize = 20
      var tim = new Array()
      var yuanShi = this.yuanShi
      // var data_orig = new Array();
      let this_ = this
      this.myChart.setOption({
        textStyle: {
          color: 'rgba(96,232,255,1)'
        },
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(11,28,48,0.8)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(36,70,160,0.8)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        },
        title: {
          text: '海浪潮高度',
          textStyle: {
            color: 'rgba(241,251,255,1)'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var dataIndex = params.dataIndex
            return '时间: ' + params[0].axisValue + '<br>数值: ' + parseInt(params[0].value[1] * 100) / 100 + '米'
          }
        },
        legend: {
          data: ['预测波浪值修正版', '预测波浪值实测版'],
          textStyle: {
            color: 'white'
          }
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data:
              (function () {
                // console.log(this_.yuanShi)
                for (var i = 0; i <= 23; i++) {
                  var s = new Date(this_.yuanShi[i].tm)
                  tim[i] = s.getMonth() + '-' + s.getDate() + '\n' + s.getHours() + ':00'
                }
                return tim
              })()
        },
        yAxis: {
          type: 'value',
          axisLine: {onZero: false},
          minInterval: 0.01
        },
        dataZoom: [
          // {
          //   type: 'slider',
          //   xAxisIndex: 0,
          //   filterMode: 'empty',
          //   backgroundColor: 'rgba(0,0,0,0.4)',
          //   borderColor: 'rgba(0,0,0,0)',
          //   handleStyle: {
          //
          //   }
          // },
          // {
          //   type: 'slider',
          //   yAxisIndex: 0,
          //   filterMode: 'empty'
          // },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty'
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
        series: [
          {
            id: 'a',
            type: 'line',
            smooth: true,
            name: '预测波浪值修正版',
            symbol: 'circle',
            symbolSize: 5,
            itemStyle: {
              normal: {
                color: 'rgba(96,212,255,1)',
                lineStyle: {
                  color: 'rgba(96,212,255,1)'
                }
              }
            },
            data: this.data_a
          },
          {
            id: 'b',
            type: 'line',
            smooth: true,
            name: '预测波浪值实测版',
            symbol: 'circle',
            symbolSize: 5,
            itemStyle: {
              normal: {
                color: 'rgba(21,29,68,0.5)',
                lineStyle: {
                  color: 'rgba(21,29,68,0.5)'
                }
              }
            },
            data:
                (function () {
                  for (var i = 0; i <= 23; i++) {
                    this_.data_b[i] = []
                    this_.data_b[i][0] = i
                    this_.data_b[i][1] = eval(yuanShi[i].bg)
                  }
                  return this_.data_b
                })()

          }
        ],
        toolbox: {
          feature: {
            saveAsImage: {
              type: 'png',
              name: '19日海浪图',
              title: '保存为图片',
              icon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z'
            }
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
        }, 0)

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
          for (var i = 23; i >= 0; i--) {
            if ((this_.data_a[i][0] >= xs && this_.data_a[i][0] <= xe && this_.data_a[i][1] >= ys && this_.data_a[i][1] <= ye) || xs == undefined) {
              this_.data_a[i][1] = this_.data_a[i][1] + this_.myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy
            }
          }
          // Update data
        } else if (_this.tiptip === 2) {
          this_.data_a[dataIndex][1] = this_.data_a[dataIndex][1] + this_.myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy
          if (dataIndex > 0 && dataIndex < 23) {
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
      var date = new Date()
      var date2 = new Date(date.getTime() + (k - 1) * 24 * 60 * 60 * 1000)
      var date3 = new Date(date.getTime() + (k + 1) * 24 * 60 * 60 * 1000)
      stTime = this.format(date2)
      edTime = this.format(date3)
      console.log(stTime)
      console.log(edTime)
      console.log(k)
      this.getData()
    },
    format (date) {
      var year = date.getYear() + 1900
      var month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      var day = date.getDate()
      if (day < 10) {
        day = '0' + day
      }
      return year + '-' + month + '-' + day
    },
    getData () {
      // let _this=this
      let item = this.myChart
      // console.log(this.myChart)
      axios({
        url: moren + '/thirdparty/tpdata/cellHaiLang.do',
        methods: 'get',
        params: {
          startTime: stTime + ' 23:59:59',
          endTime: edTime + ' 00:00:00',
          stcd: this.stcd,
          type: '0'
        }
      }).then(res => {
        this.yuanShi = res.data.data,
        axios({
          url: moren + '/thirdparty/tpdata/cellHaiLang.do',
          methods: 'get',
          params: {
            startTime: stTime + ' 23:59:59',
            endTime: edTime + ' 00:00:00',
            stcd: this.stcd,
            type: '1'
          }
        }).then(res1 => {
          // console.log(res1)
          if (res1.data.data == '') {
            for (var i = 0; i <= 23; i++) {
              this.data_a[i] = []
              this.data_a[i][0] = i
              this.data_a[i][1] = eval(res.data.data[i].bg)
            }
          } else {
            for (var i = 0; i <= 23; i++) {
              this.data_a[i] = []
              this.data_a[i][0] = i
              this.data_a[i][1] = eval(res1.data.data[i].bg)
            }
            // console.log(this.data_a)
            // console.log('111')

            // console.log(this.data_a)
          }
          this.drawLine()
        })

        let _this = this
        // console.log(this.yuanShi)
      })
    },
    submit () {
      var jarr = []
      for (var i = 0; i <= 23; i++) {
        var json1 = {
          tm: this.yuanShi[i].tm,
          zq: this.yuanShi[i].zq,
          lx: this.yuanShi[i].lx,
          bg: parseInt(this.data_a[i][1] * 100) / 100,
          stcd: this.yuanShi[i].stcd,
          type: '1'
        }
        jarr.push(json1)
      }
      console.log(JSON.stringify(jarr))
      // console.log(this.yuanShi[0].tm)
      axios({
        url: moren + '/thirdparty/tpdata/correctHaiLang.do',
        methods: 'get',
        params: {data: JSON.stringify(jarr)}
      }).then(res2 => {
        // console.log(res2)
        // console.log(res2.data.num)
        if (res2.data.num != 0) {
          alert('保存成功！')
        } else {
          alert('保存失败！')
        }
      })
    }
  }
}
</script>
