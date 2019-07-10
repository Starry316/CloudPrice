<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {generateRandomName} from '@/utils/random'
import {export_json_to_excel} from "../../../vendor/Export2Excel";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    // chartData: {
    //   type: Object,
    //   required: true
    // },
    actualData :  {
      type: Array,
      required: true
    },
    expectedData: {
      type: Array,
      required: true
    },
  },
  data() {
    return {



      chart: null,
      table: []

    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },

    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    setOptions() {
      this.chart.setOption({
        title: {
          text: '历史及预测价格'
        },
        xAxis: {
          //type: 'category',
          // data: timeData,
          boundaryGap: true,
          axisTick: {
            show: false
          },
          type:'time'
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          // formatter: function (params) {
          //   params = params[0];
          //   var date = new Date(params.name);
          //   return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
          // },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          type: 'value',
          axisLabel: {
            formatter: '{value} 美元/小时'
          }
        },
        legend: {
          data: ['expected', 'actual']
        },

        toolbox: {
          show: true,
          dataZoom: {
            yAxisIndex: 'none'
          },
          showTitle:true,
          // orient: 'vertical',
          // //left: 'right',
           right:'50px',
           //top: '2px',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack']},
            restore: {show: true},
            saveAsImage: {show: true},
            myExportExpectExcel: {
              show: true,
              title: '导出预计价格excel',
              icon: 'image:/excel.svg',
              onclick: () => {

                let excelData = []
                for (let i = 0; i < this.expectedData.length; i++) {
                  let value = this.expectedData[i].value
                  let item = {
                    time: value[0],
                    price: value[1]
                  }

                  excelData.push(item)
                }

                let tHeader = ['时间', '预计价格'] // excel的表头标题
                let filterVal = ['time', 'price'] // 需要导出对应自己列表中的每项数据
                let list = excelData
                let data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, generateRandomName(16))

              }
            },
            myExportHistoryExcel:{
                show:true,
                title:'导出历史价格excel',
                icon:'image:/excel.svg',
                onclick: ()=> {

                  let excelData = []
                  for (let i = 0; i < this.actualData.length; i++) {
                    let value = this.actualData[i].value
                    let item = {
                      time: value[0],
                      price: value[1]
                    }

                    excelData.push(item)
                  }
                  let tHeader = ['时间', '爬取价格'] // excel的表头标题
                  let filterVal = ['time', 'price'] // 需要导出对应自己列表中的每项数据
                  let list = excelData
                  let data = this.formatJson(filterVal, list)
                  export_json_to_excel(tHeader, data, generateRandomName(16))
                }
            }
          }
        },

        series: [
          // 预测数据曲线
          {
          name: 'expected', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          // data: expectedData,
          data: this.expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          // markPoint: {
          //   data: [
          //     {type: 'max', name: '最大值'},
          //     {type: 'min', name: '最小值'}
          //   ]
          // },
          // markLine: {
          //   data: [
          //     {type: 'average', name: '平均值'},
          //
          //   ]
          // }
        },

          // 实际价格曲线配置
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            // data: expectedData,
            data: this.actualData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
            markLine: {
              data: [
                {type: 'average', name: '平均值'},

              ]
            }
          },

        ]
      },true)
    }
  },
  watch:{
    expectedData(val){
      this.initChart()
    },
    actualData(val){
      this.initChart()
    }
  }
}
</script>
