/*  
* 气泡图
*/
<template>
  <div>
    <div style="width: 100%; height:100%; position: relative">
      <div v-loading="chartLoading">
        <div id="chart" :style="{'width': `${chart_width}px`, 'height': `${chart_height}px`}"></div>
        <div id="brush"></div>
        <div id="legend"></div>
      </div>
      <!-- 选项菜单 -->
      <div class="graph-toolbar">
        <div class="graph-web-toolbar">
          <ul>
            <li :class="activeName === '筛选'? 'active' : null " @click="activeName='筛选'"><div class="text">筛选</div></li>
            <li :class="activeName === '帮助'? 'active' : null " @click="activeName='帮助'"><div class="text">帮助</div></li>
            <li :class="activeName === '政策列表'? 'active' : null " @click="clickInfo"><div class="text">政策列表</div></li>
            <li @click="clickTypeSwitch"><div class="text">切换</div></li>
            <li v-show="toolbarShow" @click="clickToolbar"><div class="text">收起</div></li>
            <li v-show="!toolbarShow" @click="clickToolbar"><div class="text">打开</div></li>
          </ul>
        </div>
        <!-- v-show="toolbarShow" -->
        <div class="graph-web-tabpane" :style="{'width': `${toolbarWidth}px`}">
          <el-tabs v-model="activeName">
            <el-tab-pane name="筛选">
              <relation-pane ref="relation" :width="260" :height="toolbarHeight" @selRelation="selRelation"></relation-pane>
            </el-tab-pane>
            <el-tab-pane name="帮助">
              <explain-pane :width="260" :height="toolbarHeight"></explain-pane>
            </el-tab-pane>
            <el-tab-pane name="政策列表">
              <info-pane ref="infoPane" :width="260" :height="toolbarHeight"></info-pane>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      
      <!-- 鼠标悬浮提示框 -->
      <div id="title" class="title">
        <!-- <div>
          <div class='title-head'>发布单位: </div>
          <div class="title-content">中华人民共和国工业和信息化部</div>
        </div>
          <div>
          <div class='title-head'>发布法规: </div>
          <div class="title-content">中华人民共和国工业和信息化部</div>
        </div>
        <div>
          <div class='title-head'>发布时间: </div>
          <div class="title-content">中华人民共和国工业和信息化部</div>
        </div> -->
      </div>
      <!-- 鼠标右键菜单 -->
      <!-- <div id="contextMenu" class="contextMenu">
        <ul>
          <li @click="menuMessage">查看详情</li>
          <li @click="menuText" class='end'>查看原文</li>
        </ul>
      </div> -->
      <!-- 详细信息 -->
      <div v-show="messageVisible" id="message" class="message">
        <div class="message-title">
          <span class="message-title-content">详细信息</span>
          <span class="message-close" @click="messageVisible = false">×</span>
        </div>
        <el-table :data="messageData" style="width: 100%" :height=table_height>
          <el-table-column prop="name" label="名称" width="110"></el-table-column>
          <el-table-column prop="value" label="内容"></el-table-column>
        </el-table>
      </div>
      <nodes-table ref="nodesTable" @moveNode='moveNode'></nodes-table>
    </div>
  </div>
</template>

<script>
import { baseRequest } from '@/api/base'
import nodesTable from './components/nodesTable'
import relationPane from './components/relation'
import explainPane from './components/explain'
import infoPane from './components/infoPane'
import Chart from './components/chart/index.js'
// import * as d3 from 'd3'
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
    chart_width() {
      return document.querySelector('.app-main').offsetWidth - 40
    },
    chart_height() {
      return document.querySelector('.app-main').offsetHeight - 30
    },
    table_height() {
      return this.height - 40
    },
    toolbarHeight() {
      return document.querySelector('.app-main').offsetHeight
    }
  },
  data() {
    return {
      chartData: [],
      graph: null,
      chart_data: null,
      messageData: [],
      messageVisible: false,
      chartLoading: true,
      width: 1000,
      height: 1000,
      id: '1',
      name: '气泡',
      activeName: '筛选',
      toolbarShow: true,
      toolbarWidth: 300
    }
  },
  created() {
  },
  mounted() {
    document.querySelector('.el-tabs__header.is-top').style.display = 'none'
    // console.log()
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    getData() {
      const params = {}
      baseRequest('/bDocBasic/annualAnalysis', params).then(response => {
        this.chart_data = response.data.item
        this.init(this.chart_data)
        this.chartLoading = false
      }, _ => {
        this.chartLoading = false
      })
    },
    init(data) {
      const graph = new Chart.Graph({
        container: 'chart',
        width: this.chart_width,
        height: this.chart_height,
        // contextMenu: 'contextMenu',
        nodeTitle: 'title',
        background: '#26368d',
        openList: this.openList,
        dataType: 'year'
      })
      graph.data(data)
      graph.render()

      // Chart.Brush.init(graph, 'brush')
      Chart.legend(graph, 'legend')
      // graph.translateCenter()
      this.graph = graph
    },
    /**
     * 保存图片
     */
    savePng() {
      this.graph.savePng(`${this.name}-法律法规关联分析`)
    },
    /**
       * 重置
       */
    refresh() {
      this.graph.move(0, 0, 1)
    },
    /**
       * 节点定位
       */
    moveNode(node) {
      this.graph.moveCenter(node.x, node.y, 1)
    },
    /**
       * 关系筛选
       */
    selRelation(options) {
      this.graph.relation(options)
    },
    /**
       * 打开筛选列表
       */
    relation() {
      this.$refs.relation.openDialog()
      // this.graph.relation({ related: ['强相关', '不相关'] })
    },
    openList(data) {
      this.$refs.nodesTable.openDialog(data)
    },
    /** 菜单折叠 */
    clickToolbar() {
      this.toolbarShow = !this.toolbarShow
      this.toolbarWidth = this.toolbarShow ? 300 : 0
    },
    clickInfo() {
      this.$refs.infoPane.setData(this.graph.get('data'))
      this.activeName = '政策列表'
    },
    /** 类型切换 */
    clickTypeSwitch() {
      this.graph.typeSwitch()
    }
  }
}
</script>

<style scoped>
  /* @import '../components/chart.css'; */
  .graph-toolbar {
    position: absolute;
    display: block;
    bottom: 0;
    right: 0;
    height: 100%;
    font-size: 14px;
    background-color: white;
  }
  
/* 右侧工具菜单 */

  .graph-web-toolbar {
    float: left;
    width: 40px;
    height: 100%;
    cursor: pointer;
    border-left: 1px solid #dedede;
    border-right: 1px solid #dedede;
  }


  .graph-web-toolbar > ul {
    margin: 0px;
    box-sizing: border-box;
    text-align: center;
    padding: 0px;
    border-top: 1px solid #dedede;
    border-left: 1px solid #dedede;
    border-right: 1px solid #dedede;
  }

  .graph-web-toolbar ul > li {
    padding: 7px;
    list-style: none;
    border-bottom: 1px solid #dedede;
  }

  .graph-web-toolbar ul > li:hover {
    background-color: #409eff;
    color: white;
  }
  .graph-web-toolbar ul > li.active {
    background-color: #409eff;
    color: white;
  }

  .graph-web-tabpane {
    transition: width 0.75s;
    height: 100%;
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
	}
	.title-content {
		margin-left: 75px;
  }
  
  .el-tabs__header.is-top {
    display: none;
  }
</style>
