/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-18 14:06:38
 * @Description:  登录日志
 */
<template>
  <div class="list-comtainer">
    <div class="">
      <div class="row-botton new clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <!-- <div class="row-option">
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div> -->
      </div>
      <div v-show="searchToggle"
           class="form-search new bottom">
        <el-form :inline="true"
                 class="demo-table-expand">
            <el-form-item class="input-order">
              <span class="input-label">登录名:</span>
              <el-input v-model.trim="loginName"
                         style="width:150px"
                         clearable
                         placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item class="input-order">
              <span class="input-label">日期类型:</span>
              <el-select v-model.trim="dateType"
                         style="width:80px"
                         @change="dataTypeChangeHandle"
                         placeholder="">
                  <el-option value="0" label="日"></el-option>
                  <el-option value="1" label="月"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="input-order">
              <span class="input-label">登录时间:</span>
              <el-date-picker v-model.trim="startLoginDate"
                         style="width:150px"
                         :type="dateTypeOption"
                         :format="dateFormat"
                         :value-format="dateFormat"
                         placeholder="开始日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="input-order">
              <span class="input-label">-&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-date-picker v-model.trim="endLoginDate"
                         style="width:150px"
                         :type="dateTypeOption"
                         :format="dateFormat"
                         :value-format="dateFormat"
                         placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="input-order">
                <el-button icon="el-icon-search"
                     @click="searchOption()"
                     type="primary">查询</el-button>
                             <el-button icon="el-icon-refresh"
                     @click="reset"
                     >重置</el-button>
                             <el-button icon="el-icon-bottom" :loading="exportLoading"
                     @click="downloadHandle"
                     >导出</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-loading="loading">
      <el-tabs v-model="activeName" type="card" @tab-click="tabsClickHandle">
          <el-tab-pane label="访问统计图" name="chart">
              <custom-echarts ref="chartOption"
                            :propsHeight="tableHeight+'px'"
                            propsWidth="100%"
                            id="chartOption"
                            :option="chartOption"></custom-echarts>
          </el-tab-pane>
          <el-tab-pane label="访问明细" name="table">
            <div>
              <el-table :data="data"
                        v-show="tableToggle"
                        border
                        :height="tableHeight">
                                  <el-table-column 
                                label="编号"
                                align="center"
                                type="index"
                                width="50">
                </el-table-column>
                <el-table-column prop="loginName"
                                label="用户名"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="ipAddress"
                                label="登录ip"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="loginDate"
                                label="登录时间"
                                align="center"
                                min-width="200">
                </el-table-column>
              </el-table>
              <el-pagination background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageNo"
                            :total="total"
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-sizes="[10,15,20]"
                            :page-size="pageSize">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>
<script>
import { baseSearch } from '@/api/base'
import echarts from 'echarts'
import CustomEcharts from '@/components/Charts/CustomEcharts'
import { basicDownload } from '@/utils/download'
export default {
  filters: {
  },
  components: {
    CustomEcharts
  },
  data() {
    return {
      loading: false,
      exportLoading: false,
      chartOption: {},
      xAxisList: null,
      seriesList: null,
      activeName: 'chart',
      pageNo: 1,
      total: null,
      pageSize: 15,
      loginName: '', // 列表查询参数
      dateType: '1',
      startLoginDate: null,
      endLoginDate: null,
      dateTypeOption: 'month',
      dateFormat: 'yyyy-MM',
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: []
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 375
    }
  },
  mounted() {
    this.searchOption()
    // this.getTableHeight()
  },
  watch: {
    searchToggle() {
      // this.getTableHeight()
    }
  },
  methods: {
    reset() {
      this.loginName = ''
      this.dateType = '1'
      this.dateTypeOption = 'month'
      this.dateFormat = 'yyyy-MM'
      this.startLoginDate = null
      this.endLoginDate = null
      this.searchOption()
    },
    tabsClickHandle(tab) {
      if (this.activeName === 'chart') {
        this.$nextTick(_ => {
          this.getChart()
        })
      }
    },
    dataTypeChangeHandle(val) {
      this.startLoginDate = null
      this.endLoginDate = null
      if (val === '0') {
        this.dateTypeOption = 'date'
        this.dateFormat = 'yyyy-MM-dd'
      } else {
        this.dateTypeOption = 'month'
        this.dateFormat = 'yyyy-MM'
      }
    },
    getTableHeight() {
      this.$nextTick(_ => {
        this.tableHeight = document.body.offsetHeight - 300
      })
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    },
    searchOption(page) {
      if (this.startLoginDate && this.endLoginDate && this.startLoginDate + '' > this.endLoginDate + '') {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      if (!page) {
        this.pageNo = 1
      }
      this.loading = true
      const param = {
        loginName: this.loginName,
        dateType: this.dateType,
        startLoginDate: this.startLoginDate,
        endLoginDate: this.endLoginDate,
        pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      baseSearch('/userLogin/selects', param).then(response => {
        this.data = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
        baseSearch('/userLogin/getLineData', param).then(response => {
          this.seriesList = response.data.item.seriesList
          this.xAxisList = response.data.item.xAxisList
          this.loading = false
          this.getChart()
        })
      })
    },
    downloadHandle() {
      if (this.startLoginDate && this.endLoginDate && this.startLoginDate + '' > this.endLoginDate + '') {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      this.exportLoading = true
      const params = {
        loginName: this.loginName,
        dateType: this.dateType,
        startLoginDate: this.startLoginDate,
        endLoginDate: this.endLoginDate
      }
      basicDownload('/userLogin/export', params).then(_ => {
        this.exportLoading = false
      }, _ => {
        this.exportLoading = false
      })
    },
    getChart() {
      this.chartOption = {
        title: {
          subtext: '登陆人数'
        },
        grid: {
          top: '50px',
          left: '90px',
          right: '40px',
          bottom: '40px',
          comtainLabel: true
        },
        color: ['#209ded'],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.xAxisList
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} (个)'
          }
        },
        series: [{
          data: this.seriesList,
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
    }
  }
}
</script>
<style lang="scss" scoped>
.form-search.new.bottom{
    border-bottom: 1px solid #E4E4E4;
}
</style>