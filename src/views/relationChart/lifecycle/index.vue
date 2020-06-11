/*
 * @Author: wlq
 * @Date: 2020/1/8
 * @Last Modified by: lk
 * @Last Modified time: 2020-06-05 11:56:18
 * @Description:  生命周期图
 */
<template>
  <div id="chart_main" style="width: 100%; height:100%; position: relative">
    <div>
        <div id="chart" :style="{'width': `${chart_width}px`, 'height': `${chart_height}px`}"></div>      
        <div id='brush'></div>
        <div id="legend"></div>
    </div>
    <div class="graph-web-toolbar">
      <ul>
        <li @click="openNodesTable"><div class="text">政策列表</div></li>
        <li @click="savePng"><div class="text">保存图片</div></li>
      </ul>
      <div class="graph-web-toolbar-switch" ref="toolbarSwitch" @click="$emit('switchHandle',$refs.toolbarSwitch)">
        <i class="el-icon-d-arrow-left"></i>
        <i class="el-icon-d-arrow-right"></i>
      </div>
    </div>
    <div id="contextMenu" class="contextMenu">
      <ul>
        <li class="first" @click="menuMessage">标签信息</li>
        <li @click="menuText">查看原文</li>
        <li class='last' @click="menuInfo">政策快照</li>
      </ul>
    </div>
    <div v-show="messageVisible" id="message" class="message">
      <div class="message-title">
        <span class="message-title-content">详细信息</span>
        <span class="message-close" @click="messageVisible = false">×</span>
      </div>
      <el-table border stripe :data="messageData" style="width: 100%" :height=table_height>
        <el-table-column align="center" prop="name" label="名称" width="150"></el-table-column>
        <el-table-column align="center" prop="value" label="内容"></el-table-column>
      </el-table>
    </div>
    <el-dialog title="政策文章" width="90%" custom-class="dialog-default"
        :visible.sync="policyVisible" 
        :close-on-click-modal='false'
        append-to-body
        v-el-drag-dialog>
      <div class="dialog-contant-default file-download-log policy">
           <policy :crawlConId=policyId></policy>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="policyVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <nodes-table ref="nodesTable" @moveNode='moveNode'></nodes-table>
    <links-table ref="linksTable"></links-table>
  </div>
</template>

<script>
import { baseRequest } from '@/api/base'
import nodesTable from './components/nodesTable'
import linksTable from './components/linksTable'
import Chart from './components/chart/index.js'
import { legend } from '@/views/relationChart/components/legend.js'
import policy from '@/views/relationChart/components/policy'
import * as d3 from 'd3'
export default {
  components: {
    nodesTable,
    linksTable,
    policy
  },
  props: {
    width: Number,
    height: Number,
    id: String,
    name: String
  },
  computed: {
    chart_width() {
      return this.width
    },
    chart_height() {
      return this.height - 50
    },
    table_height() {
      return this.height - 41
    }
  },
  data() {
    return {
      graph: null,
      chart_data: null,
      messageData: [],
      messageVisible: false,

      policyVisible: false,
      policyId: ''
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    getData() {
      const params = { id: this.id }
      baseRequest('/gVertex/selectLegalLifeCycle', params).then(response => {
        const data = response.data.item
        data.forEach(d => {
          d.id += ''
          if (d.id === (this.id + '')) {
            d.queryNode = true
          }
        })
        this.init(data)
        this.listLoading = false
      }, _ => {
        this.listLoading = false
      })
      baseRequest('/userBehaviorColl/add', {
        resourceType: '4',
        resourceId: this.id
      })
    },
    init(data) {
      const graph = new Chart.Graph({
        container: 'chart',
        width: this.chart_width,
        height: this.chart_height,
        contextMenu: 'contextMenu',
        offsetId: '#chart_main',
        background: '#F9FAFF'
      })
      graph.data(data)
      graph.render()

      Chart.Brush.init(graph, 'brush')
      legend({
        container: '#legend',
        width: this.chart_width,
        height: 50,
        background: '#ffffff'
      })
      this.$nextTick(() => {
        graph.translateCenter()
      })

      this.graph = graph
    },
    /**
     * 保存图片
     */
    savePng() {
      this.graph.savePng(`${this.name}-政策法规生命周期分析`)
    },
    /**
       * 重置
       */
    refresh() {
      this.graph.relation(null)
      Chart.Brush.moveAll()
      this.$refs.relation.clear()
    },
    /**
       * 节点定位
       */
    moveNode(node) {
      this.graph.moveCenter(node.x, node.y, 1)
    },
    /**
       * 打开节点列表
       */
    openNodesTable() {
      const nodes = this.graph.get('data').nodes
      this.$refs.nodesTable.openDialog(nodes)
    },
    /**
       * 打开关系列表
       */
    openLinksTable() {
      const links = this.graph.get('data').links
      this.$refs.linksTable.openDialog(links)
    },
    /**
       * 关系筛选
       */
    // selRelation(options) {
    //   this.graph.relation(options)
    // },
    /**
       * 打开筛选列表
       */
    // relation() {
    //   this.$refs.relation.openDialog()
    //   // this.graph.relation({ related: ['强相关', '不相关'] })
    // },
    /**
     * 右键菜单--查看详情
     */
    menuMessage() {
      const node = this.graph.get('contextMenuNode')
      this.messageData = [
        // { name: 'id', value: node.id },
        { name: '政策法规名称', value: node.docName },
        { name: '政策法规文号', value: node.docNum },
        { name: '政策原文名称', value: node.docTittle },
        { name: '政策层次', value: node.docSys },
        { name: '发布时间', value: node.docIssueTime },
        { name: '生效时间', value: node.docEffectiveTime },
        { name: '废止时间', value: node.docAnnulTime },
        { name: '发布单位类型', value: node.docIssueOrgType },
        { name: '发布单位名称', value: node.docIssueOrgText },
        { name: '发文方式', value: node.docIssueType },
        { name: '适用范围', value: node.docUseBroad },
        { name: '适用范围描述', value: node.docUseBroadText },
        { name: '密级', value: node.docSecretClass },
        { name: '内容体系', value: node.docContentSys },
        { name: '文章类型', value: node.docType },
        { name: '领域类型', value: node.docDomainType }
      ]
      this.messageVisible = true
      d3.select('#contextMenu').style('display', 'none')
    },
    /**
     * 右键菜单--查看原文
     */
    menuText() {
      const node = this.graph.get('contextMenuNode')
      window.open(node.docUri, '_blank')
    },
    /** 右键菜单 -- 政策快照 */
    menuInfo() {
      const node = this.graph.get('contextMenuNode')
      this.policyId = node.id + ''
      this.policyVisible = true
      d3.select('#contextMenu').style('display', 'none')
    }
  }
}
</script>

<style scoped>
  @import '../components/chart.css';
</style>
<style lang="scss" scoped>
  #chart {
    border: 1px solid #ccc;
  }
</style>
