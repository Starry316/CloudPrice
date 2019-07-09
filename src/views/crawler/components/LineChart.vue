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
      type: Array,
      required: true
    },
    tableShowLabel:{
      type: Object,
      required: true
    }
    // actualData :  {
    //   type: Array,
    //   required: true
    // },
    // expectedData: {
    //   type: Array,
    //   required: true
    // },
  },
  data() {
    return {
      chart: null,
    }
  },
  // watch: {
  //   chartData: {
  //     deep: true,
  //     handler(val) {
  //       this.setOptions(val)
  //     }
  //   }
  // },
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
        xAxis: {
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
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          type: 'value',
          axisLabel: {
            formatter: this.tableShowLabel.fmt
          }
        },
        legend: {
          data: ['数据']
        },

        toolbox: {
          show: true,
          dataZoom: {
            yAxisIndex: 'none'
          },
          showTitle:true,
           right:'50px',
          feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            },

        },

        series: [
          {
            name: this.tableShowLabel.name,
            smooth: true,
            type: 'line',
            // data: expectedData,
            data: this.chartData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
          },
        ]
      },true)
    }
  },
  watch:{
    chartData(val){
      this.initChart()
    }
  }
}
</script>
