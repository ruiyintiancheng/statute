<template>
  <div class="base-container">
    <div class="main-title" style="height: 80px;">
      <div style="height: 50px; line-height: 50px; opacity: 0.5;">
        <span>{{name}}</span>
      </div>
      <el-row :gutter="20" class="mao-nav">
        <el-col :span="8">
          <div :class="{'active': active === '0','disabled':$route.params.modelAnalysis==='0'}" @click="tabsHandle('0',$route.params.modelAnalysis==='0')"><a>政策法规关联分析</a></div>
        </el-col>
        <el-col :span="8">
          <div :class="{'active': active === '1','disabled':$route.params.modelLifeCycle==='0'}" @click="tabsHandle('1',$route.params.modelLifeCycle==='0')"><a>政策法规生命周期分析</a></div>
        </el-col>
        <el-col :span="8">
          <div :class="{'active': active === '2','disabled':$route.params.modelAnalysis==='0'}" @click="tabsHandle('2',$route.params.modelAnalysis==='0')"><a>政策法规响应层级分析</a></div>
        </el-col>
      </el-row>
    </div>
    <div class="main-chart" :style="{width: `${chart_width}px`, height: `${chart_height}px`}">
      <lawsrelation-chart v-if="active === '0'" ref="lawsRelationChart"
          :width=chart_width :height=chart_height :id=id :name=name></lawsrelation-chart>
          
      <lifecycle v-else-if="active === '1'"
          :width=chart_width :height=chart_height :id=id :name=name></lifecycle>

      <depth-relationChart v-if="active === '2'" ref="depthRelationChart"
          :width=chart_width :height=chart_height :id=id :name=name></depth-relationChart>    
    </div>
  </div>
</template>
<script>
import lawsRelationChart from './lawsRelationChart/index'
import lifecycle from './lifecycle/index'
import depthRelationChart from './depthRelationChart/index'
import { baseRequest } from '@/api/base'
export default {
  components: {
    'lawsrelation-chart': lawsRelationChart,
    lifecycle,
    'depth-relationChart': depthRelationChart
  },
  computed: {
    chart_width() {
      return document.querySelector('.base-container').offsetWidth
    },
    chart_height() {
      return document.querySelector('.app-main').offsetHeight - 80
    }
  },
  data() {
    return {
      active: 0,
      id: null,
      name: null
    }
  },
  mounted() {
    this.id = this.$route.query.id
    // this.name = this.$route.params.name
    this.active = this.$route.query.type
    this.loadName()
  },
  methods: {
    loadName() {
      baseRequest('/gVertex/select', { id: this.id }).then(response => {
        this.name = response.data.item.docName
      }, _ => {
      })
    },
    tabsHandle(name, disabled) {
      if (!disabled) {
        this.active = name
      }
    }
  }
}
</script>
<style scoped>
.mao-nav {
  font-size: 16px;
  text-align: center;
  color: #666;
}
.mao-nav a {
  line-height: 1.8;
  padding: 3px 0px;
}
.mao-nav .active > a {
  color: #128bed;
  border-bottom: 2px solid #128bed;
}
.mao-nav .disabled > a {
  color: #C0C4CC;
  cursor: not-allowed;
}
</style>