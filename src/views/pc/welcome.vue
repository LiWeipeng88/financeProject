<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="12">
        <div id="chartColumn" ref="myechart" style="width: 100%; height: 500px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="chartColumn" ref="lineoption" style="width: 100%; height: 500px;"></div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  export default {
    data() {
      return {
        crossoption: {
          title: {
            text: '堆叠区域图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['邮件营销', '联盟广告', '视频广告']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '视频广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [150, 232, 201, 154, 190, 330, 410]
            }
          ]
        },
        lineoption: {
          title: {
            text: '经济对比图'
          },
          tooltip: {},
          legend: {
            data: ['支出', '收入']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
              name: '支出',
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar'
            },
            {
              name: '收入',
              data: [220, 280, 250, 180, 90, 160, 170],
              type: 'bar'
            }
          ]
        }
      }
    },
    mounted: function () {
      let myechart = this.$echarts.init(this.$refs.myechart) //初始化一个echarts
      myechart.setOption(this.crossoption) //setOption 用this.option中的数据开始作图
      let echart = this.$echarts.init(this.$refs.lineoption) //初始化一个echarts
      echart.setOption(this.lineoption) //setOption 用this.option中的数据开始作图
    }
  }

</script>
<style scoped>

</style>
