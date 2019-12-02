<!--<script src="../../build/utils.js"></script>-->
<template>
  <div class="main">
    <img :class="{big:isbigger}" @dblclick="isbigger = !isbigger" v-if="isbigger" :src="imgurl">
    <div class="header">
      <img src="../assets/logo.png" class="logo">
      <p>温州海洋环境监测中心站</p>
    </div>
    <div class="chart" v-if="isshowchart" ref="son">
      <div class="img_header"><p>近岸单元格数据预报--{{checked}}</p></div>
      <button class="aui_close" @click="showchart(4)">×</button>
      <!--<p>海浪预报</p>-->
      <chart1 :szyb="szyb" class="cha" ref="chart1"/>
    </div>
    <div class="img" v-if="isshow">
      <div class="img_header"></div>
      <button class="aui_close" @click="imgclose">×</button>
        <ul class="btn_menu" v-if="(imgtype==='kr'&&kind===0)||(imgtype==='jpnqy')||imgtype==='euro'" style="position: absolute;left: 30px;top: 100px;z-index:500;">
          <li>
            <button class="btn2" :class="{bactive:krheight === 0}" @click="hanguoimg(0)">地面</button>
          </li>
          <li v-if="imgtype==='kr'&&kind===0">
            <button class="btn2" :class="{bactive:krheight === 4}" @click="hanguoimg(4)">地面2</button>
          </li>
          <li v-if="(imgtype!=='euro')&&(imgtype!=='jpmqy'&&kind!==1)">
            <button class="btn2" :class="{bactive:krheight === 3&&imgtype!=='euro'}" @click="hanguoimg(3)">850hPa</button>
          </li>
          <li v-if="imgtype!=='euro'">
            <button class="btn2" :class="{bactive:krheight === 2}" @click="hanguoimg(2)">700hPa</button>
          </li>
          <li>
            <button class="btn2" :class="{bactive:krheight === 1}" @click="hanguoimg(1)">500hPa</button>
          </li>
        </ul>
      <ul class="btn_menu" v-if="imgtype==='cnwave'" style="position: absolute;left: 30px;top: 100px;z-index:500;">
        <li>
          <button class="btn2" :class="{bactive:gjkind === 0}" @click="cnwaveimg(0)">HY2/Ascat</button>
        </li>
        <li>
          <button class="btn2" :class="{bactive:gjkind === 1}" @click="cnwaveimg(1)">JASON2</button>
        </li>
      </ul>
      <!--<ul class="btn_menu" v-if="imgtype==='euro'" style="position: absolute;left: 30px;top: 100px;z-index:500;">-->
        <!--<li>-->
          <!--<button class="btn2" :class="{bactive:gjkind === 0}" @click="cnwaveimg(0)">HY2/Ascat</button>-->
        <!--</li>-->
        <!--<li>-->
          <!--<button class="btn2" :class="{bactive:gjkind === 1}" @click="cnwaveimg(1)">JASON2</button>-->
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
        <p v-if="imgtype==='jpn'">日本海浪图</p>
          <p v-if="imgtype==='jpnblcz'">日本波浪传真图</p>
          <p v-if="imgtype==='cnwave'">国家波浪遥感图</p>
          <p v-if="imgtype==='euro'">欧洲中心</p>
          <p v-if="imgtype==='sd'">手动获取图片</p>
        <div class="tup" v-if="imgtype!=='sd'">
          <ul class="tw" v-if="imgtype==='twyb'">
            <li v-for="(pic, index) in urllist.data" v-if="index < 8" :key="index">
              <img :src="head + pic.url"/>
            </li>
          </ul>
          <p @click="beforeimg" class="tupl" v-if="imgtype!=='twyb'"></p>
          <img v-if="imgtype!=='twyb'" @dblclick="isbigger = !isbigger" :src="imgurl"/>
          <p @click="nextimg" class="tupr" v-if="imgtype!=='twyb'"></p>
        </div>
          <ul class="btn_menu mid">
            <li>
              <button v-if="imgtype==='twyb'" class="btn" @click="downloadimg(urllist.data)">下载图片</button>
            </li>
          </ul>
        <ul class="btn_menu foot" v-if="imgtype !== 'twyb'&&imgtype!=='sd'">
          <li>
            <button class="btn" @click="startimg">开始播放</button>
            <input id="speed" value="1"/>秒/页
            <button class="btn" @click="changespeed">改动速度</button>
            <button class="btn" @click="cleanpic">结束播放</button>
          </li>
        </ul>
        <div class="img_list" v-if="imgtype!=='twyb'&&imgtype!=='sd'">
          <p @click="beforeimg" class="tupu"></p>
          <ul ref="yu" class="yulan">
            <li :class="{chosed:imgflag === pic.pic_name}" v-if="(imgtype==='euro'||(imgtype==='kr'&&kind===0)||(imgtype==='jpnqy'))&&krheight === 0" v-for="(pic, index) in surf" @click="clickimg(pic,index)">
              <img :src="head + pic.url"/>
              <p v-if="imgtype!=='euro'&&kind!==1">{{pic.tm}}</p>
              <p v-if="imgtype==='euro'||kind===1">{{pic.ybtm}}</p>
            </li>
            <li :class="{chosed:imgflag === pic.pic_name}" v-if="(imgtype==='euro'||(imgtype==='kr'&&kind===0)||(imgtype==='jpnqy'))&&krheight === 1" v-for="(pic, index) in up50" @click="clickimg(pic,index)">
              <img :src="head + pic.url"/>
              <p v-if="imgtype!=='euro'&&kind!==1">{{pic.tm}}</p>
              <p v-if="imgtype==='euro'||kind===1">{{pic.ybtm}}</p>
            </li>
            <li :class="{chosed:imgflag === pic.pic_name}" v-if="((imgtype==='jpnqy'&&kind===1)||(imgtype==='kr'&&kind===0)||(imgtype==='jpnqy'&&kind===0))&&krheight === 2" v-for="(pic, index) in up70" @click="clickimg(pic,index)">
              <img :src="head + pic.url"/>
              <p v-if="imgtype!=='euro'&&kind!==1">{{pic.tm}}</p>
              <p v-if="imgtype==='euro'||kind===1">{{pic.ybtm}}</p>
            </li>
            <li :class="{chosed:imgflag === pic.pic_name}" v-if="((imgtype==='kr'&&kind===0)||(imgtype==='jpnqy'&&kind===0))&&krheight === 3" v-for="(pic, index) in up85" @click="clickimg(pic,index)">
              <img :id="index" :src="head + pic.url"/>
              <p v-if="imgtype!=='euro'&&kind!==1">{{pic.tm}}</p>
              <p v-if="imgtype==='euro'||kind===1">{{pic.ybtm}}</p>
            </li>
            <li :class="{chosed:imgflag === pic.pic_name}" v-if="imgtype==='kr'&&kind===0&&krheight === 4" v-for="(pic, index) in surf2" @click="clickimg(pic,index)">
              <img :src="head + pic.url"/>
              <p v-if="imgtype!=='euro'&&kind!==1">{{pic.tm}}</p>
              <p v-if="imgtype==='euro'||kind===1">{{pic.ybtm}}</p>
            </li>
            <li :class="{chosed:imgflag === pic.pic_name}" v-if="imgtype==='cnwave'&&gjkind === 0" v-for="(pic, index) in Ascatlist" @click="clickimg(pic,index)">
              <img :src="head + pic.url"/>
              <p v-if="imgtype!=='euro'&&kind!==1">{{pic.tm}}</p>
              <p v-if="imgtype==='euro'||kind===1">{{pic.ybtm}}</p>
            </li>
            <li :class="{chosed:imgflag === pic.pic_name}" v-if="imgtype==='cnwave'&&gjkind === 1" v-for="(pic, index) in jason2list" @click="clickimg(pic,index)">
              <img :src="head + pic.url"/>
              <p v-if="imgtype!=='euro'&&kind!==1">{{pic.tm}}</p>
              <p v-if="imgtype==='euro'||kind===1">{{pic.ybtm}}</p>
            </li>
            <li :class="{chosed:imgflag === pic.pic_name}" v-if="(imgtype!=='euro'&&imgtype !== 'kr'&&imgtype!=='jpnqy'&&imgtype!=='cnwave')||(imgtype==='kr'&&kind===1)" v-for="(pic, index) in urllist.data" @click="clickimg(pic,index)">
              <img :src="head + pic.url"/>
              <p v-if="kind!==1">{{pic.tm}}</p>
              <p v-if="kind===1">{{pic.ybtm}}</p>
            </li>
          </ul>
          <p @click="nextimg" class="tupd"></p>
        </div>
        <div class="getdate">
          <date ref="vdate" v-if="checked!=='韩国天气图2'&&checked!=='日本天气图2'&&checked!=='日本波浪图'&&checked!=='国家波浪图'&&checked!=='日本波浪传真图'&&checked!=='手动获取图片'&&checked!=='台湾天气图'"/>
          <button @click="historyimg" class="btn dat" v-if="checked!=='韩国天气图2'&&checked!=='日本天气图2'&&checked!=='日本波浪图'&&checked!=='国家波浪图'&&checked!=='日本波浪传真图'&&checked!=='手动获取图片'&&checked!=='台湾天气图'">获取</button>
        </div>
        <div class="sdtz" v-if="imgtype==='sd'">
            <div class="srwz"><p>请输入网址</p><input type="text" v-model="searchUrl"><button class="getImg" @click="getImg(searchUrl)">获取</button></div>
            <img class="sstp" :src="searchUrl" :onerrοr="errorimg" alt="链接错误"/>
          </div>
      </div>
    </div>
<!--    <div class="mapCorner"></div>-->
    <AMap class="map" ref="amap"/>
    <div class="l_part">
      <ul class="fri">
        <li><div class="frili" @mouseover="changemenu(1)" :class="{friliActive:ismenu1}">实况数据</div>

        </li>
        <li><div class="frili" @mouseover="changemenu(2)" :class="{friliActive:ismenu2}">预报数据</div>
        </li>
        <li><div class="frili" @mouseover="changemenu(3)"  :class="{friliActive:ismenu3}">周会商</div>
        </li>
        <li><div class="frili" @mouseover="changemenu(4)" :class="{friliActive:ismenu4}">灾害警报</div>
        </li>
        <!--<li @click="typhoon(201918)">台风路径</li>-->
        <li><div class="frili"  @mouseover="changemenu(5)" :class="{friliActive:ismenu5}">近岸单元格数值预报</div>
        </li>
        <li><div class="frili" @mouseover="changemenu(6)" :class="{friliActive:ismenu6}">其他</div>

        </li>
        <div class="copyright">青岛海之声科技有限公司技术服务</div>
      </ul>
    </div>
    <div class="child_menu" :class="{showm:showMenu}" @mouseleave="mouseLeave">
    <div class="sec" :class="{down:ismenu1}">
      <ul class="">
        <li :class="{checked:checked === '韩国天气图'}" @click="allclear(),checked='韩国天气图',getimgurl('kr', 0)">韩国天气图</li>
        <li :class="{checked:checked === '日本天气图1'}" @click="allclear(),checked='日本天气图1',getimgurl('jpnqy', 0)">日本天气图</li>
        <li :class="{checked:checked === '日本云图'}" @click="allclear(),checked='日本云图',getimgurl('jpncloud', 0)">日本云图</li>
        <li :class="{checked:checked === '日本波浪传真图1'}" @click="allclear(),checked='日本波浪传真图1',getimgurl('jpnblcz', 0)">日本波浪传真图</li>
        <li :class="{checked:checked === '云图'}" @click="yuntu">云图</li>
        <li :class="{checked:checked === '雷达图'}" @click="radar">雷达图</li>
        <li :class="{checked:checked === 'jp'}" @click="jpfubiao">日本浮标</li>
        <li :class="{checked:checked === 'wz'}" @click="wzfubiao">温州实测</li>
        <li :class="{checked:checked === 'tw'}" @click="twfubiao">台湾浮标</li>
      </ul>
    </div>
    <div class="sec" :class="{down:ismenu2}">
      <ul class="">
        <li :class="{checked:checked === '韩国天气图2'}" @click="allclear(),checked='韩国天气图2',getimgurl('kr', 1)">韩国天气图</li>
        <li :class="{checked:checked === '日本天气图2'}" @click="allclear(),checked='日本天气图2',getimgurl('jpnqy', 1)">日本天气图</li>
        <li :class="{checked:checked === '日本波浪图'}" @click="allclear(),checked='日本波浪图',getimgurl('jpnbl', 1)">日本波浪图</li>
        <li :class="{checked:checked === '国家波浪图'}" @click="allclear(),checked='国家波浪图',getimgurl('cnhailang', 1)">国家波浪图</li>
        <li :class="{checked:checked === '日本波浪传真图'}" @click="allclear(),checked='日本波浪传真图',getimgurl('jpnblcz', 1)">日本波浪传真图</li>
      </ul>
    </div>
    <div class="sec" :class="{down:ismenu3}">
      <ul class="">
        <li :class="{checked:checked === '台湾天气图'}" @click="allclear(),checked='台湾天气图',getimgurl('twyb', 0)">台湾一周预报</li>
        <li :class="{checked:checked === '日本天气图'}" @click="allclear(),checked='日本天气图',getimgurl('jpn', 1)">日本一周预报</li>
        <li :class="{checked:checked === '欧洲中心'}" @click="allclear(),checked = '欧洲中心',getimgurl('euro', 0)">欧洲中心</li>
      </ul>
    </div>
    <div class="sec" :class="{down:ismenu4}">
      <ul class="">
        <li :class="{checked:checked === '国家波浪遥感图'}" @click="allclear(),checked='国家波浪遥感图',getimgurl('cnwave', 0)">国家波浪遥感图</li>
        <li :class="{checked:checked === '国家海浪图'}" @click="allclear(),checked='国家海浪图',getimgurl('cnhailang', 0)">国家海浪图</li>
        <li :class="{checked:checked === '国家水温图'}" @click="allclear(),checked='国家水温图',getimgurl('cnsw', 0)">国家水温图</li>
        <!--<li :class="{checked:checked === '日本天气图3'}" @click="allclear(),checked='日本天气图3',getimgurl('jpnqy', 0)">日本天气图</li>-->
        <li :class="{checked:checked === '台风路径'}" @click="givelist">台风路径</li>
      </ul>
    </div>
    <div class="sec" :class="{down:ismenu5}">
      <ul class="">
        <li :class="{checked:checked === '海浪预报'}" @click="ybWatch(0)">海浪预报</li>
        <li :class="{checked:checked === '海温预报'}" @click="ybWatch(1)">海温预报</li>
        <li :class="{checked:checked === '潮汐预报'}" @click="ybWatch(2)">潮汐预报</li>
        <!--<li :class="{checked:checked === '海浪预报'}" @click="">海浪预报</li>-->
        <!--<li :class="{checked:checked === '海温预报'}" @click="allclear(),checked='海温预报',showchart(1)">海温预报</li>-->
        <!--<li :class="{checked:checked === '潮汐预报'}" @click="allclear(),checked='潮汐预报',showchart(2)">潮汐预报</li>-->
      </ul>
    </div>
    <div class="sec" :class="{down:ismenu6}">
      <ul>
        <li :class="{checked:checked === '手动获取图片'}" @click="allclear(),checked='手动获取图片',winopen = true,isshow = !isshow,imgtype='sd'">手动获取图片</li>
      </ul>
    </div>
    </div>
    <!--<div class="r_part">-->
      <!--<ul>-->
        <!--<li>-->
          <!--<img :src="hanguourl"/>-->
          <!--<div class="footer">-->
            <!--<p style="margin-left: 10px;width: 70%;">韩国天气图</p>-->
            <!--<p @click="getimgurl('kr', 0)" style="text-align: right;width: 25%;">放大></p>-->
          <!--</div>-->
        <!--</li>-->
        <!--<li>-->
          <!--<img :src="japanurl"/>-->
          <!--<div class="footer">-->
            <!--<p style="margin-left: 10px;width: 70%;">日本海浪图</p>-->
            <!--<p @click="getimgurl('jpn', 1)" style="text-align: right;width: 25%;">放大></p>-->
          <!--</div>-->
        <!--</li>-->
        <!--<li>-->
          <!--<img :src="cnurl"/>-->
          <!--<div class="footer">-->
            <!--<p style="margin-left: 10px;width: 70%;">国家波浪图</p>-->
            <!--<p @click="getimgurl('cnhailang', 1)" style="text-align: right;width: 25%;">放大></p>-->
          <!--</div>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</div>-->
    <!--<div class="tf" style="position: absolute;top: 90px;right: 23%;z-index: 9;">-->
      <!--<a>台风路径</a>-->
      <!--<ul class="tf_list">-->
        <!--<li v-for="(ty, i) in tylist" @click="typhoon(ty.tfbh)">{{ty.name}}</li>-->
      <!--</ul>-->
    <!--</div>-->
    <div id="volet_clos">
      <div id="volet" :class="{'active2':checked === '台风路径'}" style="text-align: center">
        <span style="float: left">清除路径</span><span @click="closety" style="margin-left: 4rem;">></span>
        <ul class="tf_list" style="text-align: left">
          <li v-for="(ty) in tylist" :class="{sel:showlist.includes(ty.tfbh)}" @click="addlist(ty.tfbh)">&nbsp; {{ty.tfbh}} &nbsp;&nbsp;&nbsp; {{ty.name}}</li>
        </ul>
        <button class="sub" @click="typhoonall">完成</button>
        <!--<a href="" class="ouvrir">台风路径</a>-->
        <!--<a href="#volet_clos" class="fermer" aria-hidden="true">台风路径</a>-->
      </div>
    </div>
  </div>
</template>

<script>
import AMap from './Amap/Amap'
import chart1 from './chart1'
import {request, head, getimg} from '../net/request'
import date from './date'
export default {
  name: 'Homepage',
  components: {
    AMap,
    chart1,
    date
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
      tylist: [],
      winopen: false,
      islist: false,
      showlist: [],
      showlist2: [],
      checked: '',
      jp: false,
      tw: false,
      wz: false,
      yun: false,
      leida: false,
      krheight: 0,
      isbigger: false,
      head: head,
      imgflag: 0,
      surf: [],
      surf2: [],
      up50: [],
      up70: [],
      up85: [],
      szyb: '',
      // ismenu: [false, false, false, false, false],
      ismenu1: false,
      ismenu2: false,
      ismenu3: false,
      ismenu4: false,
      ismenu5: false,
      ismenu6: false,
      searchUrl: '',
      errorimg: 'this.src="../assets/404.jpg"',
      kind: '',
      sdate: null,
      edate: null,
      Ascatlist: [],
      jason2list: [],
      gjkind: 0,
      showMenu: false,
    }
  },
  created () {
    this.init()
    this.selectDate()
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
      request({
        url: '/thirdparty/tpdata/typhoonList.do'
      }).then(res => {
        this.tylist = res.data.data
        // console.log(res.data.data)
      }).catch(e => {
        console.log('获取失败' + e)
      })
    },
    cnwaveimg (flag) {
      this.cleanpic()
      this.num = 0
      this.gjkind = flag
      if (flag === 0) {
        this.imgurl = head + this.Ascatlist[0].url
        this.imgflag = this.Ascatlist[0].pic_name
      } else if (flag === 1) {
        this.imgurl = head + this.jason2list[0].url
        this.imgflag = this.jason2list[0].pic_name
      }
    },
    hanguoimg (flag) {
      // console.log(this.urllist.data)
      this.cleanpic()
      this.num = 0
      this.krheight = flag
      this.imgurl = head + this.urllist.data[flag].url
      this.imgflag = this.urllist.data[flag].pic_name
      if (this.imgtype === 'kr') {
        if (this.krheight === 0) {
          this.imgurl = ''
          this.imgurl = head + this.surf[0].url
          this.imgflag = this.surf[0].pic_name
        } else if (this.krheight === 1) {
          this.imgurl = ''
          this.imgurl = head + this.up50[0].url
          this.imgflag = this.up50[0].pic_name
        } else if (this.krheight === 2) {
          this.imgurl = ''
          this.imgurl = head + this.up70[0].url
          this.imgflag = this.up70[0].pic_name
        } else if (this.krheight === 3) {
          this.imgurl = ''
          this.imgurl = head + this.up85[0].url
          this.imgflag = this.up85[0].pic_name
        } else if (this.krheight === 4) {
          this.imgurl = ''
          this.imgurl = head + this.surf2[0].url
          this.imgflag = this.surf2[0].pic_name
        }
      } else if (this.imgtype === 'jpnqy') {
        // this.imgurl = head + this.urllist.data[flag].url
        // this.imgurl = head + this.urllist.data[flag].url
        // this.imgflag = head + this.urllist.data[flag].pic_name
        if (this.krheight === 0) {
          this.imgurl = ''
          this.imgurl = head + this.surf[0].url
          this.imgflag = this.surf[0].pic_name
        } else if (this.krheight === 1) {
          this.imgurl = ''
          this.imgurl = head + this.up50[0].url
          this.imgflag = this.up50[0].pic_name
        } else if (this.krheight === 2) {
          this.imgurl = ''
          this.imgurl = head + this.up70[0].url
          this.imgflag = this.up70[0].pic_name
        } else if (this.krheight === 3) {
          this.imgurl = ''
          this.imgurl = head + this.up85[0].url
          this.imgflag = this.up85[0].pic_name
        }
      } else if (this.imgtype === 'euro') {
        if (this.krheight === 0) {
          this.imgurl = ''
          this.imgurl = head + this.surf[0].url
          this.imgflag = this.surf[0].pic_name
        } else if (this.krheight === 1) {
          this.imgurl = ''
          this.imgurl = head + this.up50[0].url
          this.imgflag = this.up50[0].pic_name
        }
      }
    },
    getimgurl (type, kind) {
      this.imgurl = ''
      let this_ = this
      this.kind = kind
      if (this.winopen === true) {
        this.imgclose()
        this.winopen = false
      }
      if (this.isshowchart === true) {
        this.showchart()
      }
      this.winopen = true
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
        // console.log(kind)
        request({
          url: '/thirdparty/tpdata/getPic.do',
          params: {
            type: type,
            kind: kind
          }
        }).then(res => {
          this.urllist = res.data
          this.surf = []
          this.up50 = []
          this.up70 = []
          this.up85 = []
          this.showimage(type, res)
          // console.log(res.data.data)
          if (type === 'cnwave') {
            for (let i = 0; i < res.data.data.length; i++) {
              // console.log(res.data.data[i].pic_name.substring(res.data.data[i].pic_name.length - 5, res.data.data[i].pic_name.length))
              if (res.data.data[i].pic_name.substring(res.data.data[i].pic_name.length - 5, res.data.data[i].pic_name.length) === 't.png') {
                this.Ascatlist.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(res.data.data[i].pic_name.length - 5, res.data.data[i].pic_name.length) === '2.png') {
                this.jason2list.push(res.data.data[i])
              }
            }
          }
          if (type === 'kr' && kind === 0) {
            // console.log('1' + kind)
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].pic_name.substring(0, 4) === 'surf') {
                this.surf.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 4) === 'sfc3') {
                this.surf2.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 4) === 'up50') {
                this.up50.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 4) === 'up70') {
                this.up70.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 4) === 'up85') {
                this.up85.push(res.data.data[i])
              }
            }
          }
          if (type === 'jpnqy' && kind === 0) {
            // console.log(res.data.data)
            // console.log('2' + kind)
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].pic_name.substring(0, 3) === 'dim') {
                this.surf.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 3) === '500') {
                this.up50.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 3) === '700') {
                this.up70.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 3) === '850') {
                this.up85.push(res.data.data[i])
              }
            }
          }
          if (type === 'jpnqy' && kind === 1) {
            // console.log(res.data.data)
            // console.log('2' + kind)
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].pic_name.substring(0, 3) === 'dm_') {
                this.surf.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 3) === '50_') {
                this.up50.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 3) === '78_') {
                this.up70.push(res.data.data[i])
              }
            }
          }
          if (type === 'euro') {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].pic_name.substring(res.data.data[i].pic_name.length - 2, res.data.data[i].pic_name.length) === 'ms') {
                this.surf.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(res.data.data[i].pic_name.length - 2, res.data.data[i].pic_name.length) === '50') {
                this.up50.push(res.data.data[i])
              }
            }
          }
        }).catch(e => {
          console.log('图片获取失败' + e)
        })
      }
    },
    showimage (type, res) {
      this.urllist = []
      this.krheight = 0
      this.isshow = !this.isshow
      this.imgtype = type
      this.imgurl = head + res.data.data[0].url
      this.urllist = res.data
      this.imgflag = res.data.data[0].pic_name
      if (type === 'kr' && this.kind === 0) {
        this.imgurl = head + res.data.data[6].url
        this.imgflag = res.data.data[6].pic_name
      }
      if (type === 'jpnqy' && this.kind === 0) {
        this.imgurl = head + res.data.data[3].url
        this.imgflag = res.data.data[3].pic_name
      }
      if (type === 'euro') {
        this.imgurl = head + res.data.data[0].url
        this.imgflag = res.data.data[0].pic_name
      }
    },
    typhoon (tfbh) {
      // alert('功能开发中，敬请期待！')
      this.$refs['amap'].typhoon(tfbh)
    },
    showchart (i) {
      if (i !== 4) {
        this.allclear()
      }
      if (i === 0) {
        this.checked = '海浪预报'
      } else if (i === 1) {
        this.checked = '海温预报'
      } else if (i === 2) {
        this.checked = '潮汐预报'
      }
      if (this.winopen === true) {
        this.imgclose()
        this.winopen = false
      }
      this.isshowchart = !this.isshowchart
      if (i === 4) {
        this.checked = ''
      }
    },
    yuntu () {
      this.allclear()
      this.$refs['amap'].showyun()
      // this.yun = !this.yun
      if (this.checked !== '云图') {
        this.checked = '云图'
        // this.yun = !this.yun
      } else {
        this.checked = ''
        // this.yun = !this.yun
      }
    },
    radar () {
      this.allclear()
      // this.hidetyphoon()
      // this.$refs['amap'].cleanMarker()
      this.$refs['amap'].showrader()
      // this.leida = !this.leida
      // this.yun = false
      if (this.checked !== '雷达图') {
        this.checked = '雷达图'
      } else {
        this.checked = ''
      }
    },
    show (flag) {
      this.isshow = !this.isshow
      this.imgtype = flag
    },
    imgclose () {
      this.cleanpic()
      this.isshow = !this.isshow
      this.num = 0
      this.speed = 2000
      this.t = null
      this.winopen = false
      this.checked = ''
    },
    startimg () {
      this.changepic(this.num)
    },
    changepic (i) {
      let tnum = 0
      if ((this.imgtype === 'kr' && this.kind === 1) || (this.imgtype !== 'kr' && this.imgtype !== 'jpnqy' && this.imgtype !== 'cnwave' && this.imgtype !== 'euro')) {
        this.imgurl = head + this.urllist.data[i].url
        this.imgflag = this.urllist.data[i].pic_name
        tnum = this.urllist.data.length
      } else if (this.imgtype === 'cnwave') {
        if (this.gjkind === 0) {
          this.imgurl = head + this.Ascatlist[i].url
          this.imgflag = this.Ascatlist[i].pic_name
          tnum = this.Ascatlist.length
        } else if (this.gjkind === 1) {
          this.imgurl = head + this.jason2list[i].url
          this.imgflag = this.jason2list[i].pic_name
          tnum = this.jason2list.length
        }
      } else {
        if (this.krheight === 0) {
          this.imgurl = head + this.surf[i].url
          this.imgflag = this.surf[i].pic_name
          tnum = this.surf.length
        } else if (this.krheight === 1) {
          this.imgurl = head + this.up50[i].url
          this.imgflag = this.up50[i].pic_name
          tnum = this.up50.length
        } else if (this.krheight === 2) {
          this.imgurl = head + this.up70[i].url
          this.imgflag = this.up70[i].pic_name
          tnum = this.up70.length
        } else if (this.krheight === 3) {
          this.imgurl = head + this.up85[i].url
          this.imgflag = this.up85[i].pic_name
          tnum = this.up85.length
        }
      }
      // if (this.imgtype === 'kr') {
      //   if (this.urllist.data[i].pic_name.substring(0, 4) === 'surf') {
      //     this.krheight = 0
      //   } else if (this.urllist.data[i].pic_name.substring(0, 4) === 'up50') {
      //     this.krheight = 1
      //   } else if (this.urllist.data[i].pic_name.substring(0, 4) === 'up70') {
      //     this.krheight = 2
      //   } else if (this.urllist.data[i].pic_name.substring(0, 4) === 'up85') {
      //     this.krheight = 3
      //   }
      // }
      this.num = i + 1
      if (this.num === tnum) {
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
    },
    hidetyphoon () {
      if (this.checked === '台风路径') {
        this.checked = ''
      }
      this.showlist = []
      // this.islist = !this.islist
      this.$refs['amap'].hideTyphoon()
    },
    wzfubiao () {
      this.allclear()
      this.$refs['amap'].showwzfubiao()
      this.checked = 'wz'
    },
    jpfubiao () {
      this.allclear()
      this.$refs['amap'].showjpfubiao(1)
      this.checked = 'jp'
    },
    twfubiao () {
      this.allclear()
      this.$refs['amap'].showjpfubiao(0)
      this.checked = 'tw'
    },
    addlist (i) {
      // this.showlist.push(i)
      if (this.showlist.includes(i)) {
        // includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
        // filter()方法用于把Array的某些元素过滤掉，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素：生成新的数组
        this.showlist = this.showlist.filter(function (ele) { return ele !== i })
      } else {
        this.showlist.push(i)
      }
    },
    typhoonall () {
      this.$refs['amap'].hideTyphoon()
      this.showlist2 = this.showlist
      let list = this.showlist2
      for (let i = 0; i < list.length; i++) {
        this.typhoon(list[i])
        console.log('ok')
      }
      // this.showlist2 = []
    },
    beforeimg () {
      this.cleanpic()
      if (this.num > 0) {
        this.num = this.num - 1
        // this.imgurl = head + this.urllist.data[this.num].url
        if ((this.imgtype === 'kr' && this.kind===1) && this.imgtype !== 'cnwave' && this.imgtype !== 'euro') {
          this.imgurl = head + this.urllist.data[this.num].url
          this.imgflag = this.urllist.data[this.num].pic_name
          this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / this.urllist.data.length)
        } else if (this.imgtype === 'cnwave') {
          if (this.gjkind === 0) {
            this.imgurl = head + this.Ascatlist[this.num].url
            this.imgflag = this.Ascatlist[this.num].pic_name
            this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / this.Ascatlist.length)
          } else if (this.gjkind === 1) {
            this.imgurl = head + this.jason2list[this.num].url
            this.imgflag = this.jason2list[this.num].pic_name
            this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / this.jason2list.length)
          }
        } else {
          if (this.krheight === 0) {
            this.imgurl = head + this.surf[this.num].url
            this.imgflag = this.surf[this.num].pic_name
            this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / this.surf.length)
          } else if (this.krheight === 1) {
            this.imgurl = head + this.up50[this.num].url
            this.imgflag = this.up50[this.num].pic_name
            this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / this.up50.length)
          } else if (this.krheight === 2) {
            this.imgurl = head + this.up70[this.num].url
            this.imgflag = this.up70[this.num].pic_name
            this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / this.up70.length)
          } else if (this.krheight === 3) {
            this.imgurl = head + this.up85[this.num].url
            this.imgflag = this.up85[this.num].pic_name
            this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / this.up85.length)
          } else if (this.krheight === 4) {
            this.imgurl = head + this.surf2[this.num].url
            this.imgflag = this.surf2[this.num].pic_name
            this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / this.surf2.length)
          }
        }
      } else {
        alert('已是第一张！')
      }
    },
    nextimg () {
      this.cleanpic()
      // console.log(this.urllist.data.length)
      // console.log(this.urllist.data)
      let list = []
      if ((this.imgtype === 'kr' && this.kind === 1) || (this.imgtype !== 'kr' && this.imgtype !== 'jpnqy' && this.imgtype !== 'cnwave' && this.imgtype !== 'euro')) {
        list = this.urllist.data
      } else if (this.imgtype === 'cnwave') {
        if (this.gjkind === 0) {
          list = this.Ascatlist
        } else if (this.gjkind === 1) {
          list = this.jason2list
        }
      } else {
        if (this.krheight === 0) {
          list = this.surf
        } else if (this.krheight === 1) {
          list = this.up50
        } else if (this.krheight === 2) {
          list = this.up70
        } else if (this.krheight === 3) {
          list = this.up85
        } else if (this.krheight === 4) {
          list = this.surf2
        }
      }
      if (this.num < list.length - 1) {
        this.num = this.num + 1
        // document.querySelector('.chosed').focus()
        // console.log(this.num)
        this.imgurl = head + list[this.num].url
        this.imgflag = list[this.num].pic_name
        // console.log(this.$refs.yu.scrollHeight)
        // console.log(this.$refs.yu.scrollTop)
        this.$refs.yu.scrollTop = this.num * (this.$refs.yu.scrollHeight / list.length)
        // document.getElementById(this.num).focus()
        // if (this.krheight === 0) {
        //   this.imgflag = this.surf[this.num].pic_name
        // } else if (this.krheight === 1) {
        //   this.imgflag = this.up50[this.num].pic_name
        // } else if (this.krheight === 2) {
        //   this.imgflag = this.up70[this.num].pic_name
        // } else if (this.krheight === 3) {
        //   this.imgflag = this.up85[this.num].pic_name
        // }
      } else {
        alert('已是最后一张！')
      }
    },
    givelist () {
      this.allclearx()
      this.$refs['amap'].showtuli()
      if (this.checked !== '台风路径') {
        this.checked = '台风路径'
      } else {
        this.checked = ''
      }
    },
    allclear () {
      if (this.$refs['amap'].istuli) {
        this.$refs['amap'].changetuli(false)
      }
      this.$refs['amap'].cleanMarker()
      if (this.checked === '云图') {
        this.$refs['amap'].showyun()
      }
      if (this.checked === '雷达图') {
        this.$refs['amap'].showrader()
      }
      this.$refs['amap'].hideTyphoon()
      if (this.isshowchart) {
        this.showchart(4)
      }
      if (this.winopen) {
        this.imgclose()
      }
      this.$refs['amap'].isshowfubiaowin = false
      this.$refs['amap'].mode = 0
    },
    allclearx () {
      this.$refs['amap'].cleanMarker()
      if (this.checked === '云图') {
        this.$refs['amap'].showyun()
      }
      if (this.checked === '雷达图') {
        this.$refs['amap'].showrader()
      }
      this.$refs['amap'].hideTyphoon()
      if (this.isshowchart) {
        this.showchart(4)
      }
      if (this.winopen) {
        this.imgclose()
      }
      this.$refs['amap'].isshowfubiaowin = false
      this.$refs['amap'].mode = 0
    },
    clickimg (pic, index) {
      this.imgurl = head + pic.url
      this.imgflag = pic.pic_name
      this.num = index
    },
    getdata () {
      this.$refs['chart1'].getData()
    },
    hidetuli () {
      this.$refs['amap'].showtuli()
    },
    closety () {
      this.hidetyphoon()
      this.hidetuli()
    },
    changemenu (i) {
      // console.log('2333')
      this.showMenu = true
      if (i === 1) {
        this.ismenu1 = true
        this.ismenu2 = false
        this.ismenu3 = false
        this.ismenu4 = false
        this.ismenu5 = false
        this.ismenu6 = false
      } else if (i === 2) {
        this.ismenu2 = true
        this.ismenu1 = false
        this.ismenu3 = false
        this.ismenu4 = false
        this.ismenu5 = false
        this.ismenu6 = false
      } else if (i === 3) {
        this.ismenu3 = true
        this.ismenu2 = false
        this.ismenu1 = false
        this.ismenu4 = false
        this.ismenu5 = false
        this.ismenu6 = false
      } else if (i === 4) {
        this.ismenu4 = true
        this.ismenu2 = false
        this.ismenu3 = false
        this.ismenu1 = false
        this.ismenu5 = false
        this.ismenu6 = false
      } else if (i === 5) {
        this.ismenu5 = true
        this.ismenu2 = false
        this.ismenu3 = false
        this.ismenu4 = false
        this.ismenu1 = false
        this.ismenu6 = false
      } else if (i === 6) {
        this.ismenu6 = true
        this.ismenu2 = false
        this.ismenu3 = false
        this.ismenu4 = false
        this.ismenu1 = false
        this.ismenu5 = false
      }
      // for (let a = 0; a < 5; a++) {
      //   console.log(this.ismenu[a])
      //   if (a === i) {
      //     this.ismenu[a] = true
      //   } else {
      //     this.ismenu[a] = false
      //   }
      // }
    },
    mouseLeave(){
      this.showMenu = false
    },
    ybWatch (k) {
      // this.allclear()
      if (k === 0) {
        this.szyb = 'hl'
        this.checked = '海浪预报'
      } else if (k === 1) {
        this.szyb = 'hw'
        this.checked = '海温预报'
      } else if (k === 2) {
        this.szyb = 'cx'
        this.checked = '潮汐预报'
      }
      this.showchart(k)
      this.$refs['chart1'].changeSzyb(k)
      this.getdata()
    },
    historyimg () {
      this.sdate = this.$refs['vdate'].sdate
      this.edate = this.$refs['vdate'].edate
      this.imgurl = ''
      // this.kind = kind
      // if (this.winopen === true) {
      //   this.imgclose()
      //   this.winopen = false
      // }
      // if (this.isshowchart === true) {
      //   this.showchart()
      // }
      // this.winopen = true
      if (this.imgtype === 'jpn') {
        request({
          url: '/thirdparty/tpdata/getPic.do',
          params: {
            type: this.imgtype,
            kind: this.kind,
            stcd: 'jp01'
          }
        }).then(res => {
          // this.urllist = res.data
          this.urllist = []
          this.krheight = 0
          // this.isshow = !this.isshow
          // this.imgtype = type
          this.imgurl = head + res.data.data[0].url
          this.urllist = res.data
          this.imgflag = res.data.data[0].pic_name
          if (this.imgtype === 'jpnqy') {
            this.imgurl = head + res.data.data[3].url
            this.imgflag = res.data.data[3].pic_name
          }
        }).catch(e => {
          console.log('图片获取失败' + e)
        })
      } else {
        request({
          url: '/thirdparty/tpdata/getPic.do',
          params: {
            type: this.imgtype,
            kind: this.kind,
            startTime: this.sdate,
            endTime: this.edate
          }
        }).then(res => {
          console.log(res)
          this.urllist = res.data
          this.surf = []
          this.up50 = []
          this.up70 = []
          this.up85 = []
          this.urllist = []
          this.krheight = 0
          // this.isshow = !this.isshow
          // this.imgtype = type
          this.imgurl = head + res.data.data[0].url
          this.urllist = res.data
          this.imgflag = res.data.data[0].pic_name
          if (this.imgtype === 'jpnqy') {
            this.imgurl = head + res.data.data[3].url
            this.imgflag = res.data.data[3].pic_name
          }
          // console.log(res.data.data)
          if (this.imgtype === 'kr' && this.kind === 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].pic_name.substring(0, 4) === 'surf') {
                this.surf.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 4) === 'up50') {
                this.up50.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 4) === 'up70') {
                this.up70.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 4) === 'up85') {
                this.up85.push(res.data.data[i])
              }
            }
          } else if (this.imgtype === 'jpnqy' && this.kind === 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].pic_name.substring(0, 3) === 'dim') {
                this.surf.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 3) === '500') {
                this.up50.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 3) === '700') {
                this.up70.push(res.data.data[i])
              } else if (res.data.data[i].pic_name.substring(0, 3) === '850') {
                this.up85.push(res.data.data[i])
              }
            }
          }
        }).catch(e => {
          console.log('图片获取失败' + e)
        })
      }
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
    saveAsImage (imgurl, name) {
      // let content = this.head + imgurl
      //
      // let aLink = document.createElement('a')
      // let blob = this.base64ToBlob(content)
      //
      // let evt = document.createEvent('HTMLEvents')
      // evt.initEvent('click', true, true)
      // aLink.download = name
      // aLink.href = URL.createObjectURL(blob)
      // aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
      // 下载图片地址和图片名
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        // fetch('http://somehost/check-permission', options).then(res => {
        //   if (res.code === 0) {
        //     let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        //     let a = document.createElement('a') // 生成一个a元素
        //     let event = new MouseEvent('click') // 创建一个单击事件
        //     a.download = name || 'photo' // 设置图片名称
        //     a.href = url // 将生成的URL设置为a.href属性
        //     a.dispatchEvent(event) // 触发a的单击事件
        //     // var a = document.createElement('a');
        //     // var url = res.data.url;
        //     // var filename = 'myfile.zip';
        //     // a.href = url;
        //     // a.download = filename;
        //     // a.click();
        //   } else {
        //     alert('You have no permission to download the file!')
        //   }
        // })
        let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        let a = document.createElement('a') // 生成一个a元素
        let event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgurl
    },
    downloadimg (urllist) {
      for (let i = 0; i < 8; i++) {
        this.saveAsImage(this.head + urllist[i].url, urllist[i].pic_name)
      }
    }
  }
}
</script>

<style scoped>
  ul {
    list-style-type: none;
  }
  .mapCorner{
    width:0;
    height:0;
    border-color: #95a1ad white white #95a1ad;
    border-width: 30px 30px 30px 30px;
    z-index: 80;
    position: absolute;
    top: 10vh;
    left: 14vw;
    border-style: solid;
    box-shadow: 5px 5px 15px #888888;
  }
  input {
    width: 3rem;
    height: 20px;
    border: 1px solid #999999;
    border-radius: 4px;
    font-size: 1.3rem;
    text-align: center;
    margin-left: 20px;
  }
  .img_header p{
    margin-left: 2rem;
    text-align: left;
    font-size: 1.2rem;
    margin-top: 1vh;
    font-weight: bold;
    color: #e7e6e6;
  }
.main {
  height: 100vh;
  overflow: hidden;
  position: relative;
  /*background: url('../assets/background.png') no-repeat;*/
  width:100%;
  /*background:url(../../static/img/background.6d133b5.png) ;*/
  background-size:cover;
}
.logo{
  width: 4vw;
  height: 4vw;
  display: inline-block;
  vertical-align:middle;
  padding: 0.8rem 1rem 0.2rem;
}
.header {
  width: 13.5%;
  height: 16vh;
  text-align: center;
  position: absolute;
  z-index: 99;
  /*padding: 0.8rem 1.3rem;*/
  color: #fff;
  background-color: #183a64;
}
.header:before{
  vetical-align:middle;
  display: inline-block;
  vertical-align:middle;
}
.header p{
  display: inline-block;
  vertical-align:middle;
  font-size: 1vw;
  font-weight: bold;
}
.l_part {
  width: 13.5%;
  height: 78vh;
  /*height: 100%;*/
  /*padding-top: 230px;*/
  /*line-height: 100px;*/
  background-color: #214e86;
  padding-top: 17vh;
  padding-bottom: 5vh;
  position: absolute;
  z-index: 9;
  top: 0;
  overflow: auto;
}
  .l_part::-webkit-scrollbar {/*滚动条整体样式*/
    display: none;
    margin-right: 3px;
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    /*scrollbar-arrow-color:red;*/
  }
  .l_part::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
    scrollbar-arrow-color:red;
  }
  .l_part::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
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
  width: 80%;
  height: 90vh;
  border-radius: 8px;
  padding-top: 5vh;
}
.img_header{
  width: 100%;
  height: 6vh;
  z-index: -10;
  top: 0px;
  left: 0px;
  position: absolute;
  background: #344e76;
}
.frili {
  padding: 5px 8px;
  color: #fff;
  font-size: 0.8vw;
  position: relative;
  margin-top: 10px;
  margin-left: 18%;
  cursor: pointer;
}
.copyright{
  position: absolute;
  color: #7e91b0;
  bottom: 0px;
  padding: 20px 1px;
  text-align: center;
  border-top: #7e91b0 1px solid;
}
  .friliActive{
    color: #ffde00;
  }
  .frili:hover{
    color: #ffde00;
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
.footer {
  display: flex;
}
.chart, .img {
  width: 86.5vw;
  height: 100vh;
  left: 13.5vw;
  margin: auto;
  position: absolute;
  border-radius: 10px;
  border: 1px solid #FFF;
  z-index: 99;
  background-color: #e7e6e6;
  padding: 20px;
}
.chart{
  background-color: #fff;
}
.cha {
  width: 100%;
  max-height: 60vh;
  margin-top: 10vh;
}
  .aui_close {
    width: 20px;
    height: 20px;
    z-index: 1000;
    line-height: 20px;
    display: block;
    position: absolute;
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
    top:1.5vh;
    color: #FFF;
    box-shadow: 0 1px 3px rgba(209, 40, 42,1);
    background: #d1282a;
    border-radius: 24px;
    transition: all 0.2s ease-out;
    opacity: 0.8;
  }
  .sec {
    width: 8vw;
    height: 100vh;
    top: 0px;
    left: 13.5vw;
    background: #2f5e99;
    position: absolute;
    padding: 30px 0 0;
    display: none;
    z-index: 1000;
  }
  .sec ul {
    font-size: 1rem;
    padding: 0;
    height: auto;
    margin-top: 18vh;
    width: 100%;
    text-align: right;
  }
  .sec ul li {
    padding: 10px 12px;
    color: white;
    cursor:pointer;
    border-bottom: #446ea3 1px solid;
  }
  .sec ul li a {
    color: white;
  }
  .sec ul li:first-child {
    border-top: 0;
  }
  .sec ul li:hover {
    /*border-left: 4px solid #e7e6e6;*/
    background: #dbab4f;
    color: white;
  }
  .showm{
    display: block!important;
  }
  .checked {
    /*border-left: 4px solid #e7e6e6;*/
    /*background: #283748;*/
    background: #dbab4f;
    color: white;
  }
  .img {
    background-color: #fff;
    text-align: center;

  }
  .img p {
    /*margin-left: 2rem;*/
    /*text-align: left;*/
    /*font-size: 1.2rem;*/
    /*font-weight: bold;*/
    /*color: #e7e6e6;*/
    margin-left: 2rem;
    text-align: left;
    font-size: 1.2rem;
    margin-top: -1vh;
    font-weight: bold;
    color: #e7e6e6;
  }
  /*.img_container {*/
    /*text-align: left;*/
  /*}*/
  .img_container img{
    /*text-align: left!important;*/
    width: 60%;
    max-height: 70vh;
    /*margin: 0 auto;*/
    margin-top: 5vh;
    margin-left: 15%;
  }
  .foot {
    position: absolute;
    top: 88vh;
    width: 100%;
  }
  .mid {
    position: absolute;
    top: 80vh;
    width: 100%;
  }
  .btn_menu {
    bottom: 0;
    margin-left: 0rem;
  }
  .btn_menu li {
    padding: 1rem 0;
  }
  .btn {
    padding: 0.2rem 1.2rem;
    color: white;
    background-color: #344e76;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    margin-left: 30px;
  }
  .btn2 {
    padding: 8px 5px;
    width: 7rem;
    font-size: 1.3rem;
    color: #fff;
    background-color: rgba(0,0,0,.3);
  }
  .btn2:hover {
    background-color: rgba(0,0,0,.8);
  }
  .bactive {
    background-color: rgba(0,0,0,.8);
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
  #volet {
    width: 165px;
    max-height: 70vh;
    padding: 10px;
    background: #fff;
    color: #fff;
    /*display: none;*/
    z-index: 0;
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
    right: -272px;  /* test fixed + scroll, on retire la position top */
    -webkit-transition: all .5s ease-in;
    -moz-transition: all .5s ease-in;
    transition: all .5s ease-in;
    min-height: 400px;
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
  .active2 {
    right: 10px!important;
    /*display: block!important;*/
    z-index: 500;
    -webkit-transition: all .5s ease-in!important;
    -moz-transition: all .5s ease-in!important;
    transition: all .5s ease-in!important;
  }

  /* code pour la fermeture */

  /*#volet:target a.fermer {*/
    /*display: block;*/
  /*}*/
  /*#volet:target a.ouvrir {*/
    /*display: none;*/
  /*}*/
  /*#volet_clos:target #volet {*/
    /*right: -273px;*/
  /*}*/

  /* test fixed + scroll */
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
  .tf_list {
    overflow: auto;
    max-height: 60vh;
  }
  .tf_list li {
    color: #000;
    font-size: 0.8rem;
    padding: 5px 0;
    cursor: pointer;
  }
  .sel:after {
    content: '';
    background:url("../assets/selected.png") no-repeat center;
    display:inline-block;
    background-size:15px;
    width:20px;
    height:12px;
    margin-left: 10px;
  }
  .tf_list li:nth-of-type(odd) {
    background-color: rgb(231,230,230);
  }
  .tf_list li:nth-of-type(even) {
    background-color: #fff;
  }
  .tf_list::-webkit-scrollbar {/*滚动条整体样式*/
    margin-right: 3px;
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    /*scrollbar-arrow-color:red;*/
  }
  .tf_list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
    scrollbar-arrow-color:red;
  }
  .tf_list::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .sub {
    margin-top: 15px;
    width: 50%;
    color: #fff;
    text-align: center;
    border: 1px solid #fff;
    border-radius: 8px;
    background-color: rgb(157,195,230);
    padding: 5px 8px;
  }
  .tupu {
    background:url("../assets/up.png") no-repeat center;
    background-size:3vh;
    width:3vh;
    height:3vh;
    margin: 0 auto!important;
  }
  .tupd {
    background:url("../assets/down.png") no-repeat center;
    background-size:3vh;
    width:3vh;
    height:3vh;
    /*margin-left: 0;*/
    margin: 0 auto!important;
  }
  .child_menu{
    display: none;
  }
  .tupl {
    position: absolute;
    top: 35vh;
    left: 12%;
    background:url("../assets/left.png") no-repeat center;
    background-size:3vh;
    width:3vh;
    height:3vh;
    margin: 0 auto!important;
  }
  .tupr {
    position: absolute;
    top: 35vh;
    right: 22%;
    background:url("../assets/right.png") no-repeat center;
    background-size:3vh;
    width:3vh;
    height:3vh;
    margin: 0 auto!important;
  }
  .tup {
    max-height: 70vh;
    text-align: left;
    position: relative;
    margin-top: 9vh;
  }
  .big {
    /*transition: all .5s linear;*/
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
  }
  .img_list {
    text-align: center;
    width: 15%;
    height: 75vh;
    border: 1px solid #345eb0;
    border-radius: 8px;
    position: absolute;
    top: 9vh;
    right: 60px;
  }
  .img_list p{
    text-align: center;
    margin-left: 0;
  }
  .yulan {
    height: 69vh;
    overflow: auto;
  }
  .yulan::-webkit-scrollbar {
    display: none;
  }
  .yulan li {
    cursor: pointer;
    margin-top: 10px;
    padding-top: 15px;
  }
  .yulan li img {
    margin: 0 auto;
  }
  .yulan li p {
    color: #000;
    font-size: 1rem;
    padding: 6px 0;
  }
  .chosed {
    background: #344e76;
  }
  .cebian {
    display: none;
  }
  .down {
    display: block!important;
  }
  .down ul {
    text-align: left;
  }
  .tw {
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    margin: 10vh auto;
  }
  .tw li {
    width: 24%;
  }
  .tw li img{
    width: 90%;
  }
  .srwz{
    margin: 0 auto;
    margin-top: 10vh;
    width: 100%;
    text-align: center;
    height: 8vh;
  }
  .srwz p{
    color: black;
    font-size: 2rem;
    float: left;
    padding: 0.5vh;
  }
  .srwz input{
    width: 60%;
    float: left;
    height: 4vh;
    border-radius: 5px;
  }
  .getImg{
    float: left;
    width: 5vw;
    height: 4vh;
    cursor: pointer;
    margin-left: 2vw;
    color: white;
    background-color:#207fde;
    border-radius: 5px;
  }
  .sstp{
    width: 60% !important;
    /*maxheight: 60vh !important;*/
    /* margin-left: 0; */
    margin: 0 auto;
    margin-left: 0 !important;
    margin-top: 3vh !important;
  }
  .sdtz {
    text-align: center
  }
  .getdate {
    position: absolute;
    top: 93vh;
    width: 100%;
    display: flex;
    margin: 0 auto;
    /*padding: auto;*/
    text-align: center;
  }
  .getdate div {
    /* margin: 0 auto; */
    cursor: pointer;
    width: 60%;
  }
 .dat {
    margin-left: 0
  }

</style>
