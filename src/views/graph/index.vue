<template>

  <div class="dashboard-container">
    <div v-if="showTab==2">
      <el-button size="mini"
                 icon="el-icon-back"
                 @click="changeTab(1)">返回
      </el-button>

      <div class="dashboard-text">历史价格</div>

      <template>
        <el-select v-model="optselect" placeholder="时间段" style="margin-top: 15px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="algoselect" placeholder="预测算法" style="margin-top: 15px;margin-left:15px">
          <el-option
            v-for="item in algos"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

<!--        <el-select v-model="chartselect" placeholder="展示形式" style="margin-top: 15px;margin-left:15px">-->
<!--          <el-option-->
<!--            v-for="item in charts"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->

        <el-button size="mini" @click="changeShow" style="margin-left: 20px">确定</el-button>

      </template>



      <div >
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
        :data="tableData.filter(data => !search || data.type.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">

        <el-table-column
          label="机房"
          prop="serverRoom">
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
              @click="showHistory(scope.$index, scope.row)">历史价格
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {list, history} from '../../api/cloud'
  import LineChart from './components/LineChart'
  import BarChart from './components/BarChart'


  export default {
    components: {
      LineChart ,
      BarChart
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
          timeData:[1,2,3,4,5,6,7]
        },

        osList: [
          {text: 'windows', value: 'windows'},
          {text: 'linux', value: 'linux'}
        ],
        typeList: [
          {text: 't1.micro', value: 't1.micro'},
          {text: 'a1.medium', value: 'a1.medium'}
        ],

        tableData: [],
        loading: true,
        search: '',
        showTab: 1,
        showServer: {
          type: 'a1-small',
          serverRoom: 'Hong Kong',
          os: 'windows'
        },

        options: [{
          value: '选项1',
          label: '一周内'
        }, {
          value: '选项2',
          label: '两周内'
        }, {
          value: '选项3',
          label: '一月内'
        }, {
          value: '选项4',
          label: '三月内'
        }, {
          value: '选项5',
          label: '一年内'
        }], optselect: '',
        algos: [{
          value: '选项1',
          label: '随机森林'
        }, {
          value: '选项2',
          label: '逻辑回归'
        }], algoselect: '',
        charts: [{
          value: '选项1',
          label: '折线图'
        }, {
          value: '选项2',
          label: '柱状图'
        }], chartselect: '',

      }


    },
    methods: {
      showHistory(index, row) {
        this.loading = true
        this.changeTab(2)
        this.showServer = {
          type: row.type,
          serverRoom: row.serverRoom,
          os: row.os,
        }
        let data = {
          id: row.id
        }
        history(data).then(response => {
          this.tableData = response.data.list
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

      changeTab(tab) {
        this.showTab = tab
      }

    },
    mounted() {
      list().then(response => {
        this.tableData = response.data.list
        this.loading = false
      })
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
</style>
