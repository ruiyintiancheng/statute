<template lang="html">
  <div class="cron">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-if="type === '1'" label="Cron表达式" name="cron">
        <div :val="value_">
          <el-tabs v-model="activeNames">
            <el-tab-pane label="秒" name="s">
              <second-and-minute v-model="sVal" lable="秒"></second-and-minute >
            </el-tab-pane>
            <el-tab-pane label="分" name="m">
              <second-and-minute v-model="mVal" lable="分"></second-and-minute >
            </el-tab-pane>
            <el-tab-pane label="时" name="h">
              <hour v-model="hVal" lable="时"></hour>
            </el-tab-pane>
            <el-tab-pane label="日" name="d">
              <day ref='day' v-model="dVal" lable="日"></day>
            </el-tab-pane>
            <el-tab-pane label="月" name="month">
              <month v-model="monthVal" lable="月"></month>
            </el-tab-pane>
            <el-tab-pane label="周" name="week">
              <week ref='week' v-model="weekVal" lable="周"></week>
            </el-tab-pane>
            <el-tab-pane label="年" name="year">
              <year v-model="yearVal" lable="年"></year>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="type === '2'" label="Simp表达式" name="simp">
        <div :val="simp_">
          <div class="pd-bottom">
            重复次数：<el-input-number v-model="repeatTime" :min="0" :max="100" size="mini" style="width: 100px;"></el-input-number>次
          </div>
          <div>
            重复间隔：<el-input-number v-model="repeatSpace" :min="0" :max="100" size="mini" style="width: 100px;"></el-input-number>秒
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- table -->
    <el-table v-if="type === '1'"
       v-show="showTable"
       :data="tableData"
       size="mini"
       border
       style="width: 100%;">
       <el-table-column
         prop="sVal"
         label="秒"
         width="70">
       </el-table-column>
       <el-table-column
         prop="mVal"
         label="分"
         width="70">
       </el-table-column>
       <el-table-column
         prop="hVal"
         label="时"
         width="70">
       </el-table-column>
       <el-table-column
         prop="dVal"
         label="日"
         width="70">
       </el-table-column>
       <el-table-column
         prop="monthVal"
         label="月"
         width="70">
       </el-table-column>
       <el-table-column
         prop="weekVal"
         label="周"
         width="70">
       </el-table-column>
       <el-table-column
         prop="yearVal"
         label="年">
       </el-table-column>
     </el-table>
     <div style="text-align:left;padding-top:3px;"  v-if="type === '1' || type === '2'">
        <span style="color: #E6A23C; font-size: 12px;">{{cronTip}}</span>
     </div>
  </div>
</template>

<script>
import SecondAndMinute from './cron/secondAndMinute'
import hour from './cron/hour'
import day from './cron/day'
import month from './cron/month'
import week from './cron/week'
import year from './cron/year'
export default {
  props: {
    value: {
      type: String
    },
    // paramData: Object,
    type: String
  },
  data() {
    return {
      cronTip: 'corn从左到右（用空格隔开）：秒 分 小时 月份中的日期 月份 星期中的日期 年份',
      dayFlag: true,
      weekFlag: true,
      cronExpress: '',
      simpExpress: '',
      // defType: '',
      activeName: 'cron',
      activeNames: 's',
      repeatTime: 0,
      repeatSpace: 0,
      showTable: true,
      sVal: '',
      mVal: '',
      hVal: '',
      dVal: '',
      monthVal: '',
      weekVal: '',
      yearVal: ''
    }
  },
  computed: {
    tableData() {
      return [{
        sVal: this.sVal,
        mVal: this.mVal,
        hVal: this.hVal,
        dVal: this.dVal,
        monthVal: this.monthVal,
        weekVal: this.weekVal,
        yearVal: this.yearVal
      }]
    },
    value_() {
      if (!this.dVal && !this.weekVal) {
        return ''
      }
      if (this.dVal === '?' && this.weekVal === '?') {
        this.$message.error('日期与星期不可以同时为“不指定”')
        this.$emit('input', '')
        return
      }
      if (this.dVal !== '?' && this.weekVal !== '?') {
        this.$message.error('日期与星期必须有一个为“不指定”')
        this.$emit('input', '')
        return
      }
      const v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
      if (v !== this.value) {
        this.cronExpress = v
      }
      return v
    },
    simp_() {
      const s = `${this.repeatTime}/${this.repeatSpace}`
      this.simpExpress = s
      return s
    }
  },
  watch: {
    simpExpress(val) {
      this.changeSimp(val)
    },
    cronExpress(val) {
      this.changeCron(val)
    }
  },
  methods: {
    updateVal() {
      if (!this.value) {
        return
      }
      const arrays = this.value.split(' ')
      this.sVal = arrays[0]
      this.mVal = arrays[1]
      this.hVal = arrays[2]
      this.dVal = arrays[3]
      this.monthVal = arrays[4]
      this.weekVal = arrays[5]
      this.yearVal = arrays[6]
    },
    setCornVal(val) {
      if (!val) {
        return
      }
      const arrays = val.split(' ')
      this.sVal = arrays[0]
      this.mVal = arrays[1]
      this.hVal = arrays[2]
      this.dVal = arrays[3]
      this.monthVal = arrays[4]
      this.weekVal = arrays[5]
      this.yearVal = arrays[6]
      this.repeatTime = ''
      this.repeatSpace = ''
    },
    setSimpVal(val) {
      if (!val) {
        return
      }
      const arrays = val.split('/')
      this.repeatTime = arrays[0]
      this.repeatSpace = arrays[1]
      this.sVal = '*'
      this.mVal = '*'
      this.hVal = '*'
      this.dVal = '*'
      this.monthVal = '*'
      this.weekVal = '?'
      this.yearVal = '*'
    },
    handleClick(tab, event) {
      const name = tab.name
      if (name === 'simp') {
        this.showTable = false
        if (this.simpExpress !== '') {
          this.changeSimp(this.simpExpress)
        }
      } else {
        this.showTable = true
        this.changeCron(this.cronExpress)
      }
    },
    changeSimp(val) {
      const result = val.split('/')
      const time = result[0]
      const space = result[1]
      this.cronTip = '重复次数: ' + time + '次, 重复间隔: ' + space + '秒'
    },
    changeCron(val) {
      const resultArry = []
      const result = val.split(' ')
      const year = result[6]
      const week = result[5]
      const month = result[4]
      const day = result[3]
      const hour = result[2]
      const minute = result[1]
      const second = result[0]
      if (val !== '') {
        if (year !== '*' && year !== '?') {
          const years = result[6].split('-')
          if (years[0] === years[1]) {
            resultArry.push(years[0] + '年')
          } else {
            resultArry.push(result[6].replace('-', '年至') + '年')
          }
        } else {
          resultArry.push('')
        }

        if (week !== '?') {
          if (week === '*') {
            resultArry.push('')
          } else {
            if (week.indexOf('-') !== -1) {
              resultArry.push('从星期' + week.replace('-', '至星期'))
            } else if (week.indexOf('/') !== -1) {
              resultArry.push('从星期' + week.replace('/', '开始,每') + '天执行一次')
            } else if (week.indexOf('#') !== -1) {
              resultArry.push('本月第' + week.replace('#', '周,星期'))
            } else if (week.indexOf('L') !== -1) {
              resultArry.push('本月最后一个星期' + week.replace('L', ''))
            } else {
              if (week !== '') {
                resultArry.push('星期' + week.replace(new RegExp(',', 'gm'), ',星期'))
              }
            }
          }
        } else {
          resultArry.push('')
        }

        if (month !== '?') {
          if (month === '*') {
            resultArry.push('')
          } else {
            if (month.indexOf('-') !== -1) {
              resultArry.push('从' + month.replace('-', '月至') + '月')
            } else if (month.indexOf('/') !== -1) {
              resultArry.push('从' + month.replace('/', '月开始,每') + '月执行一次')
            } else {
              resultArry.push(month.replace(new RegExp(',', 'gm'), '月,') + '月')
            }
          }
        } else {
          resultArry.push('')
        }

        if (day !== '?') {
          if (day === '*') {
            resultArry.push('')
          } else if (day.indexOf('-') !== -1) {
            resultArry.push('从' + day.replace('-', '日至') + '日')
          } else if (day.indexOf('/') !== -1) {
            resultArry.push('从' + day.replace('/', '日开始,每') + '日执行一次')
          } else if (day.indexOf('W') !== -1) {
            resultArry.push('本月' + day.replace('W', '号工作日'))
          } else if (day === 'L') {
            resultArry.push('本月最后一天')
          } else {
            if (day !== '') {
              resultArry.push(day.replace(new RegExp(',', 'gm'), '号,') + '号')
            }
          }
        } else {
          resultArry.push('')
        }

        if (hour === '*') {
          resultArry.push('')
        } else {
          if (hour.indexOf('-') !== -1) {
            resultArry.push('从' + hour.replace('-', '时至') + '时')
          } else if (hour.indexOf('/') !== -1) {
            resultArry.push('从' + hour.replace('/', '时开始,每') + '时执行一次')
          } else {
            if (hour !== '') {
              resultArry.push(hour.replace(new RegExp(',', 'gm'), '时,') + '时')
            }
          }
        }

        if (minute === '*') {
          resultArry.push('')
        } else {
          if (minute.indexOf('-') !== -1) {
            resultArry.push('从' + minute.replace('-', '分至') + '分')
          } else if (minute.indexOf('/') !== -1) {
            resultArry.push('从' + minute.replace('/', '分开始,每') + '分执行一次')
          } else {
            if (minute !== '') {
              resultArry.push(minute.replace(new RegExp(',', 'gm'), '分,') + '分')
            }
          }
        }

        if (second === '*') {
          resultArry.push('')
        } else {
          if (second.indexOf('-') !== -1) {
            resultArry.push('从' + second.replace('-', '秒至') + '秒')
          } else if (second.indexOf('/') !== -1) {
            resultArry.push('从' + second.replace('/', '秒开始,每') + '秒执行一次')
          } else {
            if (second !== '') {
              resultArry.push(second.replace(new RegExp(',', 'gm'), '秒,') + '秒')
            }
          }
        }
        this.cronTip = resultArry.join(' ')
      } else {
        this.cronTip = ''
      }
    }
  },
  created() {
    this.updateVal()
  },
  components: {
    SecondAndMinute, hour, day, month, week, year
  }
}
</script>

<style lang="css">
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  height: 100%;
  /* box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04); */
}
.pd-bottom{
  padding-bottom: 5px;
}
</style>
