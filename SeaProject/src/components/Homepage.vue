<template>
  <div class="main">
    <div class="header">
      <p>温州海洋环境监测中心站</p>
    </div>
    <div class="chart" v-if="isshowchart" ref="son">
      <button class="aui_close" @click="showchart">×</button>
      <!--<p>海浪预报</p>-->
      <chart1 class="cha"/>
    </div>
    <div class="img" v-if="isshow">
      <button class="aui_close" @click="imgclose">×</button>
      <!--<div class="img_container" v-if="imgtype==='kr'||imgtype==='jpnqy'">-->
        <!--<p v-if="imgtype==='kr'">韩国天气图</p>-->
        <!--<p v-if="imgtype==='jpnqy'">日本天气图</p>-->
        <!--<img :src="imgurl" id="winimg"/>-->
        <!--<ul class="btn_menu">-->
          <!--<li>-->
            <!--<button class="btn" @click="hanguoimg(3)">地面</button>-->
          <!--</li>-->
          <!--<li>-->
            <!--<button class="btn" @click="hanguoimg(2)">气压500</button>-->
          <!--</li>-->
          <!--<li>-->
            <!--<button class="btn" @click="hanguoimg(1)">气压700</button>-->
          <!--</li>-->
          <!--<li>-->
            <!--<button class="btn" @click="hanguoimg(0)">气压800</button>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--<div class="img_container" v-if="imgtype==='jpnbl'||imgtype==='cnhailang'||imgtype==='jpn'||imgtype==='twyb'||imgtype==='jpncloud'">-->
        <div class="img_container" v-if="isshow">
        <p v-if="imgtype==='kr'">韩国天气图</p>
        <p v-if="imgtype==='jpnqy'">日本天气图</p>
        <p v-if="imgtype==='jpncloud'">日本云图</p>
        <p v-if="imgtype==='jpnbl'">日本波浪图</p>
        <p v-if="imgtype==='cnhailang'">国家波浪图</p>
        <p v-if="imgtype==='twyb'">台湾天气图</p>
        <!--<p v-if="imgtype==='kr'">日本天气图</p>-->
        <!--<p v-if="imgtype==='kr'">国家海浪图</p>-->
        <!--<p v-if="imgtype==='kr'">国家水温图</p>-->
        <p v-if="imgtype==='jpn'">日本海浪图</p>
        <p v-if="imgtype==='cnwave'">国家波浪遥感图</p>
        <!--<p v-if="imgtype==='kr'"></p>-->
        <!--<p v-if="imgtype==='kr'">国家波浪遥感图</p>-->
        <!--<p v-if="imgtype==='kr'">国家波浪遥感图</p>-->
        <img :src="imgurl"/>
        <ul class="btn_menu">
          <li>
            <button class="btn" @click="startimg">开始播放</button>
            <input id="speed"/>秒
            <button class="btn" @click="changespeed">改变速度</button>
            <button class="btn" @click="cleanpic">结束播放</button>
          </li>
        </ul>
      </div>
      <!--<div class="img_container" v-if="imgtype==='cnwave'">-->
        <!--<img :src="imgurl"/>-->
      <!--</div>-->
      <!--<div class="img_container" v-if="imgtype===3">-->
        <!--<img :src="imgurl"/>-->
        <!--<p>韩国天气图</p>-->
        <!--<button class="btn" @click="hanguoimg(0)">地面</button>-->
        <!--<button class="btn" @click="hanguoimg(1)">气压500</button>-->
        <!--<button class="btn" @click="hanguoimg(2)">气压700</button>-->
        <!--<button class="btn" @click="hanguoimg(3)">气压800</button>-->
      <!--</div>-->
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
        <!--<li @click="typhoon(201918)">台风路径</li>-->
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
    <div class="r_part">
      <ul>
        <li>
          <img :src="hanguourl"/>
          <div class="footer">
            <p style="margin-left: 10px;width: 70%;">韩国天气图</p>
            <p @click="getimgurl('kr', 0)" style="text-align: right;width: 25%;">放大></p>
          </div>
        </li>
        <li>
          <img :src="japanurl"/>
          <div class="footer">
            <p style="margin-left: 10px;width: 70%;">日本海浪图</p>
            <p @click="getimgurl('jpn', 1)" style="text-align: right;width: 25%;">放大></p>
          </div>
        </li>
        <li>
          <img :src="cnurl"/>
          <div class="footer">
            <p style="margin-left: 10px;width: 70%;">国家波浪图</p>
            <p @click="getimgurl('cnhailang', 1)" style="text-align: right;width: 25%;">放大></p>
          </div>
        </li>
      </ul>
    </div>
    <div class="tf" style="position: absolute;top: 90px;right: 23%;z-index: 9;">
      <a>台风路径</a>
      <ul class="tf_list">
        <li v-for="(ty, i) in tylist" @click="typhoon(ty.tfbh)">{{ty.name}}</li>
      </ul>
    </div>
    <!--<Dropdown style="margin-left: 20px">-->
      <!--<i-button type="primary">-->
        <!--下拉菜单-->
        <!--<Icon type="arrow-down-b"></Icon>-->
      <!--</i-button>-->
      <!--<Dropdown-menu slot="list">-->
        <!--<Dropdown-item>驴打滚</Dropdown-item>-->
        <!--<Dropdown-item>炸酱面</Dropdown-item>-->
        <!--<Dropdown-item disabled>豆汁儿</Dropdown-item>-->
        <!--<Dropdown-item>冰糖葫芦</Dropdown-item>-->
        <!--<Dropdown-item divided>北京烤鸭</Dropdown-item>-->
      <!--</Dropdown-menu>-->
    <!--</Dropdown>-->
  </div>
</template>

<script>
import AMap from './Amap/Amap'
import chart1 from './chart1'
import {request, head} from '../net/request'
import Dropdown from 'iview/src/components/dropdown'
export default {
  name: 'Homepage',
  components: {
    AMap,
    chart1,
    Dropdown
  },
  data () {
    return {
      isshow: false,
      imgtype: 0,
      isshowchart: false,
      imgurl: '',
      japanurl: '',
      hanguourl: '',
      cnurl: '',
      japan: '',
      bigimgurl: '',
      jFubiao: '',
      wFubiao: '',
      showimg: '',
      urllist: [],
      num: 0,
      speed: 2000,
      t: null,
      tylist: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      request({
        url: '/thirdparty/tpdata/getPic.do',
        params: {
          type: 'kr',
          kind: 0
        }
      }).then(res => {
        console.log('获取成功')
        this.hanguourl = head + res.data.data[0].url
      }).catch(e => {
        console.log('获取失败' + e)
      })
      request({
        url: '/thirdparty/tpdata/getPic.do',
        params: {
          type: 'jpn',
          kind: 1
        }
      }).then(res => {
        console.log('获取成功')
        this.japanurl = head + res.data.data[0].url
      }).catch(e => {
        console.log('获取失败' + e)
      })
      request({
        url: '/thirdparty/tpdata/getPic.do',
        params: {
          type: 'cnhailang',
          kind: 1
        }
      }).then(res => {
        console.log('获取成功')
        this.cnurl = head + res.data.data[0].url
      }).catch(e => {
        console.log('获取失败' + e)
      })
      this.$axios.get('http://www.wztf121.com/data/complex/path.json').then(res => {
        this.tylist = res.data
      }).catch(e => {
        console.log('获取失败' + e)
      })
    },
    hanguoimg (flag) {
      this.imgurl = head + this.urllist.data[flag].url
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
          // this.urllist = res.data
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
          // this.urllist = res.data
          this.showimage(type, res)
        }).catch(e => {
          console.log('图片获取失败' + e)
        })
      }
    },
    showimage (type, res) {
      this.urllist = []
      this.isshow = !this.isshow
      this.imgtype = type
      this.imgurl = head + res.data.data[0].url
      this.urllist = res.data
    },
    typhoon (tfbh) {
      // alert('功能开发中，敬请期待！')
      this.$refs['amap'].typhoon(tfbh)
    },
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
      this.num = 0
      this.speed = 2000
      this.t = null
    },
    startimg () {
      this.changepic(this.num)
    },
    changepic (i) {
      this.imgurl = head + this.urllist.data[i].url
      // console.log(this.urllist.data.length)
      // console.log(this.urllist.data)
      // console.log(i)
      // console.log(this.imgurl)
      this.num = i + 1
      if (this.num === this.urllist.data.length) {
        this.num = 0
      }
      this.t = setTimeout(() => {
        this.changepic(this.num)
      }, this.speed)
    },
    changespeed () {
      let s = document.getElementById('speed').value
      this.speed = parseFloat(s) * 1000
      clearTimeout(this.t)
      this.t = null
      this.num = this.num - 1
      if (this.num < 0) {
        this.num = 0
      }
      this.changepic(this.num)
    },
    cleanpic () {
      clearTimeout(this.t)
      this.t = null
    }
  }
}
</script>

<style scoped>
  ul {
    list-style-type: none;
  }
  input {
    width: 3rem;
    height: 40px;
    border: 1px solid #999999;
    border-radius: 4px;
    font-size: 1.3rem;
    text-align: right;
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
  background: -webkit-linear-gradient(left, #6cafe8, #6d37a4); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #6cafe8, #6d37a4); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #6cafe8, #6d37a4); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #6cafe8, #6d37a4);
}
.l_part {
  width: 12%;
  height: 100%;
  /*padding-top: 230px;*/
  margin-left: -10px;
  /*line-height: 100px;*/
  padding-top: 5vh;
  padding-bottom: 5vh;
  background: -webkit-linear-gradient(#6cafe8, #6d37a4);
  background: -o-linear-gradient(#6cafe8, #6d37a4);
  background: -moz-linear-gradient(#6cafe8, #6d37a4);
  background: linear-gradient(#6cafe8, #6d37a4);
  position: absolute;
  z-index: 9;
  top: 0;
  border-radius: 8px;
}
.l_part ul {
  box-sizing: border-box;
  /*display: -webkit-flex;*/
  /*display: flex;*/
  /*-webkit-align-items: center;*/
  /*align-items: center;*/
  /*-webkit-justify-content: center;*/
  /*justify-content: center;*/
  /*flex-wrap: wrap;*/
  width: 100%;
  height: 90vh;
  margin-left: -10px;
  border: 2px solid #fff;
  border-radius: 8px;
  padding-top: 140px;
}
.l_part ul li {
  padding: 0.8rem 40px;
  color: #fff;
  font-size: 1.2rem;
  position: relative;
}
.l_part ul li:hover {
  background-color: rgba(255,255,255,0.4);
  border-left: 22px solid #00bfff;
  border-radius: 8px;
}
.r_part {
  margin-right: 10px;
  width: 20%;
  position: absolute;
  z-index: 9;
  top: 80px;
  right: 0;
}
.r_part ul {
  width: 100%;
}
.r_part ul li {
  background: -webkit-linear-gradient(right, #6cafe8, #6d37a4); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(left, #6cafe8, #6d37a4); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(left, #6cafe8, #6d37a4); /* Firefox 3.6 - 15 */
  background: linear-gradient(to left, #6cafe8, #6d37a4);
  width: 100%;
  max-height: 30vh;
  border: 1px solid #345eb0;
  color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
}
.r_part ul li img {
  width: 100%;
  max-height: 25vh;
}
.tf a {
  color: #fff;
  background-color: #6cafe8;
  border-radius: 4px;
  border: 1px solid #000;
  padding: 0.6rem;
}
.tf:hover .tf_list{
  display: block!important;
}
.tf_list {
  display: none;
  color: #fff;
  background-color: #6cafe8;
  padding-top: 10px;
}
.tf_list li {
  font-size: 1rem;
  padding: 0.2rem 0.6rem;
}
.tf_list li:hover {
  background-color: rgba(0,0,0,0.2);
}
.footer {
  display: flex;
}
.chart, .img {
  width: 100%;
  height: 100vh;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: #e7e6e6;
}
.cha {
  width: 70%;
  max-height: 70vh;
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
    width: 110%;
    position: absolute;
    left: 100%;
    top: 0;
    padding-left: 20px;
  }
  .sec ul {
    font-size: 0.8rem;
    padding: 0;
    height: auto;
    border: 1px solid #345eb0;
    border-radius: 8px;
    background: -webkit-linear-gradient(#6cafe8, #6d37a4);
    background: -o-linear-gradient(#6cafe8, #6d37a4);
    background: -moz-linear-gradient(#6cafe8, #6d37a4);
    background: linear-gradient(#6cafe8, #6d37a4);
  }
  .sec ul li {
    padding: 10px 15px
  }
  .sec ul li:first-child {
    border-top: 0;
  }
  .sec ul li:hover {
    border-left: 4px solid #00bfff;
  }
  .img {
    background-color: #e7e6e6;
    text-align: center;
    padding: 20px;
  }
  .img p {
    margin-left: 2rem;
    text-align: left;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .img_container img{
    /*text-align: center;*/
    width: 60%;
    max-height: 70vh;
    margin: 0 auto;
  }
  .btn_menu {
    margin-left: 2rem;
  }
  .btn_menu li {
    padding: 1rem 0;
  }
  .btn {
    padding: 0.7rem 1.2rem;
    border: 1px solid #345eb0;
    background-color: #999999;
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
  .typhoon_info{
    box-shadow:3px 3px 2px #888888;
    width:230px;
    height:auto;
    border-radius:10px;
    background-color:#ffffff;

  }
  .typhoon_info>.head{
    padding:8px 0px 8px 0px;border-top-right-radius:10px;border-top-left-radius:10px;background-color:#AADAFF;color:#333333;width:100%;font-size:15px;text-align:center;
  }
  .typhoon_info>div{
    padding:5px 0px 5px 0px;width:100%;
  }
  .typhoon_info>div>p{
    margin:0;
    font-size:13px;
  }
</style>
