<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  .amap-marker-label{
    width: 250px;
    height: 300px;
    padding: 0;
    border: 1px solid #fff;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    /*background-color: transparent;*/
  }
  .fubiao_info {
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    /*background-color: #fff;*/
  }
  .fubiao_info p {
    padding: 10px 5px;
  }
  .fubiao_info2 p {
    padding: 5px 5px;
  }
  .aui_close2 {
    width: 20px;
    height: 20px;
    z-index: 1000;
    line-height: 20px;
    display: block;
    position: absolute;
    left:120px;
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
  .aui_close2:hover {
    width: 24px;
    height: 24px;
    line-height: 24px;
    left:118px;
    top:8px;
    color: #FFF;
    box-shadow: 0 1px 3px rgba(209, 40, 42, .5);
    background: #d1282a;
    border-radius: 24px;
    transition: all 0.2s ease-out;
    opacity: 0.8;
  }
  .typhoon_info{
    box-shadow:3px 3px 2px #888888;
    width:230px;
    height:auto;
    border-radius:10px;
    /*background-color:#ffffff;*/

  }
  .typhoon_info>.head{
    padding:8px 0px 8px 0px;
    border-top-right-radius:10px;
    border-top-left-radius:10px;
    background-color:#AADAFF;
    color:#333333;
    width:100%;
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
  .amap-overlay-text-container {
    padding: 0;
    border-radius: 8px;
    background-color: none;
  }
  .aui_close0 {
    width: 20px;
    height: 20px;
    z-index: 1000;
    line-height: 20px;
    display: block;
    position: absolute;
    /*right:10px;*/
    /*top:10px;*/
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
  .aui_close0:hover {
    width: 24px;
    height: 24px;
    line-height: 24px;
    /*left:8px;*/
    /*top:8px;*/
    color: #FFF;
    box-shadow: 0 1px 3px rgba(209, 40, 42, .5);
    background: #d1282a;
    border-radius: 24px;
    transition: all 0.2s ease-out;
    opacity: 0.8;
  }
</style>
