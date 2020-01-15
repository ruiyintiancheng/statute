<template>
  <div class="base-container">
    <div><span>{{name}}</span></div>
    <div class="menu" style="height: 40px; background-color: white;">
      <ul class="mao-nav">
        <li :class="{'active': active === 0}" @click="active = 0"><a>法律法规关联分析</a></li>
        <li :class="{'active': active === 1}" @click="active = 1"><a>法律法规生命周期分析</a></li>
        <li :class="{'active': active === 2}" @click="active = 2"><a>法律法规响应层级分析</a></li>
      </ul>
    </div>
    <div class="main-chart" :style="{width: `${chart_width}px`, height: `${chart_height}px`}">
      <lawsrelation-chart v-if="active === 0" ref="lawsRelationChart"
          :width=chart_width :height=chart_height :id=id :name=name></lawsrelation-chart>
      <lifecycle v-else-if="active === 1"
          :width=chart_width :height=chart_height :id=id :name=name></lifecycle>

      <triangle-chart v-else-if="active === 2"
          :width=chart_width :height=chart_height :id=id :name=name></triangle-chart>
    </div>
  </div>
</template>
<script>
import lawsRelationChart from './lawsRelationChart/index'
import lifecycle from './lifecycle/index'
import triangleChart from './triangleChart/index'
export default {
  components: {
    'lawsrelation-chart': lawsRelationChart,
    lifecycle,
    'triangle-chart': triangleChart

  },
  computed: {
    chart_width() {
      return document.querySelector('.base-container').offsetWidth
    },
    chart_height() {
      return document.querySelector('.app-main').offsetHeight - 40 - 20
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
    // const id = this.$route.params.id
    this.id = this.$route.params.id
    this.name = this.$route.params.name
    this.active = this.$route.params.type
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style scoped>
.mao-nav {
  float: left;
  font-size: 16px;
  color: #666;
  margin-left: 10px;
  margin-top: 10px;
}

.mao-nav li {
  display: inline;
  margin-left: 20px;
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