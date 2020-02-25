<template>
  <div class="base-container">
    <div class="main-title" style="height: 80px;">
      <div style="height: 50px; line-height: 50px; opacity: 0.5;">
        <span>{{name}}</span>
      </div>
      <el-row :gutter="20" class="mao-nav">
        <el-col :span="8">
          <div :class="{'active': active === 0}" @click="active = 0"><a>法律法规关联分析</a></div>
        </el-col>
        <el-col :span="8">
          <div :class="{'active': active === 1}" @click="active = 1"><a>法律法规生命周期分析</a></div>
        </el-col>
        <el-col :span="8">
          <div :class="{'active': active === 2}" @click="active = 2"><a>法律法规响应层级分析</a></div>
        </el-col>
      </el-row>
    </div>
    <div class="main-chart" :style="{width: `${chart_width}px`, height: `${chart_height}px`}">
      <lawsrelation-chart v-if="active === 0" ref="lawsRelationChart"
          :width=chart_width :height=chart_height :id=id :name=name></lawsrelation-chart>
          
      <lifecycle v-else-if="active === 1"
          :width=chart_width :height=chart_height :id=id :name=name></lifecycle>

      <!-- <triangle-chart v-else-if="active === 2"
          :width=chart_width :height=chart_height :id=id :name=name></triangle-chart> -->

      <depth-relationChart v-if="active === 2" ref="depthRelationChart"
          :width=chart_width :height=chart_height :id=id :name=name></depth-relationChart>    
    </div>
  </div>
</template>
<script>
import lawsRelationChart from './lawsRelationChart/index'
import lifecycle from './lifecycle/index'
import triangleChart from './triangleChart/index'
import depthRelationChart from './depthRelationChart/index'
export default {
  components: {
    'lawsrelation-chart': lawsRelationChart,
    lifecycle,
    'triangle-chart': triangleChart,
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
      active: null,
      id: null,
      name: null
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.name = this.$route.params.name
    this.active = this.$route.params.type
  },
  methods: {
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
</style>