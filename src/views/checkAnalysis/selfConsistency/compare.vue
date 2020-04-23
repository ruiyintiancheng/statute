/*
 * @Author: weilq 
 * @Date: 2020-4-15 14:11:00 
 * @Last Modified by: 
 * @Last Modified time:
 * @Description:  自洽性校验--比对结果
 */
<template>
  <div style="padding: 10px;" v-loading="mainLoading">
    <el-tabs v-model="activeName">
      <el-tab-pane label="内容对比" name="first">
        <div>
          <div>
            <div style="padding: 5px 0;"><h2>分值: <span style="color: red;">XXX</span></h2></div>
            <div id="compare_main" style="position: relative;">
              <div class="compare_col" :style="{width: `${textWidth}px`, 'background-color': '#ffffff'}">
                <div ref="compare_left" id="compare_left" @scroll="handleScroll('left')" :style="{height: `${textHeight}px`, 'overflow-y': 'auto', position: 'relative', color: 'gray'}">
                  <div style="font-size: 16px; padding: 10px 5px 0 5px;">
                    <span style="font-weight: 600; color: black;">目标文件: </span>
                    <span>{{sourceFileName}}</span>
                  </div>
                  <div class="line"></div>
                  <div id="compare_left_text" class="compare_textarea" v-html="sourceContent"></div>
                  <div :style="{height: `${ textHeight }px`}"></div>
                  <div id="compare_left_chart" class="compare_shade"></div>
                </div>
              </div>
              <div class="compare_col" :style="{width: '150px'}">
                <div id="compare_middle_chart" style=""></div>
              </div>
              <div class="compare_col" :style="{width: `${textWidth}px`, 'background-color': '#ffffff'}">
                <div ref="compare_right" id="compare_right" @scroll="handleScroll('right')" :style="{height: `${textHeight}px`, 'overflow-y': 'auto', position: 'relative', color: 'gray'}">
                  <div style="font-size: 16px; padding: 10px 5px 0 5px;">
                    <span style="font-weight: 600; color: black;">对比公文: </span>
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
              :style="{left: `${textWidth + 10}px`, top: `${score_top}px`}">
                相似度评分: {{score_text}}
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="标签对比" name="second">
        <div>
          <compare-table ref="compareTable"></compare-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import compareTable from './compareTable'
import { baseRequest } from '@/api/base'
import * as d3 from 'd3'
export default {
  components: {
    compareTable
  },
  props: {

  },
  computed: {

  },
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

      sourceContent: null,
      targetContent: null,
      checkResult: [],
      sourceResult: [],
      targetResult: [],
      scrollStop: false,

      currentNode: null,
      score_show: false,
      score_text: 0,
      score_top: 0

    }
  },
  created() {
  },
  mounted() {
    this.uploadFileId = this.$route.query.uploadFileId
    this.targetFileId = this.$route.query.targetFileId
    this.contrastFileId = this.$route.query.contrastFileId
    this.sourceFileName = this.$route.query.sourceFileName
    this.targetFileName = this.$route.query.targetFileName

    const width = document.querySelector('.app-main').offsetWidth
    this.textWidth = (width - 150 - 30) / 2 - 20
    const height = document.querySelector('.app-main').offsetHeight
    this.textHeight = height - 115
    this.$nextTick(function() {
      this.getData()
    })
  },
  methods: {
    getSize() {
      // const source = document.querySelector('#source_textarea')
      // console.log('source实际高度', source.scrollHeight)
      // console.log('source滚动高度', source.scrollTop)
      // console.log('source当前高度', source.offsetHeight)

      // const target = document.querySelector('#target_textarea')
      // console.log('target实际高度', target.scrollHeight)
      // console.log('target滚动高度', target.scrollTop)
      // console.log('target当前高度', target.offsetHeight)
    },
    getData() {
      const params = {
        targetFileId: this.targetFileId,
        uploadFileId: this.uploadFileId,
        contrastFileId: this.contrastFileId
      }
      const url = '/wsClient/selfConsCheck'
      // const url = 'http://localhost:8090/demo/json'
      baseRequest(url, params).then(response => {
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
        checkResult.forEach(d => {
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
        // docSource.style.border = '1px solid'

        const docTarget = document.querySelector(`#${d.targetId}`)
        d.targetDiv = docTarget
        d.target_offsetTop = docTarget.offsetTop
        docTarget.style.color = '#037efb'
        // docTarget.style.border = '1px solid'
      })
    },
    // 左侧上传栏遮罩
    initLeftChart() {
      const width = document.querySelector('#compare_left_text').offsetWidth
      const height = document.querySelector('#compare_left_text').scrollHeight
      const svg = d3.select('#compare_left_chart').append('svg')
        .attr('width', width)
        .attr('height', height)

      const g = svg.append('g')
      const node = g.selectAll('g.node')
        .data(this.checkResult, d => d.sourceId).enter()
        .append('g').classed('node', true)
      node.append('rect')
        .attr('width', this.textWidth)
        .attr('height', d => d.sourceDiv.offsetHeight)
        .attr('x', 0)
        .attr('y', d => d.sourceDiv.offsetTop)
        .style('fill', 'gray')
        .style('opacity', 0)
    },
    // 右侧目标栏遮罩
    initRightChart() {
      const width = document.querySelector('#compare_right_text').offsetWidth
      const height = document.querySelector('#compare_right_text').scrollHeight

      const svg = d3.select('#compare_right_chart').append('svg')
        .attr('width', width)
        .attr('height', height)

      const g = svg.append('g')
      const node = g.selectAll('g.node')
        .data(this.checkResult, d => d.targetId).enter()
        .append('g').classed('node', true)

      node.append('rect')
        .attr('width', this.textWidth)
        .attr('height', d => d.targetDiv.offsetHeight)
        .attr('x', 0)
        .attr('y', d => d.targetDiv.offsetTop)
        .style('fill', 'gray')
        .style('opacity', 0)
    },
    // 中间遮罩
    initMiddleChart() {
      const width = document.querySelector('#compare_middle_chart').offsetWidth
      const height = this.textHeight // document.querySelector('#compare_middle_chart').scrollHeight

      const svg = d3.select('#compare_middle_chart').append('svg')
        .attr('width', width)
        .attr('height', height)

      const g = svg.append('g')

      const scoreg = g.append('g').classed('score', true)
      scoreg.append('text').attr('text-anchor', 'middle')

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
        // .on('mousemove', function(d) {
        //   d3.select(this).style('stroke-width', 3)
        // })
        // .on('mouseout', function(d) {
        //   d3.select(this).style('stroke-width', 1)
        // })
        .on('click', d => {
          let scrollTop = d.sourceDiv.offsetTop
          if (scrollTop > this.textHeight / 2) {
            scrollTop -= this.textHeight / 4
          }
          const rightScrollTop = (d.targetDiv.offsetTop + d.targetDiv.offsetHeight / 2) -
            (d.sourceDiv.offsetTop + d.sourceDiv.offsetHeight / 2 - scrollTop)

          this.$refs.compare_left.scrollTop = scrollTop
          this.$refs.compare_right.scrollTop = rightScrollTop
          this.updateMiddleChart()

          if (this.currentNode) {
            this.currentNode.sourceDiv.style.color = '#037efb'
            this.currentNode.sourceDiv.style.border = null
            this.currentNode.targetDiv.style.color = '#037efb'
            this.currentNode.targetDiv.style.border = null
          }
          this.currentNode = d

          d.sourceDiv.style.color = 'red'
          d.sourceDiv.style.border = '1px solid'
          d.targetDiv.style.color = 'red'
          d.targetDiv.style.border = '1px solid'

          // 显示相似度评分
          this.score_show = true
          this.score_text = parseInt(d.SCORE * 100)
          this.score_top = d.sourceDiv.offsetTop - scrollTop
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
    handleScroll(type) {
      if (this.scrollStop) {
        console.log('stop')
        return
      }
      this.updateMiddleChart()
      // if (type === 'left') {
      //   const scrollTop = this.$refs.compare_left.scrollTop
      //   this.$refs.compare_right.scrollTop = scrollTop
      //   this.updateMiddleChart()
      // }
      // if (type === 'right') {
      //   const scrollTop = this.$refs.compare_right.scrollTop
      //   this.$refs.compare_left.scrollTop = scrollTop
      //   this.updateMiddleChart()
      // }

      // console.log()
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
      } else {
        return 0 // 如果参数为空，则返回0个
      }
    }
  }
}
</script>

<style scoped>
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
    padding: 0 5px;
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
