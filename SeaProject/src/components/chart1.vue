<template>
  <div style="width: 100%;height: 100vh;background-color: rgba(0,0,0,0.7)">
    <div id="container" :style = "{width: '80%', height: '100%',position: 'absolute',right: '0',top: '0'}"></div>
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
    <!-- <button @click="dataChange(0)">今天</button>
    <button @click="dataChange(1)">明天</button>
    <button @click="dataChange(2)">后天</button> -->
  </div>
</template>
<style scoped>
#container{

}
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
    width: 70%;
    text-align: center;
    margin-top: 1rem;
    padding: 1rem 1rem;
    border: 1px solid #345eb0;
    border-radius: 8px;
    background-color: deepskyblue;

  }
</style>
<script  type="text/ecmascript-6">
import echarts from 'echarts'
import axios from 'axios'
var tiptip = 1
var moren = 'http://test.qdwanzhong.top'
var stTime = '2019-09-24'
var edTime = '2019-09-26'

export default {
  name: 'chart1',
  // props: ['scd'],
  data () {
    this.dataChange(0)
    return {
      symbolSize: '20',
      tiptip: 1,
      stTime: stTime,
      edTime: edTime,
      stcd: 'E52'
    }
  },
  component: {
    echarts
  },
  mounted () {
    this.drawLine()
    // console.log(this.ddd)
  },
  methods: {
    setstcd (stcd) {
      this.stcd = stcd
      // console.log('done')
      this.drawLine()
    },
    drawLine () {
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
        var dom = document.getElementById('container')
        var myChart = echarts.init(dom)
        var app = {}
        var symbolSize = 20
        var data_a = new Array()
        var tim = new Array()
        var data = new Array()
        // var data_orig = new Array();
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
              data_a[i] = new Array()
              data_a[i][0] = i
              data_a[i][1] = eval(res.data.data[i].bg)
            }
          } else {
            for (var i = 0; i <= 23; i++) {
              data_a[i] = new Array()
              data_a[i][0] = i
              data_a[i][1] = eval(res1.data.data[i].bg)
            }
            myChart.setOption({
              series: [{
                id: 'a',
                data: data_a
              }]
            })
            updatePosition()
          }
        })

        myChart.setOption({
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
                  for (var i = 0; i <= 23; i++) {
                    var s = new Date(res.data.data[i].tm)
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
            {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'empty',
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderColor: 'rgba(0,0,0,0)',
              handleStyle: {

              }
            },
            {
              type: 'slider',
              yAxisIndex: 0,
              filterMode: 'empty'
            },
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
              data: data_a
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
                  color: 'rgba(21,29,200,0.8)',
                  lineStyle: {
                    color: 'rgba(21,29,200,0.8)'
                  }
                }
              },
              data:
                    (function () {
                      for (var i = 0; i <= 23; i++) {
                        data[i] = new Array()
                        data[i][0] = i
                        data[i][1] = eval(res.data.data[i].bg)
                      }
                      return data
                    })()
            }
          ],
          toolbox: {
            feature: {
              myTool1: {
                show: true,
                title: '单点调整',
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: function () {
                  tiptip = 1
                }
              },
              myTool2: {
                show: true,
                title: '三点调整',
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: function () {
                  tiptip = 2
                }
              },
              myTool3: {
                show: true,
                title: '视野范围内点调整',
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: function () {
                  tiptip = 3
                }
              },
              myTool4: {
                show: true,
                title: '提交调整',
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: function () {
                  submit()
                }
              },
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
        }, true)

        if (!app.inNode) {
          setTimeout(function () {
            // Add shadow circles (which is not visible) to enable drag.
            myChart.setOption({
              graphic: echarts.util.map(data, function (item, dataIndex) {
                return {
                  type: 'circle',
                  position: myChart.convertToPixel('grid', item),
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

        myChart.on('dataZoom', updatePosition)
        function updatePosition () {
          myChart.setOption({
            graphic: echarts.util.map(data_a, function (item, dataIndex) {
              return {
                position: myChart.convertToPixel('grid', item)
              }
            })
          })
        }

        function showTooltip (dataIndex) {
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: dataIndex
          })
        }

        function hideTooltip (dataIndex) {
          myChart.dispatchAction({
            type: 'hideTip'
          })
        }
        var xs, xe, ys, ye
        myChart.on('datazoom', function (params) {
          var opt = myChart.getOption()
          var dzx = opt.dataZoom[0]
          var dzy = opt.dataZoom[1]
          xs = dzx.startValue
          xe = dzx.endValue
          ys = dzy.startValue
          ye = dzy.endValue
        })
        function onPointDragging (dataIndex, dx, dy) {
          var x_smy = data_a[dataIndex][0], y_smy = data_a[dataIndex][1]
          if (tiptip == 3) {
            for (var i = data_a.length - 1; i >= 0; i--) {
              if ((data_a[i][0] >= xs && data_a[i][0] <= xe && data_a[i][1] >= ys && data_a[i][1] <= ye) || xs == undefined) {
                data_a[i][1] = data_a[i][1] + myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy
              }
            }
            // Update data
          } else if (tiptip == 2) {
            data_a[dataIndex][1] = data_a[dataIndex][1] + myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy
            if (dataIndex > 0 && dataIndex < 23) {
              data_a[dataIndex - 1][1] = data_a[dataIndex - 1][1] + (myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy) * 0.7
              data_a[dataIndex + 1][1] = data_a[dataIndex + 1][1] + (myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy) * 0.7
            }
          } else if (tiptip == 1) {
            data_a[dataIndex][1] = data_a[dataIndex][1] + myChart.convertFromPixel('grid', [0, dx.offsetY])[1] - y_smy
          }
          myChart.setOption({
            series: [{
              id: 'a',
              data: data_a
            }]
          })
          updatePosition()
        }
        if (myChart.option && typeof myChart.option === 'object') {
          myChart.setOption(option, true)
        }

        function submit () {
          var jarr = []
          for (var i = 0; i <= 23; i++) {
            var json1 = {
              tm: res.data.data[i].tm,
              zq: res.data.data[i].zq,
              lx: res.data.data[i].lx,
              bg: parseInt(data_a[i][1] * 100) / 100,
              stcd: res.data.data[i].stcd,
              type: '1'
            }
            jarr.push(json1)
          }
          console.log(JSON.stringify(jarr))
          console.log(data_a[2][1])
          axios({
            url: moren + '/thirdparty/tpdata/correctHaiLang.do',
            methods: 'get',
            params: {data: JSON.stringify(jarr)}
          }).then(res2 => {
            console.log(res2)
            // console.log(res2.data.num)
            if (res2.data.num != 0) {
              alert('保存成功！')
            } else {
              alert('保存失败！')
            }
          })
        }
      })
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
      this.drawLine()
    },
    format (date) {
      var year = date.getYear() + 1900
      var month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      var day = date.getDate()
      if (day < 10) {
        day = '0' + date
      }
      return year + '-' + month + '-' + day
    }
  }
}
</script>
