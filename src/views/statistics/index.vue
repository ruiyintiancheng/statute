/*
 * @Author: lk 
 * @Date: 2019-12-24 16:50:14 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-25 10:28:07
 * @Description:  数据统计
 */
<template>
  <div class="statistics-container">
    <div class="statistics-item statistics-first">
          <div class="statistical-screening">
      <div class="screening base-container">
        <el-form class="statistics-options" :inline="true"
                 :model="screenData">
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
                    style="color: #fff;font-size: 14px;font-weight: 700;"
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
            <el-button class="search-btn" type="primary"
                       @click="screenSubmit">查询</el-button>
            <el-button class="search-btn" type="primary"
                       @click="back2Home">重置</el-button>
            <!-- <el-button type="primary"
                       @click="back2Home">返回</el-button> -->
          </el-form-item>
        </el-form>
        <div class="statistics-result clearfix">
          <div class="screening-item">
            <div class="screening-item-quan quan1">
              <div class="screeing-item-value">
                <p>{{totalSum}}</p>
              </div>
            </div>
            <div class="screening-item-text">政策法规总数</div>
          </div>
          <div class="screening-item">
            <div class="screening-item-quan quan2">
              <div class="screeing-item-value">
                <p v-if="!headSwitch">{{fuseTotalSumItem}}</p>
                <p>{{fuseTotalSum}}</p>
              </div>
            </div>
            <div class="screening-item-text">军地政策法规总数</div>
          </div>
          <div class="screening-item">
            <div class="screening-item-quan quan3">
              <div class="screeing-item-value">
                <p v-if="!headSwitch">{{speSumItem}}</p>
                <p>{{speSum}}</p>
              </div>
            </div>
            <div class="screening-item-text">基础政策</div>
          </div>
          <div class="screening-item">
            <div class="screening-item-quan quan4">
              <div class="screeing-item-value">
                <p v-if="!headSwitch">{{basicSumItem}}</p>
                <p>{{basicSum}}</p>
              </div>
            </div>
            <div class="screening-item-text">具体政策</div>
          </div>
          <div class="screening-item">
            <div class="screening-item-quan quan5">
              <div class="screeing-item-value">
                <p v-if="!headSwitch">{{otherSumItem}}</p>
                <p>{{otherSum}}</p>
              </div>
            </div>
            <div class="screening-item-text">其他政策</div>
          </div>
          <!-- <el-col :span="4.8"
                  class="screening-item">
            <div class="imgr">
              <p class="imgr-num">{{totalSum}}</p>
              <p class="imgr-word">政策法规总数</p>
            </div>
          </el-col>
          <el-col :span="4.8"
                  class="screening-item">
            <img src="@/assets/images/all2.png"
                 alt="">
            <div class="imgr">
              <p class="imgr-num"> <template v-if="!headSwitch"><span class="inside-num">{{fuseTotalSumItem}}</span>/</template>{{fuseTotalSum}}</p>
              <p class="imgr-word">军地政策法规总数</p>
            </div>
          </el-col>
          <el-col :span="4.8"
                  class="screening-item">
            <img src="@/assets/images/zhence.png"
                 alt="">
            <div class="imgr">
              <p class="imgr-num"> <template v-if="!headSwitch"><span class="inside-num">{{speSumItem}}</span>/</template>{{speSum}}</p>
              <p class="imgr-word">基础政策</p>
            </div>
          </el-col>
          <el-col :span="4.8"
                  class="screening-item">
            <img src="@/assets/images/renwu.png"
                 alt="">
            <div class="imgr">
              <p class="imgr-num"> <template v-if="!headSwitch"><span class="inside-num">{{basicSumItem}}</span>/</template>{{basicSum}}</p>
              <p class="imgr-word">具体政策</p>
            </div>
          </el-col>
          <el-col :span="4.8"
                  class="screening-item">
            <img src="@/assets/images/more2.png"
                 style="width:66px;height:66px"
                 alt="">
            <div class="imgr">
              <p class="imgr-num"> <template v-if="!headSwitch"><span class="inside-num">{{otherSumItem}}</span>/</template>{{otherSum}}</p>
              <p class="imgr-word">其他政策</p>
            </div>
          </el-col> -->
        </div>
      </div>
      <!-- <el-popover v-if="headSwitch"
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
      </el-popover> -->
    </div>
    </div>
      <div v-show="headSwitch" >
        <div class="statistics-card card1">
          <div class="statistics-card-title base-container">政策法规收录统计</div>
          <div class="statistics-card-context">
            <custom-echarts ref="baosongqingkuangChart"
                            propsHeight="500px"
                            id="baosongqingkuang"
                            :option="baosongqingkuang"></custom-echarts>
          </div>
        </div>
      </div>
      <div v-show="!headSwitch" >
        <div class="statistics-card card1">
          <div class="statistics-card-title base-container">军地政策层级统计</div>
          <div class="statistics-card-context">
            <custom-echarts ref="zhengcecengcitongji"
                            propsHeight="500px"
                            id="zhengcecengcitongji"
                            :option="zhengcecengcitongji"></custom-echarts>
          </div>
        </div>
      </div>
      <div >
        <div class="statistics-card card2">
          <div class="statistics-card-title base-container white">{{headSwitch?'':'军地'}}政策法规逐年发布趋势</div>
          <div class="statistics-card-context" style="width:1200px;">
            <custom-echarts ref="fabuliangqushiChart"
                            propsHeight="500px"
                            id="fabuliangqushi"
                            :option="fabuliangqushi"></custom-echarts>
          </div>
        </div>
      </div>
      <div >
        <div class="statistics-card card3">
          <div class="statistics-card-title base-container">军地公文发布类型统计</div>
          <div class="statistics-card-context">
            <custom-echarts ref="ziduanbaosongtongjiChart"
                            propsHeight="500px"
                            id="ziduanbaosongtongji"
                            :option="ziduanbaosongtongji"></custom-echarts>
          </div>
        </div>
      </div>
      <div >
        <div class="statistics-card card4">
          <div class="statistics-card-title base-container white">军民融合领域</div>
          <div class="statistics-card-context">
            <custom-echarts ref="wentitongjiChart"
                            propsHeight="500px"
                            id="wentitongji"
                            :option="wentitongji"></custom-echarts>
          </div>
        </div>
      </div>
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
      publishStart: null,
      publishEnd: null,
      organization: [], // 发文机构选项
      totalSum: 0, // 综合
      fuseTotalSum: 0, // 总数
      speSum: 0, // 具体
      basicSum: 0, // 基础
      otherSum: 0, // 其他
      fuseTotalSumItem: 0, // 总数
      speSumItem: 0, // 具体
      basicSumItem: 0, // 基础
      otherSumItem: 0, // 基础
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
        this.screenData.date1 = (date.getFullYear() - 10) + ''
        this.screenData.date2 = date.getFullYear() + ''
      })
    },
    // 筛选的确认
    screenSubmit(state) {
      if (this.screenData.Dispatch.length <= 0 && !this.screenData.date1 && !this.screenData.date2) {
        this.back2Home()
        return
      }
      const parma = {}
      parma.issueOrg = this.screenData.Dispatch.length > 0 ? this.screenData.Dispatch[this.screenData.Dispatch.length - 1] : ''
      parma.startDate = this.screenData.date1
      parma.endDate = this.screenData.date2
      this.publishStart = this.screenData.date1
      this.publishEnd = this.screenData.date2
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

        this.fuseTotalSumItem = response.data.item.docSysSum.fuseTotalSum
        this.speSumItem = response.data.item.docSysSum.speSum
        this.basicSumItem = response.data.item.docSysSum.basicSum
        this.otherSumItem = response.data.item.docSysSum.otherSum
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
      console.log(this.publishEnd)
      if (this.publishStart && this.publishEnd) {
        // const name = ''
        if (this.brokenLineDiagramName.length === 1) {
          return [[{
            name: this.brokenLineDiagramName[0],
            xAxis: this.publishStart
          }, {
            xAxis: this.publishEnd
          }]]
        }
        if (this.publishStart < this.publishEnd) {
          if (this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] < this.publishStart || this.brokenLineDiagramName[0] > this.publishEnd) {
            return []
          } else
          if (this.brokenLineDiagramName[0] < this.publishStart && this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] >= this.publishEnd) {
            return [[{
              name: this.publishStart + '-' + this.publishEnd,
              xAxis: this.publishStart
            }, {
              xAxis: this.publishEnd
            }]]
          } else if (this.brokenLineDiagramName[0] > this.publishStart && this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] >= this.publishEnd) {
            return [[{
              name: this.brokenLineDiagramName[0] + '-' + this.publishEnd,
              xAxis: this.brokenLineDiagramName[0]
            }, {
              xAxis: this.publishEnd
            }]]
          } else if (this.brokenLineDiagramName[0] <= this.publishStart && this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] < this.publishEnd) {
            return [[{
              name: this.publishStart + '-' + this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1],
              xAxis: this.publishStart
            }, {
              xAxis: this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1]
            }]]
          } else if (this.brokenLineDiagramName[0] > this.publishStart && this.brokenLineDiagramName[this.brokenLineDiagramName.length - 1] < this.publishEnd) {
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
          data: this.brokenLineDiagramName,
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#ffffff'],
              width: 1,
              type: 'solid',
              opacity: 0.1
            }
          }

        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              opacity: 0.1
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#ffffff'],
              width: 1,
              type: 'solid',
              opacity: 0.1
            }
          }
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
              if (this.publishStart && this.publishEnd) {
                if (this.publishStart === this.publishEnd) {
                  if (params.name === this.publishStart) {
                    return 'red'
                  }
                }
              } else {
                if (this.publishStart) {
                  if (params.name === this.publishStart) {
                    return 'red'
                  }
                } else if (this.publishEnd) {
                  if (params.name === this.publishEnd) {
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
          y: '85%'
        },
        color: ['#13e0ee', '#6341c7', '#25c25c', '#d001fd', '#fd5f4e', '#ff9102', '#0267ff'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['46%', '60%'],
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
          y: '82%'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '60%',
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
          y: '85%'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '60%',
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
      this.startTime()
      this.$nextTick(_ => {
        this.publishStart = null
        this.publishEnd = null
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
        this.otherSum = response.data.item.docSysSum.otherSum
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
  // padding: 0 15px 30px;
  overflow: hidden;
  .statistics-item{
    width: 100%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    &.statistics-first{
      background-image: url('../../assets/images/gl-bg1.jpg');
      background-color: $mainColor;
      height: 538px;
    }
    .statistics-result{
      margin: 108px auto 0;
      width: 1105px;
    }
  }
  .statistical-screening {
    width: 1200px;
    margin: 25px auto 0 auto;
    position: relative;
    // top: 15px;
    // border: 1px solid #ccc;
    .statistics-options{
      margin-top:50px;
      margin-left: 206px;
      .el-form-item__label{
        color: #fff;
      }
      .el-input{
        opacity: 0.4;
      }
      .el-input__inner{
        color: #fff;
        background-color: #1F2D43;
        border: none;
        
      }
      .search-btn{
        background-color: #3365B5;
        border: none;
      }
    }
    .screening {
      // width: 80%;
      // height: 60px;
      // border: 1px solid #000;
      margin: 0 auto;
      .screening-item {
        // height: 60px;
        float: left;
        width: 145px;
        margin-right: 95px;
        &:last-child{
          margin-right: 0;
        }
        .screening-item-quan{
          height: 145px;
          width: 100%;
          position: relative;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 50% 50%;
          &.quan1{
            background-image: url('../../assets/images/quan1.png');
          }
          &.quan2{
            background-image: url('../../assets/images/quan2.png');
          }
          &.quan3{
            background-image: url('../../assets/images/quan3.png');
          }
          &.quan4{
            background-image: url('../../assets/images/quan4.png');
          }
          &.quan5{
            background-image: url('../../assets/images/quan5.png');
          }
          .screeing-item-value{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            p{
              font-size: 24px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #0CD1F7;
            }
          }
        }
        .screening-item-text{
          margin-top:16px;
          font-size: 14px;
          color: #FFFFFF;
          text-align: center;
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
    height: 400px;
    position: relative;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    overflow: hidden;
    &.card1{
      background-image: url('../../assets/images/card1.png');
      height: 575px;
    }
    &.card2{
      background-image: url('../../assets/images/card2.png');
      background-color: $mainColor;
      height: 575px;
    }
    &.card3{
      background-image: url('../../assets/images/card3.png');
      height: 575px;
    }
    &.card4{
      background-image: url('../../assets/images/card4.png');
      background-color: $mainColor;
      height: 575px;
    }

    .statistics-card-title {
      text-align: left;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #141414;
      position: relative;
      letter-spacing: 1px;
      margin-top:50px;
      &.white{
        color: #fff;
      }
      // &::before {
      //   content: "";
      //   width: 6px;
      //   height: 18px;
      //   background-color: #1f73f3;
      //   position: absolute;
      //   top: 10px;
      //   left: -15px;
      // }
    }
    .statistics-card-context{
      width: 1100px;
      margin: 0 auto;
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
