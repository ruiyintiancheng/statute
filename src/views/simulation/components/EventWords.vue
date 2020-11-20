<template>
    <div class="event-words list-comtainer">
    <div class="">
      <div class="row-botton new clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <!-- <div class="row-option">
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div> -->
      </div>
      <div 
           class="form-search new">
        <el-form :inline="true"
                 class="demo-table-expand">
            <el-form-item class="input-order">
              <span class="input-label">关键字查询:</span>
              <el-input v-model.trim="synonymList"
                         style="width:250px"
                         clearable
                         placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item class="input-order">
                <el-button icon="el-icon-search"
                     @click="searchOption()"
                     type="primary">查询</el-button>
                <el-button icon="el-icon-plus"
                     @click="addModel">添加</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
    <div  class="">
      <div class="row-botton new clearfix">
        <div class="row-title">
          <svg-icon icon-class="ul" />
          <span>数据列表</span>
        </div>
        <!-- <div class="row-option">
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div> -->
      </div>
      <div>
        <el-table :data="data"
                  border
                  v-loading="listLoading"
                  :height="tableHeight">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80">
        </el-table-column>
          <el-table-column prop="synonymList"
                           label="词组"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="validTime"
                           label="时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column label="操作"
                           width="260"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row"
                         type="primary"
                         plain
                         size="mini"
                         @click="updateOption(scope.row)">修改</el-button>
              <el-button size="mini"
                         plain
                         type="danger"
                         @click="deleteForm(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
        <el-dialog :title="'词组'+(updateStatus===0?'添加':'修改')"
               :visible.sync="infoVisible"
               width="500px"
               custom-class="dialog-default autoHeight">
        <div class="dialog-contant-default event-words-dialog" v-if="infoVisible">
          <event-words-update ref="eventWordsUpdate" :synonymStr="synonymStr"></event-words-update>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="infoVisible = false">取消</el-button>
          <el-button type="primary" @click="wordsSave">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseSearch, baseRequest } from '@/api/base'
import EventWordsUpdate from './EventWordsUpdate'
export default {
  components: { EventWordsUpdate },
  data() {
    return {
      synonymList: '',
      data: [],
      listLoading: false,
      pageNo: 1,
      total: null,
      pageSize: 15,
      infoVisible: false,
      updateStatus: 0,
      synonymId: null,
      synonymStr: ''
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 390
    }
  },
  created() {
    this.searchOption()
  },
  methods: {
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    },
    searchOption(page) {
      if (!page) {
        this.pageNo = 1
      }
      this.listLoading = true
      const param = { synonymList: this.synonymList, pageNo: this.pageNo, pageSize: this.pageSize }
      baseSearch('/wsClient/selectSynonyms', param).then(response => {
        this.data = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
        this.listLoading = false
      })
    },
    addModel() {
      this.updateStatus = 0
      this.synonymId = null
      this.synonymStr = ''
      this.infoVisible = true
    },
    updateOption(row) {
      this.updateStatus = 1
      this.synonymId = row.synonymId
      this.synonymStr = row.synonymList
      this.infoVisible = true
    },
    wordsSave() {
      const params = {
        sysnonymColl: this.$refs.eventWordsUpdate.words
      }
      let url = '/wsClient/insert'
      if (this.updateStatus === 1) {
        params.synonymId = this.synonymId
        url = '/wsClient/updateBySynonymId'
      }
      baseRequest(url, params).then(response => {
        this.$Message.success('操作成功')
        this.infoVisible = false
        this.searchOption()
      })
    },
    deleteForm(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/wsClient/deleteBySynonymId', { synonymId: row.synonymId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.event-words{
  .dialog-contant-default.event-words-dialog{
    padding:40px;
  }
}
</style>