<template xmlns:font-family="http://www.w3.org/1999/xhtml">

  <div class="dashboard-container">
    <div v-if="showTab==2">
      <el-button size="mini"
                 icon="el-icon-back"
                 @click="returnToTable">返回
      </el-button>

      <div class="dashboard-text">历史价格</div>

      <div class="server-info">
        <span style="color:#696969;font-family: Georgia">服务器： {{showServer.type}}</span>
        <span style="color:#696969;font-family: Georgia">机房： {{showServer.serverRoom}}</span>
        <span style="color:#696969;font-family: Georgia">系统： {{showServer.os}}</span>
      </div>

      <template>

<!--只要时间选择器时间变化了，下面的图像就动态跟着变化-->
        <el-date-picker
          v-model="time1"
          onchange="showHistory(this.showServer,0)"
          type="date"
          placeholder="开始时间">
        </el-date-picker>

        <el-date-picker
          v-model="time2"
          onchange="showHistory(this.showServer,0)"
          type="date"
          placeholder="终止时间">
        </el-date-picker>


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
          <line-chart :chart-data="lineChartData"/>
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showPredict(scope.$index, scope.row)">预测价格
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="showHistory( scope.row,1)">历史价格
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
  import {list, history, serverInfo, serverCount} from '../../api/cloud'
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
        lineChartData: {
          expectedData: [100, 120, 161, 134, 105, 160, 165],
          actualData: [120, 82, 91, 154, 162, 140, 145],
          timeData: [1, 2, 3, 4, 5, 6, 7]
        },

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
          value: '选项1',
          label: '随机森林'
        }, {
          value: '选项2',
          label: '逻辑回归'
        }], algoselect: '',

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        time1: '',
        time2: ""
      }


    },
    methods: {
      showHistory( row,firstIn) {
        const date = new Date();
        this.loading = true
        this.changeTab(2)
        this.showServer = {
          type: row.type,
          serverRoom: row.serverRoom,
          os: row.os,
        }
        //默认展示一周前到一周后。选择时间后是默认预测一周
        let data = {
          //id: row.id
          start_time:firstIn===1?date.getTime() - 3600 * 1000 * 24 * 7:this.time1,
          end_time:firstIn===1?date.getTime() + 3600 * 1000 * 24 * 7:this.time2+ 3600 * 1000 * 24 * 7,
          sever_type:row.type,
          sever_room:row.serverRoom,
          os:row.os
        }
        history(data).then(response => {
          this.lineChartData = response.data.list
          this.loading = false

        })

      },


      showPredict(index, row) {

        this.changeTab(3)
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
      }

    },
    mounted() {
      this.bufferTableData = new Map()
      this.getServerInfo()
      this.getServerCount()
      this.getTablePage(1)
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
