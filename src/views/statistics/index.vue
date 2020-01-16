/*
 * @Author: lk 
 * @Date: 2019-12-24 16:50:14 
 * @Last Modified by: lk
 * @Last Modified time: 2020-01-08 15:58:56
 * @Description:  数据统计
 */
<template>
  <div class="statistics-container">
    <el-row :gutter="48">
      <el-col :sm="12"
              :lg="12">
        <div class="statistics-card top-card">
          <div class="statistics-card-title">{{barTittle}}</div>
          <div class="statistics-card-context">
            <custom-echarts ref="baosongqingkuangChart"
                            propsHeight="400px"
                            id="baosongqingkuang"
                            :option="baosongqingkuang"></custom-echarts>
          </div>
        </div>
      </el-col>
      <el-col :sm="12"
              :lg="12">
        <div class="statistics-card top-card">
          <div class="statistics-card-title">{{lineTittle}}</div>
          <div class="statistics-card-context">
            <custom-echarts ref="fabuliangqushiChart"
                            propsHeight="400px"
                            id="fabuliangqushi"
                            :option="fabuliangqushi"></custom-echarts>
          </div>
        </div>
      </el-col>
      <el-col :sm="12"
              :lg="12">
        <div class="statistics-card">
          <div class="statistics-card-title">{{pieTittle}}</div>
          <div class="statistics-card-context">
            <custom-echarts ref="ziduanbaosongtongjiChart"
                            propsHeight="400px"
                            id="ziduanbaosongtongji"
                            :option="ziduanbaosongtongji"></custom-echarts>
          </div>
        </div>
      </el-col>
      <el-col :sm="12"
              :lg="12">
        <div class="statistics-card">
          <div class="statistics-card-title">{{piesTittle}}</div>
          <div class="statistics-card-context">
            <custom-echarts ref="wentitongjiChart"
                            propsHeight="400px"
                            id="wentitongji"
                            :option="wentitongji"></custom-echarts>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import CustomEcharts from '@/components/Charts/CustomEcharts'
import { baseRequest } from '@/api/base'
export default {
  name: 'statistics',
  components: {
    CustomEcharts
  },
  data() {
    return {
      param: {
        webSite: '',
        beltRoad: '0',
        fieldCodeId: '',
        impleScope: '',
        publishDate: '',
        publishOrg: '',
        systemCodeId: '',
        themeType: ''
      }, // 高级路由的参数
      histogramValue: null, // 柱状图值
      histogramName: null, // 柱状图名
      brokenLineDiagramName: null,
      brokenLineDiagramValue: null,
      pieChartName: null,
      pieChartValue: null,
      cakeLikeName: null,
      cakeLikeValue: null,
      yearTitle: null,
      SetKesDept: {// 自定义  级联选择器value label
        value: 'name',
        label: 'name',
        children: 'children'
      },
      options: [], // 源数据
      baosongqingkuang: {}, // 各部委政策
      fabuliangqushi: {}, // 发布量趋势
      ziduanbaosongtongji: {}, // 字段报送统计
      wentitongji: {}, // 问题统计
      ditu: {}, // 地图
      mapData: {}, // 地图数据
      lineBar: {}, // 折线柱状图
      barTittle: '',
      lineTittle: '',
      pieTittle: '',
      piesTittle: ''
    }
  },
  created() {

  },
  mounted() {
    baseRequest('expGroupAnalyse/selectDataStatistics').then(response => {
      this.histogramValue = response.data.item.ministryPolicyReleaseMap.seriesList
      this.histogramName = response.data.item.ministryPolicyReleaseMap.xAxisList
      this.barTittle = response.data.item.ministryPolicyReleaseMap.title
      this.brokenLineDiagramValue = response.data.item.policyeRleaseTrendMap.seriesList
      this.brokenLineDiagramName = response.data.item.policyeRleaseTrendMap.xAxisList
      this.lineTittle = response.data.item.policyeRleaseTrendMap.title
      this.pieChartValue = response.data.item.docTypeStatisticsMap.seriesList
      this.pieChartName = response.data.item.docTypeStatisticsMap.legendList
      this.pieTittle = response.data.item.docTypeStatisticsMap.title
      this.cakeLikeValue = response.data.item.issueOrgTypeStatisticsMap.seriesList
      this.cakeLikeName = response.data.item.issueOrgTypeStatisticsMap.legendList
      this.piesTittle = response.data.item.issueOrgTypeStatisticsMap.title
      this.histogram()
      this.brokenLineDiagram()
      this.pieChart()
      this.cakeLike()
    })
    // baseRequest('/crawlConInfo/policyeRleaseTrend', {}).then(response => {

    //   this.yearTitle = '近' + response.data.item.xAxisList.length + '年政策发布量趋势'
    // })
    // baseRequest('/crawlConInfo/systemPolicyDistribution').then(response => {

    // })
    // baseRequest('/crawlConInfo/domainPolicyDistribution').then(response => {

    // })
  },
  activated() {
    this.resizeChart()
  },
  methods: {
    resizeChart() {
      for (const key in this.$refs) {
        if (key.endsWith('Chart')) {
          this.$refs[key].chart.resize()
        }
      }
    },
    histogram() { // 柱状图
      this.baosongqingkuang = {
        color: ['#209ded'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            axisLabel: {
              interval: 0,
              rotate: 40
            },
            type: 'category',
            data: this.histogramName,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '13px',
            data: this.histogramValue,
            itemStyle: {
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // barBorderRadius: [10, 10, 10, 10],
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 1, color: '#22f7e3' },
                    { offset: 0.7, color: '#22f7e3' },
                    { offset: 0.1, color: '#1f72f1' }
                  ]
                )
              }
            }
          }
        ]
      }
    },
    brokenLineDiagram() { // 近几年发布量趋势
      this.fabuliangqushi = {
        color: ['#209ded'],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.brokenLineDiagramName
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.brokenLineDiagramValue,
          type: 'line',
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#209ded'
              }, {
                offset: 1,
                color: '#fff'
              }])
            }
          }
        }]
      }
    },
    pieChart() { // 饼状图1
      this.ziduanbaosongtongji = {
        tooltip: {
          trigger: 'item',
          formatter: '{a}{b} : {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          bottom: 'bottom',
          data: this.pieChartName,
          y: '75%'
        },
        color: ['#13e0ee', '#6341c7', '#25c25c', '#d001fd', '#fd5f4e', '#ff9102', '#0267ff'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['38%', '50%'],
            center: ['50%', '40%'],
            data: this.pieChartValue,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    cakeLike() { // 饼状图2
      this.wentitongji = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} {b} : {c} ({d}%)'
        },
        color: ['#8d58ce', '#fd5f4e', '#25c25c', '#64f0f9', '#fda701', '#0267ff'],
        legend: {
          // orient: 'vertical',
          bottom: 'bottom',
          data: this.cakeLikeName,
          y: '75%'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            center: ['50%', '40%'],
            // roseType: 'area',
            data: this.cakeLikeValue,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    convertData(data) {
      var res = []
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.mapData[data[i].name]
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          })
        }
      }
      return res
    },
    openDetail(item, index) {
      if (index === 1) {
        this.$refs.notice.seeView(item)
      } else {
        this.$refs.matter.seeView(item)
      }
    }
  }
}
</script>
<style lang="scss">
.statistics-container {
  background-color: #f9faff;
  padding: 0 15px 30px;
  .statistics-card {
    height: 420px;
    margin-top: 48px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0px 0px 0px #e9f0fe, 0px 0px 20px #e9f0fe, 0 0px 10px #e9f0fe,
      0px 15px 10px #e9f0fe;
    position: relative;
    &.top-card {
      margin-top: 40px;
      .statistics-card-context {
        width: 100%;
        position: absolute;
        top: 5px;
        left: 0;
      }
    }
    .statistics-card-title {
      text-align: left;
      font-weight: bold;
      font-size: 20px;
      height: 40px;
      line-height: 40px;
      margin-left: 40px;
      position: relative;
      letter-spacing: 1px;
      &::before {
        content: "";
        width: 6px;
        height: 18px;
        background-color: #1f73f3;
        position: absolute;
        top: 10px;
        left: -15px;
      }
    }
    .statistics-card-context {
      margin-left: 20px;
      height: 190px;
      p {
        margin: 0;
        height: 52px;
        line-height: 52px;
        font-size: 18px;
      }
    }
  }
  .statistics-status {
    height: 500px;
    overflow: hidden;
    margin-top: 15px;
    background-color: #fff;
    &.statistics-messages {
      background-color: #eff1f4;
      .statistics-panel {
        height: calc(50% - 10px);
        background-color: #fff;
        &:last-child {
          margin-top: 20px;
        }
        .statistics-panel-title {
          height: 60px;
          line-height: 60px;
          font-size: 20px;
          margin: 0;
          padding-left: 10px;
        }
        .statistics-panel-context {
          height: calc(100% - 60px);
          padding: 10px;
          padding-left: 30px;
          overflow: auto;
          a {
            display: block;
            height: 40px;
            line-height: 40px;
            color: #85c1ff;
            text-decoration: underline;
            font-size: 23px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .svgI {
              color: #000;
            }
          }
        }
      }
    }
  }
  .statistics-chart {
    height: 400px;
    margin-top: 15px;
    background-color: #fff;
    textarea {
      height: 95%;
    }
  }
}
</style>
