/*
 * @Author: lk 
 * @Date: 2019-12-24 16:50:14 
 * @Last Modified by: lk
 * @Last Modified time: 2020-06-04 18:10:59
 * @Description:  数据统计
 */
<template>
  <div class="statistics-container">
    <div class="statistical-screening">
      <div class="screening">
        <el-row :gutter="24"
                v-if="headSwitch">
          <el-col :sm="6"
                  :lg="6"
                  class="screening-item">
            <img src="@/assets/images/总量.png"
                 style="width:66px;height:66px"
                 alt="">
            <div class="imgr">
              <p class="imgr-num">{{totalSum}}</p>
              <p class="imgr-word">政策法规总数</p>
              <!-- <span>asdf </span> -->
            </div>
          </el-col>
          <el-col :sm="6"
                  :lg="6"
                  class="screening-item">
            <img src="@/assets/images/all2.png"
                 alt="">
            <div class="imgr">
              <p class="imgr-num">{{fuseTotalSum}}</p>
              <p class="imgr-word">军地政策法规总数</p>
              <!-- <span>asdf </span> -->
            </div>
          </el-col>
          <el-col :sm="6"
                  :lg="6"
                  class="screening-item">
            <img src="@/assets/images/zhence.png"
                 alt="">
            <div class="imgr">
              <p class="imgr-num">{{speSum}}</p>
              <p class="imgr-word">基础政策</p>
              <!-- <span>asdf </span> -->
            </div>
          </el-col>
          <el-col :sm="6"
                  :lg="6"
                  class="screening-item">
            <img src="@/assets/images/renwu.png"
                 alt="">
            <div class="imgr">
              <p class="imgr-num">{{basicSum}}</p>
              <p class="imgr-word">具体政策</p>
              <!-- <span>asdf </span> -->
            </div>
          </el-col>
        </el-row>
        <el-form :inline="true"
                 v-if="!headSwitch"
                 style="position: relative;top:40%;z-index:9999"
                 :model="screenData"
                 class="demo-form-inline">
          <el-form-item label="发文机构 :"
                        style="margin-right:50px">
            <el-cascader v-model="screenData.Dispatch"
                         clearable
                         ref="cascader2"
                         :props="{ checkStrictly: true }"
                         :options="organization"></el-cascader>
          </el-form-item>
          <el-form-item label="发布日期 :"
                        style="margin-right:50px">
            <el-col :span="11">
              <el-date-picker type="year"
                              style="width:115px"
                              placeholder=""
                              value-format='yyyy'
                              v-model="screenData.date1"></el-date-picker>
            </el-col>
            <el-col class="line"
                    style="color: #606266;font-size: 14px;font-weight: 700;"
                    :span="2">&nbsp;至</el-col>
            <el-col :span="11">
              <el-date-picker type="year"
                              placeholder=""
                              value-format='yyyy'
                              v-model="screenData.date2"
                              style="width:115px">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="screenSubmit">查询</el-button>
            <el-button type="primary"
                       @click="back2Home">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-popover v-if="headSwitch"
                  placement="bottom"
                  width="330"
                  class="screening-screen"
                  trigger="click">
        <el-form ref="screen"
                 :model="screenData"
                 label-width="88px">
          <el-form-item label="发文机构 :">
            <el-cascader v-model="screenData.Dispatch"
                         ref="cascader"
                         style="width:215px"
                         clearable
                         :props="{ checkStrictly: true }"
                         :options="organization"></el-cascader>
          </el-form-item>
          <el-form-item label="发布日期 :">
            <el-col :span="11">
              <el-date-picker type="year"
                              placeholder=""
                              value-format='yyyy'
                              v-model="screenData.date1"
                              style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line"
                    style="color: #606266;font-size: 14px;font-weight: 700;position: relative; left: 2px;"
                    :span="2">至</el-col>
            <el-col :span="11">
              <el-date-picker type="year"
                              placeholder=""
                              value-format='yyyy'
                              v-model="screenData.date2"
                              style="width: 100%;">
              </el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item style="margin:0;">
            <el-button type="primary"
                       style="position: relative;left:12%"
                       @click="screenSubmit(1)">确认</el-button>
          </el-form-item>

        </el-form>
        <span slot="reference"
              style="cursor: pointer;">筛选 <i class="el-icon-arrow-down"></i></span>
      </el-popover>
    </div>
    <el-row :gutter="48">
      <el-col v-show="headSwitch"
              :sm="12"
              :lg="12">
        <div class="statistics-card top-card">
          <div class="statistics-card-title">政策法规收录统计</div>
          <div class="statistics-card-context">
            <custom-echarts ref="baosongqingkuangChart"
                            propsHeight="400px"
                            id="baosongqingkuang"
                            :option="baosongqingkuang"></custom-echarts>
          </div>
        </div>
      </el-col>
      <el-col v-show="!headSwitch"
              :sm="12"
              :lg="12">

        <div class="statistics-card top-card">
          <div class="statistics-card-title">政策层级统计</div>
          <div class="statistics-card-context">
            <custom-echarts ref="zhengcecengcitongji"
                            propsHeight="400px"
                            id="zhengcecengcitongji"
                            :option="zhengcecengcitongji"></custom-echarts>
          </div>
        </div>
      </el-col>
      <el-col :sm="12"
              :lg="12">
        <div class="statistics-card top-card">
          <div class="statistics-card-title">政策法规逐年发布趋势</div>
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
          <div class="statistics-card-title">公文发布类型统计</div>
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
          <div class="statistics-card-title">军民融合领域</div>
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
      organization: [], // 发文机构选项
      totalSum: null, // 综合
      fuseTotalSum: null, // 总数
      speSum: null, // 具体
      basicSum: null, // 基础
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
      policyLevelName: null,
      policyLevelValue: null,
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
      zhengcecengcitongji: {}, // 政策层次统计
      ditu: {}, // 地图
      mapData: {}, // 地图数据
      lineBar: {}, // 折线柱状图
      barTittle: '',
      lineTittle: '',
      policyLevelTittle: '',
      pieTittle: '',
      piesTittle: '',
      screenData: {
        Dispatch: [],
        date1: '',
        date2: ''
      },
      headSwitch: true
    }
  },
  watch: {
    'screenData.Dispatch': {
      handler() {
        if (this.$refs.cascader) {
          this.$refs.cascader.dropDownVisible = false
        }
        if (this.$refs.cascader2) {
          this.$refs.cascader2.dropDownVisible = false
        }
      }
    }
  },
  created() {

  },
  mounted() {
    this.startTime()
    this.getOrganization()
    this.getOldOption()
    baseRequest('/userBehaviorColl/add', {
      resourceType: '0'
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
    // 图形查询
    graphicQuery() {

    },
    // 日期初始化
    startTime() {
      const date = new Date()
      this.$nextTick(_ => {
        this.screenData.date1 = date.getFullYear() + ''
        this.screenData.date2 = date.getFullYear() + ''
      })
    },
    // 筛选的确认
    screenSubmit(state) {
      const parma = {}
      parma.issueOrg = this.screenData.Dispatch.length > 0 ? this.screenData.Dispatch[this.screenData.Dispatch.length - 1] : ''
      parma.startDate = this.screenData.date1
      parma.endDate = this.screenData.date2
      if (parma.endDate && parma.startDate) {
        if (parma.startDate > parma.endDate) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'warning'
          })
          return
        }
      }

      if (state) {
        this.headSwitch = false
      }
      // alert(this.screenData.date1)
      baseRequest('/expGroupAnalyse/selectScreenData', parma).then(response => {
        this.policyLevelValue = response.data.item.policyLevelMap.seriesList
        this.policyLevelName = response.data.item.policyLevelMap.legendList
        this.policyLevelTittle = response.data.item.policyLevelMap.title
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
        this.roseShaped()

        this.$nextTick(_ => {
          this.$refs.fabuliangqushiChart.initChart()
          this.$refs.fabuliangqushiChart.chart.resize()
          this.$refs.fabuliangqushiChart.resizeFun()
        })
      })
    },
    resizeChart() {
      for (const key in this.$refs) {
        if (key.endsWith('Chart')) {
          this.$refs[key].chart.resize()
        }
      }
    },
    histogram() { // 柱状图
      this.baosongqingkuang = {
        title: {
          show: !this.histogramValue || this.histogramValue.length === 0,
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fonrSize: 16
          }
        },
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
    segment() {
      if (this.screenData.date1 && this.screenData.date2) {
        // const name = ''
        if (this.brokenLineDiagramName.length === 1) {
          return [[{
            name: this.brokenLineDiagramName[0],
            xAxis: this.screenData.date1
          }, {
            xAxis: this.screenData.date2
          }]]
        }
        if (this.screenData.date1 < this.screenData.date2) {
          if (this.brokenLineDiagramName[0] < this.screenData.date1 && this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] >= this.screenData.date2) {
            return [[{
              name: this.screenData.date1 + '-' + this.screenData.date2,
              xAxis: this.screenData.date1
            }, {
              xAxis: this.screenData.date2
            }]]
          } else if (this.brokenLineDiagramName[0] > this.screenData.date1 && this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] >= this.screenData.date2) {
            return [[{
              name: this.brokenLineDiagramName[0] + '-' + this.screenData.date2,
              xAxis: this.brokenLineDiagramName[0]
            }, {
              xAxis: this.screenData.date2
            }]]
          } else if (this.brokenLineDiagramName[0] <= this.screenData.date1 && this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] < this.screenData.date2) {
            return [[{
              name: this.screenData.date1 + '-' + this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1],
              xAxis: this.screenData.date1
            }, {
              xAxis: this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1]
            }]]
          } else if (this.brokenLineDiagramName[0] > this.screenData.date1 && this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] < this.screenData.date2) {
            return []
          }
        }
        // return [[{
        //   name: name,
        //   xAxis: this.screenData.date1
        // }, {
        //   xAxis: this.screenData.date2
        // }]]
      } else {
        return []
      }
    },
    brokenLineDiagram() { // 近几年发布量趋势
      this.fabuliangqushi = {
        title: {
          show: !this.brokenLineDiagramValue || this.brokenLineDiagramValue.length === 0,
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fonrSize: 16
          }
        },
        // color: ['#209ded'],
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
        // visualMap: {
        //   show: false,
        //   dimension: 2,
        //   pieces: this.segment()
        // },
        series: [{
          data: this.brokenLineDiagramValue,
          markArea: {
            data: this.segment()
          },
          type: 'line',
          itemStyle: {
            color: function(params) {
              if (this.screenData.date1 && this.screenData.date2) {
                if (this.screenData.date1 === this.screenData.date2) {
                  if (params.name === this.screenData.date1) {
                    return 'red'
                  }
                }
              } else {
                if (this.screenData.date1) {
                  if (params.name === this.screenData.date1) {
                    return 'red'
                  }
                } else if (this.screenData.date2) {
                  if (params.name === this.screenData.date2) {
                    return 'red'
                  }
                } else {
                  return '#209ded'
                }
              }
            }.bind(this)
          },
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
        title: {
          show: !this.pieChartValue || this.pieChartValue.length === 0,
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fonrSize: 16
          }
        },
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
        title: {
          show: !this.cakeLikeValue || this.cakeLikeValue.length === 0,
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fonrSize: 16
          }
        },
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
    // zhengcecengcitongji
    roseShaped() {
      this.zhengcecengcitongji = {
        title: {
          show: !this.policyLevelValue || this.policyLevelValue.length === 0,
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fonrSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} {b} : {c} ({d}%)'
        },
        color: ['#8d58ce', '#fd5f4e', '#25c25c', '#64f0f9', '#fda701', '#0267ff'],
        legend: {
          // orient: 'vertical',
          bottom: 'bottom',
          data: this.policyLevelName,
          y: '75%'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            center: ['50%', '40%'],
            // roseType: 'area',
            data: this.policyLevelValue,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        roseType: 'radius'
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
    },
    back2Home() {
      this.headSwitch = true
      this.getOldOption()
      this.$nextTick(_ => {
        this.$refs.baosongqingkuangChart.initChart()
        this.$refs.baosongqingkuangChart.chart.resize()
        this.$refs.baosongqingkuangChart.resizeFun()
        // this.$refs.fabuliangqushiChart.chart.resize()
        // this.$refs.fabuliangqushiChart.chart.dispatchAction({
        //   type: 'highlight',
        //   seriesName: '1988'
        // })
      })
    },
    getOrganization() { // 获取发文机构
      baseRequest('/bCode/getOrgOption').then(response => {
        this.organization = response.data.item
      })
    },
    getOldOption() {
      baseRequest('expGroupAnalyse/selectDataStatistics').then(response => {
        this.totalSum = response.data.item.docSysSum.totalSum
        this.fuseTotalSum = response.data.item.docSysSum.fuseTotalSum
        this.speSum = response.data.item.docSysSum.speSum
        this.basicSum = response.data.item.docSysSum.basicSum
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
        this.roseShaped()
      })
    }
  }
}
</script>
<style lang="scss"> 
.statistics-container {
  background-color: #f9faff;
  padding: 0 15px 30px;
  overflow: hidden;
  .statistical-screening {
    width: 1200px;
    height: 60px;
    margin: 25px auto 0 auto;
    position: relative;
    // top: 15px;
    // border: 1px solid #ccc;
    .screening {
      width: 80%;
      height: 60px;
      // border: 1px solid #000;
      margin: 0 auto;
      .screening-item {
        height: 60px;
        img {
          vertical-align: middle;
          display: inline-block;
        }
        .imgr {
          vertical-align: middle;
          display: inline-block;
          height: 60px;
          line-height: 60px;
          margin-left: 10px;
          // text-align: center;
          .imgr-num {
            height: 20px;
            font-weight: 600;
            // line-height: 20px;
            font-size: 24px;
            margin-bottom: 5px;
            position: relative;
            top: -10px;
          }
          .imgr-word {
            height: 20px;
            position: relative;
            top: -10px;
            color: #48494a;
            // line-height: 20px;
          }
        }
      }
    }
    .screening-screen {
      position: absolute;
      right: 20px;
      top: 50%;
    }
  }
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
