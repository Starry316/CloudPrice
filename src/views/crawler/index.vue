<template>

  <el-container class="user-container" direction="vertical" v-loading="loading">
    <h3>爬虫配置</h3>





    <div class="list-item ">
      爬虫状态：
      <el-select v-model="tableSelect" style="margin-top: 15px;margin-left:15px">
        <el-option
          v-for="item in tableLabels"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div style="margin-top: 20px">
      <el-row v-loading="loading" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart
          :chartData="crawlData" :tableShowLabel="tableShowLabel"/>
      </el-row>

    </div>

    <span>爬虫运行状态：
        <el-tag v-if="status == 1">运行中</el-tag>
        <el-tag v-if="status == 2" type="success">正在爬取</el-tag>
        <el-tag v-if="status == 0" type="danger">暂停运行</el-tag>
      </span>
      <div class="list-item">
        <el-tooltip class="item" effect="dark" :content="tipContent[0]" placement="bottom-end">
          <el-switch
            v-model="switchValue"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启动爬虫"
            @change="switchCrawlerStatus"
            inactive-text="关闭爬虫">
          </el-switch>
        </el-tooltip>
        <el-tooltip class="item" effect="dark"  content="启动并立刻进行一次爬取" placement="bottom-end">
          <el-button @click="changeCrawlerStatus(2)" style="margin-left: 2rem">立即启动</el-button>
        </el-tooltip>
        <el-button v-if="!editing" @click="toEdit" style="margin-left: 2rem">修改爬取间隔</el-button>
        <el-button v-if="editing" @click="editCancel" style="margin-left: 2rem">取消</el-button>
        <el-button v-if="editing" @click="saveConfig" style="margin-left: 2rem">保存</el-button>
      </div>
    <div class="list-item slider">
      爬取间隔时间（单位：小时）
      <el-slider
        v-model="interval"
        :disabled="!editing"
        :min=1
        show-input>
      </el-slider>
    </div>
      <div class="list-item">
        <span>
          上一次爬取时间： {{lastCrawledTime}}
          <!--预计下一次爬取时间： {{nextCrawledTime}}-->
        </span>
        <span style="margin-left: 3rem">
            <!--上一次爬取时间： {{lastCrawledTime}}-->
            预计下一次爬取时间： {{nextCrawledTime}}
          </span>
      </div>


    </el-container>

</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from './components/LineChart'
import {crawlerHistory, changeConfig, changeStatus, crawlerStatus, pytest} from '../../api/crawler'
import { Message } from 'element-ui'
export default {
  components:{
    LineChart
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
      tableLabels: [{
        value: 1,
        label: '单次爬取时间花费'
      }, {
        value: 2,
        label: '成功爬取条目数'
      }],
      lastCrawledTime: '2019-06-23 12:00:00',
      nextCrawledTime: '2019-06-23 15:00:00',

      loading:false,
      switchValue:false,
      crawlData:[],
      interval:24,
      intervalTmp:'',
      costTableData:[],
      rowsTableData:[],
      status:0,
      tableSelect:1,
      tipContent:["启动并按照预计时间爬取","停止爬虫"],
      tableCostLabel:{name:"花费时间",fmt:'{value} s/次'},
      tableRowsLabel:{name:"爬取条目",fmt:'{value} 行/次'},
      tableShowLabel:{},
      editing : false,
      pyService:''
    }
  },
  watch: {
    tableSelect(val){
      if (this.tableSelect == 1){
        this.crawlData = this.costTableData
        this.tableShowLabel = this.tableCostLabel
      }
      else{
        this.crawlData = this.rowsTableData
        this.tableShowLabel = this.tableRowsLabel
      }

    }
  },

  methods: {
    async init() {
      this.loading = true
      this.tableShowLabel =this.tableCostLabel
      await this.getHistory()
      await this.getStatus()

      this.loading = false




      //alert(this.$store.getters.name)
    },
    async getHistory(){
      crawlerHistory().then(response=>{
        let data = response.data
        let startTime = data.startTime
        let endTime = data.endTime
        let costTime = data.costTime
        let rows = data.rows

        // let startTime = ["2019-06-06 12:30:12","2019-06-06 15:30:12","2019-06-07 12:30:12","2019-06-07 18:30:12"]
        // let costTime  = ["445","355","111","222"]
        // let rows = [1,2,3,4]
        for (let i = 0; i < startTime.length; i++) {
          let costItem = {
            value:[
              startTime[i],
              costTime[i]
            ]
          }

          let rowItem = {
            value:[
              startTime[i],
              rows[i]
            ]
          }
          this.costTableData.push(costItem)
          this.rowsTableData.push(rowItem)

        }
        this.crawlData = this.costTableData
        // this.crawlData = this.rowsTableData
      })
    },
    async getStatus(){

      crawlerStatus().then(response=>{

        let data = response.data.data
        // alert(data.status)

        this.interval = parseInt(data.interval)
        this.lastCrawledTime = data.lastTime
        this.nextCrawledTime = data.nextTime
        this.status = data.status
        if (this.status == 0)this.switchValue = false
        else this.switchValue = true
      })
    },
    saveConfig(){
      this.loading = true
      let data = {
        interval:this.interval
      }
      changeConfig(data).then(response=>{
        this.loading = false
        this.editing = false
        Message.success('修改成功！')

      }).catch(e=>{
        this.editCancel()
        this.loading = false
      })
    },
    changeCrawlerStatus(changeToStatus){

      this.loading = true
      if (this.status != 0 ){
        if ((changeToStatus == 1 || changeToStatus == 2)){
          changeStatus({status:0}).then(response=>{
            // 如果status为 2 是从强制启动改变的状态
            changeStatus({status:changeToStatus}).then(response=>{
              // 如果status为 2 是从强制启动改变的状态

              this.switchValue = true
              // console.log(changeToStatus)
              this.status = changeToStatus
              this.loading = false
            }).catch(e=>{
              // if (changeToStatus != 2)
              this.switchValue = !this.switchValue
              this.loading = false
            })
          }).catch(e=>{
            // if (changeToStatus != 2)
              this.switchValue = true
              this.loading = false
          })
        }
        else {
          changeStatus({status:changeToStatus}).then(response=>{
            // 如果status为 2 是从强制启动改变的状态
            if (changeToStatus == 2) {

              this.switchValue = true
            }
            console.log(changeToStatus)
            this.status = changeToStatus
            this.loading = false
          }).catch(e=>{
            if (changeToStatus != 2)
              this.switchValue = !this.switchValue
            this.loading = false
          })
        }
      }
      else {
        changeStatus({status:changeToStatus}).then(response=>{
          // 如果status为 2 是从强制启动改变的状态
          if (changeToStatus == 2) {

            this.switchValue = true
          }
          console.log(changeToStatus)
          this.status = changeToStatus
          this.loading = false
        }).catch(e=>{
          if (changeToStatus != 2)
            this.switchValue = !this.switchValue
          this.loading = false
        })
      }
    },
    switchCrawlerStatus(){
      if (this.switchValue) {
        this.changeCrawlerStatus(1)
      }else{
        this.changeCrawlerStatus(0)
      }
    },
    toEdit(){
      this.editing = true
      this.intervalTmp = this.interval
    },
    editCancel(){
      this.editing = false
      this.interval = this.intervalTmp
    },

  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },

  mounted(){
    // pytest().then(resp=>{
    //   alert(1)
    // }).catch(()=>{
    //   alert(2)
    // })
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
  .slider{
    width: 60%;
  }
  /*.text {*/
    /*font-size: 14px;*/
  /*}*/

  /*.item {*/
    /*padding: 18px 0;*/
  /*}*/
</style>

