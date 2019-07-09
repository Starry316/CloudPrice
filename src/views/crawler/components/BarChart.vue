<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  const animationDuration = 6000

  export default {
    mixins: [resize],
    props:
      {
        className: {
          type: String,
          default:
            'chart'
        },
        width: {
          type: String,
          default:
            '100%'
        },
        height: {
          type: String,
          default:
            '300px'
        },
        chartData: {
          type: Object,
          required: true
        }
      }
    ,
    data() {
      return {
        chart: null,
        posList: [
          'left', 'right', 'top', 'bottom',
          'inside',
          'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
          'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        ],
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
    }
    ,
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    }
    ,
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },

      setOptions({ expectedData, actualData } = {}){
        this.chart.setOption({
          color: ['#003366','#e5323e'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['expected', 'actual']
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: ['2012', '2013', '2014', '2015', '2016']  //日期更改
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'expected',
              type: 'bar',
              barGap: 0,
              data: [320, 332, 301, 334, 390]
              //data:expectedData
            },
            {
              name: 'actual',
              type: 'bar',
              data: [220, 182, 191, 234, 290]
              ///data:actualData
            },

          ]
        })


      }
    }
  }
</script>
