<template>

  <div class="dashboard-container">
    <div v-if="showTab==2">
      <el-button size="mini"
                 icon="el-icon-back"
                 @click="returnToTable">返回
      </el-button>

      <div class="dashboard-text">历史价格</div>

      <div class="server-info">
        <span style="color:#696969;font-family: Georgia">服务器： {{showServer.type}}</span>
        <span style="color:#696969;font-family: Georgia">机房： {{showServer.location}}</span>
        <span style="color:#696969;font-family: Georgia">系统： {{showServer.os}}</span>
      </div>

      <template>

<!--只要时间选择器时间变化了，下面的图像就动态跟着变化-->
        <span>查询时间</span>
        <el-date-picker
          v-model="startTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="开始时间">
        </el-date-picker>

        <el-date-picker
          v-model="endTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="终止时间">
        </el-date-picker>
        <el-button @click="getPrice(showServer.id,startTime,endTime)">查询</el-button>
        <span>预测算法</span>
        <el-select v-model="algoselect" placeholder="预测算法" style="margin-top: 15px;margin-left:15px">
          <el-option
            v-for="item in algos"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </template>


      <div style="margin-top: 20px">
        <el-row v-loading="loading" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart
            :actualData="actualData" :expectedData="expectedData"/>
        </el-row>

      </div>


    </div>
    <div v-if="showTab==1">
      <div class="dashboard-text">服务器列表</div>
      <el-table
        height="60vh"
        v-loading="loading"
        stripe
        :data="tableData"
        style="width: 100%">

        <el-table-column
          :filters="locationList"
          :filter-method="filterHandler"
          label="机房"
          prop="location">
        </el-table-column>

        <el-table-column
          :filters="typeList"
          :filter-method="filterHandler"
          label="型号"
          prop="type">
        </el-table-column>
        <el-table-column
          :filters="osList"
          :filter-method="filterHandler"
          label="操作系统"
          prop="os">
        </el-table-column>

        <el-table-column label="价格预测/历史价格">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="showHistory( scope.row,1)">查询
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total=totalCount>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {list, history, serverInfo, serverCount,serverPrice} from '../../api/cloud'
  import LineChart from './components/LineChart'


  export default {
    components: {
      LineChart,

    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      return {


        osList: [
          {text: 'Windows', value: 'Windows'},
          {text: 'SUSE Linux', value: 'SUSE Linux'},
          {text: 'Linux/UNIX', value: 'Linux/UNIX'}
        ],
        typeList: [
        ],
        locationList: [],

        tableData: [],
        loading: true,
        search: '',
        showTab: 1,
        totalCount:50,



        algos: [{
          value: 1,
          label: '随机森林'
        }, {
          value: 2,
          label: '逻辑回归'
        }],
        algoselect: 1,

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        startTime: '',
        endTime: "",
        expectedDataList:[],
        expectedData:[],
        actualData:[]
      }


    },
    methods: {
      showHistory( row,firstIn) {
        const date = new Date();
        this.loading = true
        this.changeTab(2)
        this.showServer = {
          type: row.type,
          location: row.location,
          os: row.os,
          id: row.id
        }

        this.getPriceDefault(row.id)
        this.loading = false

      },


      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      returnToTable(){
        this.changeTab(1)

        this.tableData = this.bufferTableData.get(1)
      },
      changeTab(tab) {
        this.showTab = tab
      },
      handleCurrentChange(page) {
        if (!this.bufferTableData.has(page))
          this.getTablePage(page)
        else
          this.tableData = this.bufferTableData.get(page)
      },
      getTablePage(page) {
        this.loading = true
        list(page).then(response => {
          this.bufferTableData.set(page, response.data)
          this.tableData = response.data
          this.loading = false
        })
      },


      /**
       * 获取筛选栏的数据
       */
      getServerInfo(){
        serverInfo().then(response=>{
          let respTypeList = response.data.typeList
          let respLocationList = response.data.locationList
          console.log(respLocationList)
          for (let i = 0; i < respTypeList.length; i++) {
            this.typeList.push({text: respTypeList [i], value: respTypeList[i] })
          }
          for (let i = 0; i < respLocationList.length; i++) {
            this.locationList.push({text: respLocationList [i], value: respLocationList[i] })
          }
        })
      },
      /**
       * 获取列表总计数，用于分页
       */
      getServerCount(){
        serverCount().then(response=>{
          let count = response.data.count
          this.totalCount = count
        })
      },
      getPrice(id, startTime, endTime){
        if (endTime.length == 0||startTime.length == 0)
          return
        this.loading = true
        let reqData = {
          startTime:startTime,
          endTime:endTime,
          serverId:id
        }
        // this.expectedDataList = [{algo:1,data:[
        //     {value:['2019-12-07',123]},
        //     {value:['2019-12-08',124]},
        //     {value:['2019-12-09',125]},
        //     {value:['2019-12-11',123]},
        //     {value:['2019-12-12',124]},
        //     {value:['2019-12-13',125]},
        //   ]},
        //   {algo:2,data:[
        //       {value:['2019-12-07',155]},
        //       {value:['2019-12-08',15]},
        //       {value:['2019-12-09',155]},
        //       {value:['2019-12-11',15]},
        //       {value:['2019-12-12',55]},
        //       {value:['2019-12-13',15]},
        //     ]}
        //
        // ]
        // this.expectedData = this.expectedDataList[0].data
        // this.actualData = [
        //   {value:['2019-12-07',12]},
        //   {value:['2019-12-08',12]},
        //   {value:['2019-12-09',12]},
        //   {value:['2019-12-11',12]},
        //   {value:['2019-12-12',12]},
        //   {value:['2019-12-13',12]},
        // ]
        // this.loading = false
        serverPrice(reqData).then(response=>{
          let data = response.data
          this.expectedDataList = data.expectedData
          this.actualData = data.actualData
          this.loading = false
        }).catch(e=>{
          this.loading = false
        })
      },

      getPriceDefault(id){
        // 开始时间
        let sDate = new Date()
        sDate.setMonth(sDate.getMonth()-9)
        // let startTime = sDate.getFullYear()+'-'+sDate.getMonth()+'-'+sDate.getDay()
        // 结束时间
        let eDate = new Date()

        eDate.setDate(eDate.getDate()+3)
        // eDate.setMonth(eDate.getMonth()+1)

        // let endTime = eDate.getFullYear()+'-'+(eDate.getMonth())+'-'+eDate.getDay()
        let endTime = eDate.Format("yyyy-MM-dd");
        let startTime = sDate.Format("yyyy-MM-dd");
        this.getPrice(id, startTime, endTime)
      },

    },
    mounted() {
      this.bufferTableData = new Map()
      this.getServerInfo()
      this.getServerCount()
      this.getTablePage(1)
      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    },
    watch:{
      algoselect(val) {
        for (let i = 0; i < this.expectedDataList.length; i++) {
          if (this.expectedDataList[i].algo == this.algoselect){
            this.expectedData = this.expectedDataList[i].data
            return
          }
        }
        this.expectedData = []

      }
    }


  }
</script>


<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .server-info {
    margin: 1rem 0;
  }

  .server-info span {
    margin: 2rem 1rem 2rem 0;
  }

  .pagination {
    text-align: center;
    margin-top: 2rem;
  }
</style>
