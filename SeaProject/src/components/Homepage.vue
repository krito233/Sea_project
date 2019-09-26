<template>
  <div class="main">
    <div class="header">
      <p>国家海洋局温州海洋环境监测中心站</p>
    </div>
    <AMap class="map"/>
    <div class="l_part">
      <ul>
        <li>实况天气图</li>
        <li>实况数据</li>
        <li>预报数据</li>
        <li>周会商</li>
        <li>灾害警报</li>
        <li>台风路径</li>
      </ul>
    </div>
    <div class="r_part">
      <ul>
        <li>
          <img :src="imgurl"/>
          <p>韩国天气图</p>
          <button @click="hanguoimg(0)">地面</button>
          <button @click="hanguoimg(1)">气压500</button>
          <button @click="hanguoimg(2)">气压700</button>
          <button @click="hanguoimg(3)">气压800</button>
        </li>
        <li>
          <img :src="japanurl"/>
          <p>日本海浪图</p>
          <button @click="japanimg(0)">1号</button>
          <button @click="japanimg(1)">2号</button>
          <button @click="japanimg(2)">3号</button>
        </li>
        <li>
          <img :src="imgurl"/>
          <p>韩国天气图</p>
          <button>地面</button>
          <button>气压500</button>
          <button>气压700</button>
          <button>气压800</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AMap from './Amap/Amap'
import {request, head} from '../net/request'
export default {
  name: 'Homepage',
  components: {
    AMap
  },
  data () {
    return {
      imgurl: '',
      japanurl: '',
      hanguo: '',
      japan: '',
      bigimgurl: '',
      jFubiao: '',
      wFubiao: '',
      showimg: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let _this = this
      request({
        url: '/thirdparty/tpdata/krpic.do',
        params: {
          kind: 0
        }
      }).then(res => {
        console.log('获取成功')
        _this.hanguo = res.data.data
        _this.imgurl = head + res.data.data[0].url
      }).catch(e => {
        console.log('获取失败' + e)
      })
      request({
        url: '/thirdparty/tpdata/jpnpic.do'
      }).then(res => {
        console.log('获取成功')
        _this.japanurl = head + res.data.data[0].pic
        _this.japan = res.data.data
      }).catch(e => {
        console.log('获取失败' + e)
      })
    },
    hanguoimg (flag) {
      // request({
      //   url: '',
      //   params: {
      //     kind: 0
      //   }
      // }).then(res => {
      //     this.hanguo = res.data
      // })
      this.imgurl = head + this.hanguo[flag].url
    },
    japanimg (flag) {
      this.japanurl = head + this.japan[flag].pic
    },
    // typhoon () {
    //
    // }
    // showimg (flag) {
    //
    // }
    showjhubiao () {
      request({
        url: ''
      }).then(res => {
        console.log('获取成功')

      })
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

</style>
