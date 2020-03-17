/*
 * @Author: lk 
 * @Date: 2020-02-26 14:51:08 
 * @Last Modified by: lk
 * @Last Modified time: 2020-03-04 16:18:38
 * @Description:  采集配置
 */
 <template>
     <div class="collention-setting">
         <el-tabs v-model="activeName">
          <el-tab-pane label="采集服务器" name="first">
            <cj-server></cj-server>
          </el-tab-pane>
          <el-tab-pane label="代理服务" name="second">
            <dl-server></dl-server>
          </el-tab-pane>
          <el-tab-pane label="接口信息" name="third">
            <interface-information></interface-information>
          </el-tab-pane>
          <el-tab-pane label="数据源" name="fourth">
            <data-source></data-source>
          </el-tab-pane>
        </el-tabs>
     </div>
 </template>
 
<script>
import CjServer from './components/CjServer'
import DlServer from './components/DlServer'
import InterfaceInformation from './components/InterfaceInformation'
import DataSource from './components/DataSource'
export default {
  name: 'collentionSetting',
  components: {
    CjServer,
    DlServer,
    InterfaceInformation,
    DataSource
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.collention-setting{
  margin:10px;
}
</style>

