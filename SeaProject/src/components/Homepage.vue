<template>
  <div class="main">
    <div class="header">
      <p>国家海洋局温州海洋环境监测中心站</p>
    </div>
    <div class="chart" v-if="isshowchart" ref="son"><button class="aui_close" @click="showchart">×</button><chart1/></div>
    <div class="img" v-if="isshow">
      <button class="aui_close" @click="imgclose">×</button>
      <div class="img_container" v-if="imgtype==='kr'||imgtype==='jpnqy'">
        <img :src="imgurl"/>
        <ul class="btn_menu">
          <li>
            <button class="btn" @click="hanguoimg(3)">地面</button>
          </li>
          <li>
            <button class="btn" @click="hanguoimg(2)">气压500</button>
          </li>
          <li>
            <button class="btn" @click="hanguoimg(1)">气压700</button>
          </li>
          <li>
            <button class="btn" @click="hanguoimg(0)">气压800</button>
          </li>
        </ul>
      </div>
      <div class="img_container" v-if="imgtype==='jpnbl'||imgtype==='cnhailang'||imgtype==='jpn'||imgtype==='twyb'||imgtype==='jpncloud'">
        <img :src="imgurl"/>
        <ul class="btn_menu">
          <li>
            <button class="btn" @click="">动态播放</button>
          </li>
        </ul>
      </div>
      <div class="img_container" v-if="imgtype==='cnwave'">
        <img :src="imgurl"/>
      </div>
      <div class="img_container" v-if="imgtype===3">
        <img :src="imgurl"/>
        <p>韩国天气图</p>
        <button class="btn" @click="hanguoimg(0)">地面</button>
        <button class="btn" @click="hanguoimg(1)">气压500</button>
        <button class="btn" @click="hanguoimg(2)">气压700</button>
        <button class="btn" @click="hanguoimg(3)">气压800</button>
      </div>
    </div>
    <AMap class="map" ref="amap"/>
    <div class="l_part">
      <ul class="fri">
        <li>实况数据
          <div class="sec">
            <ul>
              <li @click="getimgurl('kr', 0)">韩国天气图</li>
              <li @click="getimgurl('jpnqy', 0)">日本天气图</li>
              <li @click="getimgurl('jpncloud', 0)">日本云图</li>
              <li @click="yuntu">云图</li>
              <li @click="radar">雷达图</li>
            </ul>
          </div>
        </li>
        <li>预报数据
          <div class="sec">
            <ul>
              <!--<li @click="showimg('', 0)">韩国天气图</li>-->
              <li @click="getimgurl('jpnbl', 1)">日本波浪图</li>
              <li @click="getimgurl('cnhailang', 1)">国家波浪图</li>
            </ul>
          </div>
        </li>
        <li>周会商
          <div class="sec">
            <ul>
              <li @click="getimgurl('twyb', 0)">台湾天气图</li>
              <li @click="getimgurl('jpnqy', 0)">日本天气图</li>
              <li>欧洲中心</li>
            </ul>
          </div>
        </li>
        <li>灾害警报
          <div class="sec">
            <ul>
              <li @click="getimgurl('cnwave', 1)">国家波浪遥感图</li>
              <li @click="getimgurl('', 1)">国家海浪图</li>
              <li @click="getimgurl('', 1)">国家水温图</li>
              <li @click="getimgurl('jpn', 1)">日本海浪图</li>
            </ul>
          </div>
        </li>
        <li>台风路径</li>
        <li @click="showchart">近岸单元格数值预报
          <div class="sec">
            <ul>
              <li>海浪预报
                <!--<div class="sec2">-->
                  <!--<ul>-->
                    <!--<li @click="newline('E52')">乐清湾</li>-->
                    <!--<li @click="newline('E53')">瓯江口海域</li>-->
                    <!--<li @click="newline('E54')">洞头岛以东海域</li>-->
                    <!--<li @click="newline('E55')">瑞安近岸海域</li>-->
                    <!--<li @click="newline('E56')">平阳近岸海域</li>-->
                    <!--<li @click="newline('E57')">苍南近岸海域</li>-->
                    <!--<li @click="newline('E58')">南麂岛海域</li>-->
                    <!--<li @click="newline('E59')">北麂岛海域</li>-->
                  <!--</ul>-->
                <!--</div>-->
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <!--<div class="r_part">-->
      <!--<ul>-->

        <!--<li>-->
          <!--<img :src="japanurl"/>-->
          <!--<p>日本海浪图</p>-->
          <!--<button @click="japanimg(0)">1号</button>-->
          <!--<button @click="japanimg(1)">2号</button>-->
          <!--<button @click="japanimg(2)">3号</button>-->
        <!--</li>-->
        <!--<li>-->
          <!--&lt;!&ndash;<chart1/>&ndash;&gt;-->
        <!--</li>-->
      <!--</ul>-->
    <!--</div>-->
  </div>
</template>

<script>
import AMap from './Amap/Amap'
import chart1 from './chart1'
import {request, head} from '../net/request'
export default {
  name: 'Homepage',
  components: {
    AMap,
    chart1
  },
  data () {
    return {
      isshow: false,
      imgtype: 0,
      isshowchart: false,
      imgurl: '',
      japanurl: '',
      hanguo: '',
      japan: '',
      bigimgurl: '',
      jFubiao: '',
      wFubiao: '',
      showimg: '',
      url: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let _this = this
      // request({
      //   url: '/thirdparty/tpdata/krpic.do',
      //   params: {
      //     kind: 0
      //   }
      // }).then(res => {
      //   console.log('获取成功')
      //   _this.hanguo = res.data.data
      //   _this.imgurl = head + res.data.data[0].url
      // }).catch(e => {
      //   console.log('获取失败' + e)
      // })
      // request({
      //   url: '/thirdparty/tpdata/jpnpic.do'
      // }).then(res => {
      //   console.log('获取成功')
      //   _this.japanurl = head + res.data.data[0].pic
      //   _this.japan = res.data.data
      // }).catch(e => {
      //   console.log('获取失败' + e)
      // })
    },
    hanguoimg (flag) {
      this.imgurl = head + this.url.data[flag].url
    },
    getimgurl (type, kind) {
      if (type === 'jpn') {
        request({
          url: '/thirdparty/tpdata/getPic.do',
          params: {
            type: type,
            kind: kind,
            stcd: 'jp01'
          }
        }).then(res => {
          this.showimage(type, res)
        }).catch(e => {
          console.log('图片获取失败' + e)
        })
      } else {
        request({
          url: '/thirdparty/tpdata/getPic.do',
          params: {
            type: type,
            kind: kind
          }
        }).then(res => {
          this.showimage(type, res)
        }).catch(e => {
          console.log('图片获取失败' + e)
        })
      }

    },
    showimage (type, res) {
      this.isshow = !this.isshow
      this.imgtype = type
      this.imgurl = head + res.data.data[0].url
      this.url = res.data
    },
    // typhoon () {
    //
    // }
    showchart () {
      this.isshowchart = !this.isshowchart
    },
    yuntu () {
      this.$refs['amap'].showyun()
    },
    radar () {
      this.$refs['amap'].showrader()
    },
    show (flag) {
      this.isshow = !this.isshow
      this.imgtype = flag
    },
    imgclose () {
      this.isshow = !this.isshow
    },
    newline (flag) {
      this.$refs.son.stcd = 'E53'
      console.log('done')
      this.$refs['son'].drawLine()
    }
  }
}
</script>

<style scoped>
  ul {
    list-style-type: none;
  }
.main {
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.header {
  width: 84%;
  font-size: 2rem;
  position: absolute;
  right: 10px;
  z-index: 99;
  text-align: left;
  padding: 0.8rem 1.3rem;
  border: 1px solid #345eb0;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  color: #fff;
  background-color: rgba(0,0,0,0.4);
}
.l_part {
  width: 12%;
  height: 100%;
  padding-top: 230px;
  background-color: rgba(0,0,0,0.8);
  position: absolute;
  z-index: 9;
  top: 0;
}
.l_part ul {
  width: 100%;
}
.l_part ul li {
  border-top: 0.6px solid #345eb0;
  padding: 0.8rem 20px;
  color: #fff;
  font-size: 1.2rem;
  position: relative;
}
.l_part ul li:hover {
  background-color: rgba(255,255,255,0.4);
}
.r_part {
  margin-right: 10px;
  width: 15%;
  position: absolute;
  z-index: 9;
  /*float: right;*/
  top: 80px;
  right: 0;
}
.r_part ul {
  width: 100%;
}
.r_part ul li {
  width: 100%;
  border: 1px solid #345eb0;
  color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}
.r_part ul li img {
  width: 100%;
}
.chart, .img {
  width: 100%;
  height: 100vh;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
}
  .aui_close {
    width: 20px;
    height: 20px;
    z-index: 1000;
    line-height: 20px;
    display: block;
    position: absolute;
    left:10px;
    top:10px;
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
    left:8px;
    top:8px;
    color: #FFF;
    box-shadow: 0 1px 3px rgba(209, 40, 42, .5);
    background: #d1282a;
    border-radius: 24px;
    transition: all 0.2s ease-out;
    opacity: 0.8;
  }
  .fri li:hover .sec {
    display: block;
  }
  .sec {
    display: none;
    width: 100%;
    position: absolute;
    left: 100%;
    top: 0;
    padding-left: 10px;
  }
  .sec ul {
    border: 1px solid #345eb0;
    border-radius: 8px;
  }
  .sec ul li:first-child {
    border-top: 0;
  }
  .sec ul li:hover {
    background-color: rgba(255,255,255,0.4);
  }
  .img {
    background-color: rgba(255,255,255,0.6);
  }
  .img_container img{
    width: 85%;
    height: 100%;
    position: absolute;
    right: 0;
  }
  .btn_menu {
    margin-left: 2rem;
  }
  .btn_menu li {
    padding: 1rem 0;
  }
  .btn {
    padding: 1rem 1.5rem;
    border: 1px solid #345eb0;
    background-color: deepskyblue;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
  }
  .sec ul li:hover .sec2 {
    display: block;
  }
  .sec2 {
    display: none;
    width: 100%;
    position: absolute;
    left: 100%;
    bottom: 0;
    padding-left: 10px;
  }
  .sec2 ul {
    border: 1px solid #345eb0;
    border-radius: 8px;
  }
  .sec2 ul li:first-child {
    border-top: 0;
  }
  .sec2 ul li:hover {
    background-color: rgba(255,255,255,0.4);
  }
</style>
