<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
            saveAsImage: {show: true}
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
              // [{
              //   symbol: 'none',
              //   x: '90%',
              //   yAxis: 'max'
              // }, {
              //   symbol: 'circle',
              //   label: {
              //     normal: {
              //       position: 'start',
              //       formatter: '最大值'
              //     }
              //   },
              //   type: 'max',
              //   name: '最高点'
              // }]
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
              // [{
              //   symbol: 'none',
              //   x: '90%',
              //   yAxis: 'max'
              // }, {
              //   symbol: 'circle',
              //   label: {
              //     normal: {
              //       position: 'start',
              //       formatter: '最大值'
              //     }
              //   },
              //   type: 'max',
              //   name: '最高点'
              // }]
            ]
          }
        }]
      })
    }
  }
}
</script>
