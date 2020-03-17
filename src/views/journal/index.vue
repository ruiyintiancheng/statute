/*
 * @Author: lk 
 * @Date: 2020-02-26 15:35:55 
 * @Last Modified by: lk
 * @Last Modified time: 2020-02-26 15:46:13
 * @Description:  采集日志
 */
 <template>
<div class="journal">
         <el-tabs v-model="activeName">
          <el-tab-pane label="待执行" name="first">
            <execute-notyet></execute-notyet>
          </el-tab-pane>
          <el-tab-pane label="执行成功" name="second">
            <execute-success></execute-success>
          </el-tab-pane>
          <el-tab-pane label="执行错误" name="third">
            <execute-error></execute-error>
          </el-tab-pane>
        </el-tabs>
     </div>
 </template>
 
<script>
import ExecuteSuccess from './components/ExecuteSuccess'
import ExecuteNotyet from './components/ExecuteNotyet'
import ExecuteError from './components/ExecuteError'
export default {
  name: 'journal',
  components: {
    ExecuteSuccess,
    ExecuteNotyet,
    ExecuteError
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
.journal{
  margin:10px;
}
</style>