<template>
  <div class="dashboard-container">
    <div class="dashboard-text">服务器列表</div>
    <el-table
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
      <el-table-column
        label="操作"
        >
        <!--<template slot="header" slot-scope="scope">-->
          <!--<el-input-->
            <!--v-model="search"-->
            <!--size="mini"-->
            <!--placeholder="输入关键字搜索"/>-->
        <!--</template>-->
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row.type)">预测价格</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleDelete(scope.$index, scope.row)">历史价格</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { list } from '../../api/cloud'
import LineChart from './components/LineChart'
export default {
  components: {
    LineChart
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      osList:[
        {text: 'windows', value: 'windows'},
        {text: 'linux', value: 'linux'}
      ],
      typeList:[
        {text: 't1.micro', value: 't1.micro'},
        {text: 'a1.medium', value: 'a1.medium'}
      ],
      tableData: [],
      loading: true,
      search:''
    }
  },
  methods:{
    handleEdit(index, row) {
      console.log(index);
    },
    handleDelete(index, row) {
      console.log(row.id);
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  },
  mounted(){
    list().then(response=>{
      this.tableData  = response.data.list
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
</style>
