<template>
    <div class="simulation">
         <el-tabs v-model="activeName">
            <el-tab-pane label="类比分析" name="1">
                <simulation v-show="!isDetail" @toDetail="toDetail"></simulation>
                <policy v-if="isDetail"  :crawlConId="crawlConId" @backHandle="backHandle"></policy>
            </el-tab-pane>
            <el-tab-pane label="事件词组" name="2">
              <EventWords></EventWords>
            </el-tab-pane>
            <el-tab-pane label="帮助" name="3">
              <help></help>
            </el-tab-pane>
         </el-tabs>
    </div>
</template>
<script>
import Simulation from './components/index'
import EventWords from './components/EventWords'
import policy from './components/Policy'
import Help from './components/Help'
export default {
  components: { Simulation, policy, EventWords, Help },
  data() {
    return {
      activeName: '1',
      crawlConId: null,
      isDetail: false
    }
  },
  methods: {
    toDetail(crawlConId) {
      this.crawlConId = crawlConId
      this.isDetail = true
    },
    backHandle() {
      this.isDetail = false
    }
  }
}
</script>
<style lang="scss">
.simulation{
    .el-tabs__nav-scroll{
        background-color: white;
        padding-left: 30px;
    }
    .el-tabs__item{
        font-size: 17px;
        font-weight: 600;
    }
}
</style>