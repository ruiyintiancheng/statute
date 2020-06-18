/*  
* 堆栈图
*/
<template>
  <div>
    <div style="width: 100%; height:100%; position: relative">
      <div v-loading="chartLoading">
        <div id="chart" ref="chart" :style="{'width': `${chart_width}px`, 'height': `${chart_height}px`}"></div>
        <div id="brush"></div>
        <div ref="legend"></div>
      </div>
      <!-- 展开按钮 -->
      <div class="graph-toolbar-open" ref="toolbarSwitch" @click="clickToolbar">
        <div v-show="!toolbarShow" class="graph-web-toolbar-switch"><i class="el-icon-d-arrow-left"></i></div>
        <div v-show="toolbarShow" class="graph-web-toolbar-switch"><i class="el-icon-d-arrow-right"></i></div>
      </div>
      <!-- 选项菜单 -->
      <div class="graph-toolbar" v-show="toolbarShow">
        <div class="graph-web-toolbar">
          <ul class="clearfix">
            <li :class="activeName === '筛选'? 'active' : null " @click="activeName='筛选'"><div class="text  no-text-select">筛选</div></li>
            <li :class="activeName === '帮助'? 'active' : null " @click="activeName='帮助'"><div class="text  no-text-select">帮助</div></li>
            <!-- <li :class="activeName === '政策列表'? 'active' : null " @click="clickInfo"><div class="text">政策列表</div></li> -->
            <!-- <li @click="clickTypeSwitch"><div class="text  no-text-select">切换年/月</div></li> -->
            <!-- <li v-show="toolbarShow" @click="clickToolbar"><div class="text no-text-select">收起</div></li> -->
          </ul>
        </div>
        <div class="graph-web-tabpane" :style="{width: `${toolbarWidth}px`}">
          <relation-pane ref="relation" v-show="activeName==='筛选'" :width="toolbarWidth" :height="toolbarHeight" @selRelation="selRelation"></relation-pane>
          <explain-pane v-show="activeName==='帮助'" :width="toolbarWidth" :height="toolbarHeight"></explain-pane>
        </div>
      </div>
      
      <!-- 鼠标悬浮提示框 -->
      <div id="title" ref="title" class="title">
        <div style="min-height: 17px;">
          <div class='title-head'>发布时间: </div>
          <div class="title-content"></div>
        </div>
        <div style="min-height: 17px;">
          <div class='title-head'>新任务: </div>
          <div class="title-content"></div>
        </div>
        <div style="min-height: 17px;">
          <div class='title-head'>其它: </div>
          <div class="title-content"></div>
        </div>
      </div>
      <nodes-table ref="nodesTable"></nodes-table>
    </div>
  </div>
</template>

<script>
import { baseRequest } from '@/api/base'
import nodesTable from './components/nodesTable'
import relationPane from './components/relation'
import explainPane from './components/explain'
import infoPane from './components/infoPane'
import * as Chart from './components/chart/chart.js'
import { legends } from './components/legend'
import * as d3 from 'd3'
export default {
  components: {
    nodesTable,
    relationPane,
    explainPane,
    infoPane
  },
  props: {

  },
  computed: {
    // chart_width() {
    //   return document.querySelector('.app-main').offsetWidth - 40
    // },
    // chart_height() {
    //   return document.querySelector('.app-main').offsetHeight - 30
    // },
    table_height() {
      return this.height - 40
    }
    // toolbarHeight() {
    //   return document.querySelector('.app-main').offsetHeight
    // }
  },
  data() {
    return {
      graph: null,
      chartLoading: true,
      width: 1000,
      height: 1000,

      activeName: '筛选',
      toolbarShow: false,
      chart_width: 0,
      chart_height: 0,
      toolbarWidth: 240,
      toolbarHeight: 0
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.getSize()
      this.init()
      document.querySelector('.el-tabs__header.is-top').style.display = 'none'
    })
  },
  methods: {
    getSize() {
      this.chart_width = document.querySelector('.app-main').offsetWidth
      this.chart_height = document.querySelector('.app-main').offsetHeight - 50
      this.toolbarHeight = this.chart_height - 54
    },
    init() {
      this.graph = true
      Chart.setCfg({
        container: this.$refs.chart,
        width: this.chart_width,
        height: this.chart_height,
        background: '#F3F3F3',
        nodeClick: this.openList,
        nodeMove: this.nodeMove
      })

      legends({
        container: this.$refs.legend,
        width: this.chart_width,
        height: 50
      })
      this.$refs.relation.selectAll()
    },
    getData(param) {
      param.dateType = 'year'
      this.chartLoading = true
      // const data = handleData(param)
      // console.log(param)
      baseRequest('/bDocBasic/timelinessSter', param).then(response => {
        const data = response.data.item
        Chart.data(data)
        // this.init(this.chart_data)
        this.chartLoading = false
      }, _ => {
        this.chartLoading = false
      })
    },
    /** 提示信息 */
    nodeMove(d) {
      const title = d3.select('#title')
      if (!d) {
        title.style('display', 'none')
        return
      }
      title.style('display', 'block')
        .selectAll('div.title-content').data([d.year, d.newSituaTask, d.other])
        .text(text => text || '')

      const titleWidth = this.$refs.title.offsetWidth
      const titleHeight = this.$refs.title.offsetHeight
      d.x = d.x + 10 + titleWidth > this.chart_width ? d.x - 10 - titleWidth : d.x + 10
      d.y = d.y + 10 + titleHeight > this.chart_height ? d.y - 10 - titleHeight : d.y + 10

      title.style('left', `${d.x}px`)
        .style('top', `${d.y}px`)
    },
    /** 关系筛选 */
    selRelation(options) {
      if (this.graph) {
        if (!options.docSys || !options.fuseField || !options.timeType) {
          Chart.data([])
        } else {
          this.getData(options)
        }
      }
    },
    openList(data) {
      const param = this.$refs.relation.quearyParams()
      this.$refs.nodesTable.openDialog({ ...data, ...param })
    },
    /** 菜单折叠 */
    clickToolbar() {
      this.toolbarShow = !this.toolbarShow
      this.$refs.toolbarSwitch.style.right = this.toolbarShow ? this.toolbarWidth + 'px' : 0
    },
    /** 类型切换 */
    clickTypeSwitch() {
      this.graph.typeSwitch()
    }
  }
}
</script>

<style lang="scss" scoped>
  .graph-toolbar {
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    height: calc(100% - 50px);
    font-size: 14px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  }
  .graph-toolbar-open{
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    background-color: white;
    cursor: pointer;
  }

  .graph-toolbar-open > .graph-web-toolbar-switch {
    line-height: 54px;
    width: 28px;
    height: 54px;
    font-size: 18px;
    text-align: center;
    // background-color: #26378b;
    border: 1px solid #c0bfbf;
    color: #253B8B;
    // transform: translateY(-50%);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  }
  .graph-web-toolbar {
    cursor: pointer;
    background-color: #26378b;
  }


  .graph-web-toolbar > ul {
    margin: 0px;
    box-sizing: border-box;
    text-align: center;
    padding: 0px;
  }

  .graph-web-toolbar ul > li {
    list-style: none;
    height: 54px;
    line-height: 54px;
    float: left;
    color:#fff;
    padding:0 20px;
    font-size: 12px;
    position: relative;
  }
  .graph-web-toolbar ul > li.active:after {
    content: "";
    position: absolute;
    width: 14px;
    height: 9px;
    background-image: url("./images/barArrow.png");
    bottom: 0;
    left: 50%;
    margin-left: -7px;
  }

  .graph-web-tabpane {
    transition: width 0.75s;
    height: calc(100% - 55px);
    overflow-x: hidden; 
    overflow-y: auto;
    padding:0 15px;
    color:#333333;
  }

  #title.title {
    position: absolute;
    display: none;
    width: 250px;
    height: auto;
    top: 200px;
    left: 50px;
    background-color: black;
    padding: 5px;
    color: white;
    letter-spacing: 2px;
    font-size: 14px;
    border-radius: 4px;
  }
  .title-head {
		float: left;
    width: 70px;
    text-align: right;
	}
	.title-content {
		margin-left: 75px;
  }

  .el-tabs__header.is-top {
    display: none;
  }
</style>
