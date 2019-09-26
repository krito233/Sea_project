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
    width: 170px;
    height: 100px;
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
</style>
