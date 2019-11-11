<template>
<div>
  <input type="text" id="start" v-model="sdate" placeholder="开始时间 " style="text-align:center"  readonly="true" />
  <input type="text" id="end" v-model="edate" placeholder="结束时间 " style="text-align:center"  readonly="true" />
</div>
</template>

<script>
import laydate from '../../static/laydate/laydate.js'
export default {
  name: 'date',
  data () {
    return {
      sdate: null,
      edate: null
      // laydate: window.laydate
    }
  },
  mounted () {
    // laydate.now()
    laydate.render({
      elem: '#start',
      done: (value) => {
        this.sdate = value
      }
    })
    laydate.render({
      elem: '#end',
      done: (value) => {
        this.edate = value
      }
    })
  }
}
</script>

<style scoped>

</style>
