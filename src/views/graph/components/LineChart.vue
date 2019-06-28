<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
require('script-loader!xlsx/dist/xlsx.full.min');
//import {imExPortPlugin} from '../../../uitls/imex_port'
import resize from './mixins/resize'
src="../../utils/imex_port.js"
//import {export_json_to_excel} from "../../../vendor/Export2Excel";

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
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
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
      this.setOptions(this.chartData)
    },

    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    setOptions({ expectedData, actualData,timeData } = {}) {
      this.chart.setOption({
        xAxis: {
          //type: 'category',
          data: timeData,
          boundaryGap: true,
          axisTick: {
            show: false
          }
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
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true},
            myDownload:{
              show:true,
              title:'下载excel',
              icon:'image://http://echarts.baidu.com/images/favicon.png',

              onclick:function () {
                alert('点击了！')
                var _this = this;
                imExPortPlugin.export({
                  "data":[
                    {"id":1,"time":"2018-08-01"},
                    {"id":2,"time":"2018-08-02"},
                    {"id":3,"time":"2018-08-03"},
                    {"id":4,"time":"2018-08-04"},
                    {"id":5,"time":"2018-08-05"}
                  ],
                  "format":[
                    {"old":"id","new":"序号"},
                    {"old":"time","new":"时间"},
                  ],
                  "dom":_this,
                  "filename":"测试文件.xlsx",
                  "success":function () {
                    console.log("导出成功")
                  }
                })

                // let tHeader = ['id', '姓名', '年龄'] // excel的表头标题
                // let filterVal = ['id', 'name', 'age'] // 需要导出对应自己列表中的每项数据
                // let list = this.table // 列表数据
                // let data = this.formatJson(filterVal, list)
                // export_json_to_excel(tHeader, data, 'excelname')

              }

            }
          }
        },

        series: [{
          name: 'expected', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: false,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          markPoint: {
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          markLine: {
            data: [
              {type: 'average', name: '平均值'},

            ]
          }
        },
        {
          name: 'actual',
          smooth: false,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut',
          markPoint: {
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          markLine: {
            data: [
              {type: 'average', name: '平均值'},

            ]
          }
        }]
      })
    }
  }
}
</script>
