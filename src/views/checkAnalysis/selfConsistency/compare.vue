/*
 * @Author: weilq 
 * @Date: 2020-4-15 14:11:00 
 * @Last Modified by: 
 * @Last Modified time:
 * @Description:  自洽性校验--比对结果
 */
<template>
  <div v-loading="mainLoading" style="color: #141414">
    <el-tabs v-model="activeName">
      <el-tab-pane label="内容对比" name="first">
        <div class="tab-main" style="margin: 0px 30px;">
            <div v-if="uploadFileId" class="clearfix" style="padding: 0 0 10px 0; line-height: 50px;">
              <div class="score-mo" >
                <span class="score-label">分值: </span>
                <span class="score-value">{{score.system}}</span>
              </div>
            </div>
            <div v-else class="clearfix" style="padding: 0 0 10px 0;  line-height: 50px; margin: 0 136px;">
              <div class="score-mo" >
                <span class="score-label">系统分值: </span>
                <span class="score-value">{{score.system}}</span>
              </div>
              <div class="score-mo">
                <span class="score-label">专家评分: </span>
                <el-input class="score-input" v-model="score.manualScore" @change="changeArtificial" />
              </div>
              <div class="score-mo">
                <span class="score-label">综合分值: </span>
                <span class="score-value">{{score.synthesize}}</span>
              </div>
              <div class="score-mo" style="padding-right: 10px;">
                <el-popover
                  placement="left-start"
                  width="500"
                  trigger="hover">
                  <help :system="score.system" :manualScore="score.tempArtificial" 
                    :synthesize="score.synthesize"
                    :s="score.formula.s" :m="score.formula.m" 
                    :x="score.formula.x"></help>
                    <span slot="reference"><svg-icon iconClass="tootip" style="color: #3365b5;" /></span>
                </el-popover>
              </div>
              <div style="line-height: 30px;">
                <el-button class="menu" type="primary" size="small" @click="saveScore" style="width: 93px;">保存</el-button>
              </div>
            </div>
            <div id="compare_main" style="position: relative;">
              <div class="compare_col" :style="{width: `${textWidth}px`, 'background-color': '#ffffff'}">
                <div class="compore-head">
                  <span class="compore-head-title">目标文件</span>
                  <div class="compore-head-line" />
                </div>
                <div ref="compare_left" id="compare_left" @scroll="handleScroll('left')" :style="{height: `${textHeight}px`, 'overflow-y': 'auto', position: 'relative', color: '#666666'}">
                  <div class="compore-file-title">
                    <span>{{sourceFileName}}</span>
                  </div>
                  <div id="compare_left_text" class="compare_textarea" v-html="sourceContent"></div>
                  <div :style="{height: `${ textHeight }px`}"></div>
                  <div id="compare_left_chart" class="compare_shade"></div>
                </div>
              </div>
              <div class="compare_col" style="width: 83px;">
                <div id="compare_middle_chart" style=""></div>
              </div>
              <div class="compare_col" :style="{width: `${textWidth}px`, 'background-color': '#ffffff'}">
                <div class="compore-head">
                  <span class="compore-head-title">对比公文</span>
                  <div class="compore-head-line" />
                </div>
                <div ref="compare_right" id="compare_right" @scroll="handleScroll('right')" :style="{height: `${textHeight}px`, 'overflow-y': 'auto', position: 'relative', color: '#666666'}">
                  <div class="compore-file-title">
                    <span>{{targetFileName}}</span>
                  </div>
                  <div class="line"></div>
                  <div id="compare_right_text" class="compare_textarea" v-html="targetContent"></div>
                  <div :style="{height: `${ textHeight }px`}"></div>
                  <div id="compare_right_chart"  class="compare_shade"></div>
                </div>
              </div>
              <div class="compare_col" style="width: 30px;">
                <div id="compare_node_chart" style=""></div>
              </div>
            </div>
            <div id="compare_score" class="compare_score" v-show="score_show"
              :style="{left: `${textWidth + 40}px`, top: `${score_top}px`}">
                相似度评分: {{score_text}}
            </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="标签对比" name="second">
        <div>
          <compare-table ref="compareTable"></compare-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="帮助" name="third">
        <help :system="score.system" :manualScore="score.tempArtificial" :synthesize="score.synthesize"
              :s="score.formula.s" :m="score.formula.m" :x="score.formula.x"></help>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import compareTable from './compareTable'
import help from './help'
import { baseRequest } from '@/api/base'
import * as d3 from 'd3'
export default {
  components: {
    compareTable,
    help
  },
  props: {},
  computed: {},
  data() {
    return {
      mainLoading: true,
      activeName: 'first',
      textHeight: 400,
      textWidth: 550,

      uploadFileId: null,
      targetFileId: null,
      contrastFileId: null,
      sourceFileName: null,
      targetFileName: null,

      score: {
        actionId: null,
        system: 0, // 系统分值
        manualScore: 0, // 专家评分
        tempArtificial: 0,
        synthesize: 0, // 综合分值
        formula: {
          s: 0.5,
          m: 0.5,
          x: 0
        }
      },

      sourceContent: null,
      targetContent: null,
      checkResult: [],
      sourceResult: [],
      targetResult: [],
      scrollStop: false,

      isCurrent: false,
      score_show: false,
      score_text: 0,
      score_top: 0

    }
  },
  created() {},
  mounted() {
    this.uploadFileId = this.$route.query.uploadFileId
    this.targetFileId = this.$route.query.targetFileId
    this.contrastFileId = this.$route.query.contrastFileId
    this.sourceFileName = this.$route.query.sourceFileName
    this.targetFileName = this.$route.query.targetFileName
    this.score.actionId = this.$route.query.menuId

    const width = document.querySelector('.tab-main').offsetWidth
    this.textWidth = (width - 83 - 30) / 2
    const height = document.querySelector('.app-main').offsetHeight
    this.textHeight = height - 135

    this.$nextTick(function() {
      document.querySelector('.el-tabs__nav-scroll').style.backgroundColor = 'white'
      document.querySelector('.el-tabs__nav-scroll').style.paddingLeft = '30px'

      const x = document.querySelectorAll('.el-tabs__item')
      for (let i = 0; i < x.length; i++) {
        x[i].style.fontSize = '17px'
        x[i].style.fontWeight = 600
      }
      this.getData()
    })
  },
  methods: {
    // 计算综合分值
    changeArtificial(val) {
      if (isNaN(val) || !(parseInt(val) <= 100 && parseInt(val) >= 0)) {
        this.score.manualScore = 0
      }
      this.score.tempArtificial = val
      this.computedScore()
    },
    computedScore() {
      const s = this.score.formula.s
      const m = this.score.formula.m
      const x = this.score.formula.x
      const num = this.score.system * s + this.score.manualScore * m + x
      this.score.synthesize = num.toFixed(2)
    },
    // 保存专家评分
    saveScore() {
      const params = {
        sourceId: this.targetFileId,
        targetId: this.contrastFileId,
        manualScore: this.score.manualScore
      }
      baseRequest('/selfConsistentHis/add', params)
        .then(response => {
          this.$message({
            showClose: true,
            message: '专家评分保存成功',
            type: 'success'
          })
        }, _ => {
          this.$message({
            showClose: true,
            message: '专家评分保存失败',
            type: 'error'
          })
        })
    },
    getData() {
      const params = {
        targetFileId: this.targetFileId,
        uploadFileId: this.uploadFileId,
        contrastFileId: this.contrastFileId,
        actionId: this.score.actionId
      }

      const url = '/wsClient/selfConsCheck'
      baseRequest(url, params).then(response => {
        this.score.system = response.data.item.fraction
        this.score.manualScore = response.data.item.manualScore || 0
        const formula = response.data.item.formula
        if (formula) {
          this.score.formula = formula
        }
        this.score.tempArtificial = this.score.manualScore
        this.computedScore()

        this.mainLoading = false
        const sourceFile = response.data.item.sourceDocContent
        const targetFile = response.data.item.targetDocContent
        const checkResult = response.data.item.checkResult

        const sourceLabelResult = response.data.item.sourceLabelResult
        sourceLabelResult.docFileName = this.sourceFileName
        const targetLabelResult = response.data.item.targetLabelResult
        targetLabelResult.docFileName = this.targetFileName
        this.$refs.compareTable.openDialog(sourceLabelResult, targetLabelResult)
        // 没有比对结果
        if (!checkResult) {
          this.sourceContent = sourceFile
          this.targetContent = targetFile
          this.$nextTick(() => {
            this.computedError()
            this.initMiddleChart()
            this.initNodeChart()
          })
          return
        }
        // 数据处理
        const sourceArray = []
        const targetArray = []
        const sourceSet = new Set()
        const targetSet = new Set()
        checkResult.forEach((d, i) => {
          d.index = i
          d.sourceId = `source${d.OUT_SOURCE_START}-${d.OUT_SOURCE_END}`
          d.targetId = `target${d.OUT_TARGET_START}-${d.OUT_TARGET_END}`

          if (!sourceSet.has(d.sourceId)) {
            sourceArray.push(d)
            sourceSet.add(d.sourceId)
          }

          if (!targetSet.has(d.targetId)) {
            targetArray.push(d)
            targetSet.add(d.targetId)
          }
          this.checkResult.push(d)
        })
        this.sourceResult = sourceArray
        this.targetResult = targetArray

        sourceArray.sort(function(a, b) {
          return a.OUT_SOURCE_START - b.OUT_SOURCE_START
        })
        targetArray.sort(function(a, b) {
          return a.OUT_TARGET_START - b.OUT_TARGET_START
        })

        // 生成目标公文
        let sourceContent = ''
        let sourceIndex = 0
        sourceArray.forEach(d => {
          const sourceId = d.sourceId

          sourceContent += sourceFile.substring(sourceIndex, d.OUT_SOURCE_START)
          sourceContent += `<span id="${sourceId}" class="textarea_error">${sourceFile.substring(d.OUT_SOURCE_START, d.OUT_SOURCE_END)}</span>`
          sourceIndex = d.OUT_SOURCE_END
        })
        sourceContent += sourceFile.slice(sourceIndex)
        this.sourceContent = sourceContent

        // 生成对比公文
        let targetContent = ''
        let targetIndex = 0
        targetArray.forEach(d => {
          const targetId = d.targetId

          targetContent += targetFile.substring(targetIndex, d.OUT_TARGET_START)
          targetContent += `<span id="${targetId}" class="textarea_error">${targetFile.substring(d.OUT_TARGET_START, d.OUT_TARGET_END)}</span>`
          targetIndex = d.OUT_TARGET_END
        })
        targetContent += targetFile.slice(targetIndex)
        this.targetContent = targetContent

        this.$nextTick(() => {
          this.computedError()
          // this.initLeftChart()
          // this.initRightChart()
          this.initMiddleChart()
          this.initNodeChart()

          this.checkResult.forEach(d => {
            const docSource = document.querySelector(`#${d.sourceId}`)
            docSource.addEventListener('click', () => {
              this.clickSourceDiv(d)
            }, false)
          })
        })
      }, _ => {
        this.mainLoading = false
      })
    },
    computedError() {
      this.checkResult.forEach(d => {
        const docSource = document.querySelector(`#${d.sourceId}`)
        d.sourceDiv = docSource
        d.source_offsetTop = docSource.offsetTop
        docSource.style.color = '#037efb'

        const docTarget = document.querySelector(`#${d.targetId}`)
        d.targetDiv = docTarget
        d.target_offsetTop = docTarget.offsetTop
        docTarget.style.color = '#037efb'
      })
    },
    // 中间遮罩
    initMiddleChart() {
      const width = document.querySelector('#compare_middle_chart').offsetWidth
      const height = this.textHeight // document.querySelector('#compare_middle_chart').scrollHeight

      const svg = d3.select('#compare_middle_chart').append('svg')
        .attr('width', width)
        .attr('height', height)

      // 同步滚动
      svg.on('wheel', e => {
        const scale = d3.event.deltaY / 5
        this.$refs.compare_left.scrollTop += scale
        this.$refs.compare_right.scrollTop += scale
      })
        .on('click', _ => {
          if (this.isCurrent) {
            this.defaultStyle()
            this.score_show = false
          }
        })

      const g = svg.append('g')

      const node = g.selectAll('g.node')
        .data(this.checkResult).enter()
        .append('g').classed('node', true)

      node.append('path')
        .attr('d', d => {
          return `M ${0},${d.sourceDiv.offsetTop + d.sourceDiv.offsetHeight / 2}
           L${width},${d.targetDiv.offsetTop + d.targetDiv.offsetHeight / 2}`
        })
        .style('stroke', '#3365b5')
        .style('stroke-width', 2.5)
        .style('cursor', 'pointer')
        .on('click', d => {
          d3.event.preventDefault()
          d3.event.stopPropagation()
          this.clickPath(d)
        })
    },
    // 右侧缩略遮罩
    initNodeChart() {
      const width = document.querySelector('#compare_node_chart').offsetWidth
      const height = this.textHeight
      const scale = height / this.$refs.compare_left.scrollHeight

      const svg = d3.select('#compare_node_chart').append('svg')
        .attr('width', width)
        .attr('height', height)

      const g = svg.append('g')

      const node = g.selectAll('g.node')
        .data(this.sourceResult).enter()
        .append('g')
        .classed('node', true)
        .style('cursor', 'pointer')

      // node.each(d => {
      //   console.log(d.sourceDiv.offsetHeight)
      // })
      node.append('rect')
        .attr('width', width)
        .attr('height', d => d.sourceDiv.offsetHeight * scale)
        .attr('x', 0)
        .attr('y', d => d.sourceDiv.offsetTop * scale)
        .style('stroke', 'red')
        .style('fill', 'white')
        .on('click', d => {
          let scrollTop = d.sourceDiv.offsetTop
          if (scrollTop > this.textHeight / 2) {
            scrollTop -= this.textHeight / 4
          }
          this.$refs.compare_left.scrollTop = scrollTop
          this.updateMiddleChart()
          // this.scrollStop = true
        })
    },
    updateMiddleChart() {
      const width = document.querySelector('#compare_middle_chart').offsetWidth
      const leftScrollTop = this.$refs.compare_left.scrollTop
      const rightScrollTop = this.$refs.compare_right.scrollTop
      const svg = d3.select('#compare_middle_chart').select('svg')

      svg.select('g').selectAll('g.node')
        .select('path')
        .attr('d', d => {
          return `M ${0},${d.sourceDiv.offsetTop + d.sourceDiv.offsetHeight / 2 - leftScrollTop}
           L${width},${d.targetDiv.offsetTop + d.targetDiv.offsetHeight / 2 - rightScrollTop}`
        })
    },
    clickSourceDiv(d) {
      this.defaultStyle()
      d.sourceDiv.style.color = 'red'
      d.sourceDiv.style.border = '1px solid'
      this.isCurrent = true

      const svg = d3.select('#compare_middle_chart').select('svg')
      svg.select('g').selectAll('g.node')
        .style('opacity', node => {
          return node.sourceId === d.sourceId ? 1 : 0.1
        })
    },
    clickPath(d) {
      let scrollTop = d.sourceDiv.offsetTop
      if (scrollTop > this.textHeight / 2) {
        scrollTop -= this.textHeight / 4
      }
      const rightScrollTop = (d.targetDiv.offsetTop + d.targetDiv.offsetHeight / 2) -
            (d.sourceDiv.offsetTop + d.sourceDiv.offsetHeight / 2 - scrollTop)

      this.$refs.compare_left.scrollTop = scrollTop
      this.$refs.compare_right.scrollTop = rightScrollTop
      this.updateMiddleChart()

      this.defaultStyle()
      d.sourceDiv.style.color = 'red'
      d.sourceDiv.style.border = '1px solid'
      d.targetDiv.style.color = 'red'
      d.targetDiv.style.border = '1px solid'

      const svg = d3.select('#compare_middle_chart').select('svg')
      svg.select('g').selectAll('g.node')
        .style('opacity', node => node.index === d.index ? 1 : 0.2)
        .select('path')
        .style('stroke', node => node.index === d.index ? 'red' : '#037efb')

      // 显示相似度评分
      this.score_show = true
      this.score_text = parseInt(d.SCORE * 100)
      this.score_top = d.sourceDiv.offsetTop - scrollTop

      this.isCurrent = true
    },
    handleScroll(type) {
      if (this.scrollStop) {
        console.log('stop')
        return
      }
      this.updateMiddleChart()
    },
    // 恢复到初始样式
    defaultStyle() {
      this.checkResult.forEach(d => {
        d.sourceDiv.style.color = '#037efb'
        d.sourceDiv.style.border = null

        d.targetDiv.style.color = '#037efb'
        d.targetDiv.style.border = null
      })

      const svg = d3.select('#compare_middle_chart').select('svg')
      svg.select('g').selectAll('g.node')
        .style('opacity', 1)
        .select('path')
        .style('stroke', '#037efb')
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu {
    background-color: #3365B5;
    color: white;
  }

  .score-mo {
    float: left;
    padding-right: 50px;
    line-height: 36px;
    .score-label {
      display: block;
      float: left;
      margin-right: 5px;
      height: 30px;
      font-size: 14px;
      color: #141414;
    }
    .score-value {
      display: block;
      float: left;
      height: 30px;
      font-weight: bold;
      font-size: 24px;
      color: #db0b0b;
    }
    .score-input {
      display: block;
      float: left;
      width: 100px;
      height: 36px; 
    }
  }

  .line {
    position: relative;
    display: block;
    width: 100%;
    height: 1px;
    margin: 12px 0;
    background-color: #DCDFE6;
  }

  .tooltip {
    position: relative;
    border: 1px solid #797979;
    color: #FF0000;
    width: 150px;
    height: 90px;
    font-size: 13px;
    line-height: normal;
    text-align:center;
  }
  .tooltip_text {
    position: absolute;
    width: 150px;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .compare_col {
    float: left;
    .compore-head {
      .compore-head-title {
        font-size: 14px;
      }
      .compore-head-line {
        border-bottom: 1px solid #3365b5;
        width: 99px;
        margin-top: 10px;
      }
    }
    .compore-file-title {
      margin: 20px 0 30px 0;
      font-weight: bold;
      color: #141414;
    }
  }

  .textarea_error {
    color: red;
    border: 1px solid;
  }

  .compare_textarea {
    white-space: pre-line;
    word-break: break-word; 
    font-size: 14px; 
    line-height: 150%;
    padding: 0 10px;
  }

  .compare_shade {
    position: absolute;
    top: 0;
    pointer-events: none;
  }

  .compare_scroll {
    margin-top: 36.8px;
    width: 20px;
    border: 1px solid;
  }

  .compare_score {
    position: absolute;
    padding: 5px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #3365b5;
    background: white;
  }

  /deep/ .el-tabs {
    .el-tabs__item.is-active {
      color: #3365b5;
    }
    .el-tabs__active-bar {
      background-color: #3365b5;
    }
  }
  

</style>
