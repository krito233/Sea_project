<template>
<div>
  从 <input type="text" id="start1" v-model="startdate" placeholder="开始时间 " style="text-align:center"  readonly="true" />
  到 <input type="text" id="end1" v-model="enddate" placeholder="结束时间 " style="text-align:center"  readonly="true" />
</div>
</template>

<script>
import laydate from '../../../static/laydate/laydate.js'
export default {
  name: 'vdate',
  data () {
    return {
      startdate: null,
      enddate: null
      // laydate: window.laydate
    }
  },
  mounted () {
    // laydate.now()
    laydate.render({
      elem: '#start1',
      done: (value) => {
        this.startdate = value
      }
    })
    laydate.render({
      elem: '#end1',
      done: (value) => {
        this.enddate = value
      }
    })
  }
}
</script>

<style scoped>

</style>
