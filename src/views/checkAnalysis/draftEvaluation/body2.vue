/*
 * @Author: weilq 
 * @Date: 2020-4-15 14:11:00 
 * @Last Modified by: 
 * @Last Modified time:
 * @Description:  自洽性校验--比对结果
 */
<template>
  <div v-loading="mainLoading">
        <div class="tab-main" :style="{height: `${mainHeight}px`, position: 'relative'}">
            <div style="padding: 0 0 10px 0;  line-height: 50px;">
              <h2>分值: <span style="color: red;">{{fraction}}</span></h2>
            </div>
            <div id="compare_main" style="position: relative;">
              <div class="compare_col" :style="{width: `${textWidth}px`, 'background-color': '#ffffff'}">
                <div ref="compare_left" id="compare_left" @scroll="handleScroll('left')" :style="{height: `${textHeight}px`, 'overflow-y': 'auto', position: 'relative', color: 'gray'}">
                  <div style="font-size: 16px; padding: 10px 10px 0;">
                    <span style="font-weight: 600; color: black;">目标文件: </span>
                    <span>{{$route.params.sourceFileName}}</span>
                  </div>
                  <div class="line"></div>
                  <div class="compare_textarea" v-html="sourceSummary"></div>
                  <div class="line"></div>
                  <div class="compare_textarea" v-html="sourceHtml"></div>
                  <div :style="{height: `${ textHeight }px`}"></div>
                  <!-- <div id="compare_left_chart" class="compare_shade"></div> -->
                </div>
              </div>
              <div class="compare_col" :style="{width: '150px'}">
                <div id="compare_middle_chart" style=""></div>
              </div>
              <div class="compare_col" :style="{width: `${textWidth}px`, 'background-color': '#ffffff'}">
                <div ref="compare_right" id="compare_right" @scroll="handleScroll('right')" :style="{height: `${textHeight}px`, 'overflow-y': 'auto', position: 'relative', color: 'gray'}">
                  <div style="font-size: 16px; padding: 10px 5px 0 5px;">
                    <span style="font-weight: 600; color: black;">对比公文: </span>
                    <span>{{$route.params.targetFileName}}</span>
                  </div>
                  <div class="line"></div>
                  <div class="compare_textarea" v-html="targetSummary"></div>
                   <div class="line"></div>
                  <div class="compare_textarea" v-html="targetHtml"></div>
                  <div :style="{height: `${ textHeight }px`}"></div>
                  <!-- <div id="compare_right_chart"  class="compare_shade"></div> -->
                </div>
              </div>
              <div class="compare_col" style="width: 30px;">
                <div id="compare_node_chart" style=""></div>
              </div>
            </div>
            <div id="compare_score" class="compare_score" v-show="score_show"
              :style="{left: `${textWidth + 15}px`, top: `${score_top}px`}">
                相似度评分: {{score_text}}
            </div>
        </div>
  </div>
</template>

<script>
import { baseRequest } from '@/api/base'
import * as d3 from 'd3'
export default {
  components: {},
  props: {},
  computed: {},
  data() {
    return {
      mainLoading: true,
      mainHeight: 400,
      textHeight: 400,
      textWidth: 550,

      uploadFileId: null,
      contrastFileId: null,

      fraction: null,
      index: 0,
      sourceSummary: '',
      targetSummary: '',
      sourceHtml: '',
      targetHtml: '',
      checkResult: [],
      sourceResult: [],
      // targetResult: [],
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
    this.contrastFileId = this.$route.query.contrastFileId

    const width = document.querySelector('.tab-main').offsetWidth
    this.textWidth = (width - 150 - 30) / 2 - 10
    const height = document.querySelector('.app-main').offsetHeight
    this.mainHeight = height - 40
    this.textHeight = height - 100

    this.$nextTick(function() {
      this.getData()
    })
  },
  methods: {
    getData() {
      const params = {
        uploadFileId: this.uploadFileId,
        contrastFileId: this.contrastFileId
      }

      baseRequest('/wsClient/operabilityAndSummary', params).then(response => {
        this.fraction = response.data.item.fraction
        this.mainLoading = false

        this.computeSummary(response.data.item)
        this.computeResult(response.data.item)

        this.$nextTick(() => {
          this.computedError()
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
    // 比对摘要
    computeSummary(item) {
      const sourceFile = item.SOURCE_SUMMARY
      const targetFile = item.TARGET_SUMMARY
      const checkResult = item.checkSummaryResult

      if (!checkResult || checkResult.length === 0) {
        this.sourceSummary = sourceFile
        this.targetSummary = targetFile
        return
      }
      // 数据处理
      const sourceArray = []
      const targetArray = []
      const sourceSet = new Set()
      const targetSet = new Set()
      checkResult.forEach((d, i) => {
        d.index = this.index++
        d.sourceId = `sourceSummary${d.OUT_SOURCE_START}-${d.OUT_SOURCE_END}`
        d.targetId = `targetSummary${d.OUT_TARGET_START}-${d.OUT_TARGET_END}`

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
      this.sourceResult = [...sourceArray, ...this.sourceResult]
      // this.targetResult = targetArray

      sourceArray.sort(function(a, b) {
        return a.OUT_SOURCE_START - b.OUT_SOURCE_START
      })
      targetArray.sort(function(a, b) {
        return a.OUT_TARGET_START - b.OUT_TARGET_START
      })

      // 生成目标公文
      let sourceHtml = ''
      let sourceIndex = 0
      sourceArray.forEach(d => {
        const sourceId = d.sourceId

        sourceHtml += sourceFile.substring(sourceIndex, d.OUT_SOURCE_START)
        sourceHtml += `<span id="${sourceId}" class="textarea_error">${sourceFile.substring(d.OUT_SOURCE_START, d.OUT_SOURCE_END)}</span>`
        sourceIndex = d.OUT_SOURCE_END
      })
      sourceHtml += sourceFile.slice(sourceIndex)

      // 生成对比公文
      let targetHtml = ''
      let targetIndex = 0
      targetArray.forEach(d => {
        const targetId = d.targetId

        targetHtml += targetFile.substring(targetIndex, d.OUT_TARGET_START)
        targetHtml += `<span id="${targetId}" class="textarea_error">${targetFile.substring(d.OUT_TARGET_START, d.OUT_TARGET_END)}</span>`
        targetIndex = d.OUT_TARGET_END
      })
      targetHtml += targetFile.slice(targetIndex)

      this.sourceSummary = sourceHtml
      this.targetSummary = targetHtml
    },
    // 比对内容
    computeResult(item) {
      const sourceFile = item.sourceDocContent
      const targetFile = item.targetDocContent
      const checkResult = item.checkResult

      if (!checkResult || checkResult.length === 0) {
        this.sourceHtml = sourceFile
        this.targetHtml = targetFile
        return
      }
      // 数据处理
      const sourceArray = []
      const targetArray = []
      const sourceSet = new Set()
      const targetSet = new Set()
      checkResult.forEach((d, i) => {
        d.index = this.index++
        d.sourceId = `sourceDoc${d.OUT_SOURCE_START}-${d.OUT_SOURCE_END}`
        d.targetId = `targetDoc${d.OUT_TARGET_START}-${d.OUT_TARGET_END}`

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
      // this.sourceResult = sourceArray
      this.sourceResult = [...sourceArray, ...this.sourceResult]
      // this.targetResult = targetArray

      sourceArray.sort(function(a, b) {
        return a.OUT_SOURCE_START - b.OUT_SOURCE_START
      })
      targetArray.sort(function(a, b) {
        return a.OUT_TARGET_START - b.OUT_TARGET_START
      })

      // 生成目标公文
      let sourceHtml = ''
      let sourceIndex = 0
      sourceArray.forEach(d => {
        const sourceId = d.sourceId

        sourceHtml += sourceFile.substring(sourceIndex, d.OUT_SOURCE_START)
        sourceHtml += `<span id="${sourceId}" class="textarea_error">${sourceFile.substring(d.OUT_SOURCE_START, d.OUT_SOURCE_END)}</span>`
        sourceIndex = d.OUT_SOURCE_END
      })
      sourceHtml += sourceFile.slice(sourceIndex)

      // 生成对比公文
      let targetHtml = ''
      let targetIndex = 0
      targetArray.forEach(d => {
        const targetId = d.targetId

        targetHtml += targetFile.substring(targetIndex, d.OUT_TARGET_START)
        targetHtml += `<span id="${targetId}" class="textarea_error">${targetFile.substring(d.OUT_TARGET_START, d.OUT_TARGET_END)}</span>`
        targetIndex = d.OUT_TARGET_END
      })
      targetHtml += targetFile.slice(targetIndex)

      this.sourceHtml = sourceHtml
      this.targetHtml = targetHtml
    },
    // 计算标识信息
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
        d3.event.preventDefault()
        d3.event.stopPropagation()
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
        .style('stroke', '#037efb')
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
    },
    getLength(str) {
      var b = 0
      const l = str.length // 初始化字节数递加变量并获取字符串参数的字符个数
      if (l) { // 如果存在字符串，则执行计划
        for (var i = 0; i < l; i++) { // 遍历字符串，枚举每个字符
          if (str.charCodeAt(i) > 255) { // 字符编码大于255，说明是双字节字符
            b += 2 // 则累加2个
          } else {
            b++ // 否则递加一次
          }
        }
        return b // 返回字节数
      }
      return 0 // 如果参数为空，则返回0个
    }
  }
}
</script>

<style scoped>
  .menu {
    background-color: #3164b7;
    color: white;
  }

  .score.mo {
    /* float: left; */
    padding-right: 50px;
    font-size: 1.3em;
    font-weight: bold;
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
  }

  .textarea_error {
    color: red;
    border: 1px solid;
  }

  .compare_textarea {
    white-space: pre-line; 
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
    color: #037efa;
    background: white;
  }
</style>