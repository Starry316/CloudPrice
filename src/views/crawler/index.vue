<template>

  <el-container class="user-container" direction="vertical" v-loading="loading">
    <h3>爬虫配置</h3>

      <span>爬虫运行状态：
        <el-tag v-if="switchValue" type="success">运行中</el-tag>
        <el-tag v-if="!switchValue" type="danger">暂停运行</el-tag>
      </span>
      <div class="list-item">
       <el-switch
         v-model="switchValue"
         active-color="#13ce66"
         inactive-color="#ff4949"
         active-text="启动爬虫"
         @change="dosomething"
         inactive-text="关闭爬虫">
       </el-switch>
      </div>
      <div class="list-item">
        <span>选择爬取时间</span>
        <el-time-select
          v-model="value"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
           }"
          placeholder="选择时间">
        </el-time-select>
      </div>
      <div class="list-item">
        <span>选择爬取日期</span>
        <el-date-picker
            v-model="value2"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div class="list-item">
        <span>
          上一次爬取时间： {{lastCrawledTime}}
          下一次爬取时间： {{nextCrawledTime}}
        </span>
      </div>
      <div class="list-item">
        <el-slider
          v-model="value4"
          :max=10
          :min=1
          :step=1
          show-input>
        </el-slider>
      </div>

    </el-container>

</template>

<script>
import { mapGetters } from 'vuex'


export default {
  components:{

  },

  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      lastCrawledTime: '2019-06-23 12:00:00',
      nextCrawledTime: '2019-06-23 15:00:00',
      value:'',
      value1: '',
      value2: '',
      value4: 1,
      loading:false,
      switchValue:false
    }
  },
  watch: {

  },

  methods: {
    init() {

      //alert(this.$store.getters.name)
    },
    dosomething(){
      this.loading = true

      setTimeout(e =>{
        this.loading = false
      },1000)
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },

  mounted(){
    this.init();
  }
}
</script>
<style scoped>
  .user-container{
    padding: 32px;
    /*background-color: #f0f2f5;*/
    /*position: relative;*/
  }
  .list-item{
    margin: 2rem 0;
  }
  /*.text {*/
    /*font-size: 14px;*/
  /*}*/

  /*.item {*/
    /*padding: 18px 0;*/
  /*}*/
</style>

