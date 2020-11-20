/*
 * @Author: lk 
 * @Date: 2020-02-26 15:34:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-11-20 13:56:21
 * @Description:  数据源
 */
<template>
  <div class="list-comtainer">
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
      <div v-show="searchToggle"
           class="form-search new">
        <el-form :inline="true"
                 class="demo-table-expand">
            <el-form-item class="input-order">
              <span class="input-label">项目名称:</span>
              <el-input v-model.trim="sourceName"
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
                     @click="addModel">创建</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="">
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
                  v-show="tableToggle"
                  border
                  :height="tableHeight">
          <el-table-column 
                           label="编号"
                           align="center"
                           type="index"
                           width="50">
          </el-table-column>
          <el-table-column prop="sourceName"
                           label="数据源名称"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sourceType"
                           label="驱动类型"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sourceUrl"
                           label="数据源地址"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sourceUsername"
                           label="用户名"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sourceState"
                           label="数据源状态"
                           align="center"
                           min-width="200">
                           <template slot-scope="scope">
                        {{ scope.row.sourceState | state}}
                    </template>
          </el-table-column>
          <el-table-column prop="sourceAddTime"
                           label="创建时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="sourceUpdTime"
                           label="更新时间"
                           align="center"
                           min-width="200">
          </el-table-column>
          <el-table-column label="操作"
                           width="260"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button
                         type="primary"
                         plain
                         size="mini"
                         @click="updateOption(scope.row)">修改</el-button>
              <el-button size="mini"  v-if="scope.row.sourceState !== '0'"
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
    <el-dialog :title="operateStatus===1?'创建':'修改'"
               :visible.sync="operateVisable"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default" v-if="operateVisable">
          <el-form :rules="rules"
                 class="baseUpdate-form"
                 ref="updateFrom"
                 style="margin-left: calc(50% - 185px)"
                 :model="updateFormData"
                 label-width="120px">
                 <el-form-item prop="sourceName"
                        label="名称:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="updateFormData.sourceName"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="sourceType"
                          label="驱动类型:">
              <el-select class="form-input" style="width:200px"
                v-model="updateFormData.sourceType"
                @change="updateFormData.isConnect = null"
                >
                    <el-option  value="Mysql" label="Mysql"></el-option>        
                    <el-option  value="Oracle" label="Oracle"></el-option>        
                </el-select>
            </el-form-item>
            <el-form-item prop="sourceUrl"
                          label="连接地址:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="updateFormData.sourceUrl"
                        @change="updateFormData.isConnect = null"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="sourceUsername"
                          label="用户名称:">
              <el-input class="form-input"
                        style="width:200px"
                        v-model.trim="updateFormData.sourceUsername"
                        @change="updateFormData.isConnect = null"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="sourcePazzword"
              label="用户密码">
              <el-input class="form-input"
                        style="width:200px"
                        @focus="updateFormData.sourcePazzword=null"
                        v-model.trim="updateFormData.sourcePazzword"
                        @change="updateFormData.isConnect = null"
                        type="password"
                        clearable></el-input>
            </el-form-item>
            <el-form-item prop="sourceState"
                          label="状态">
                <el-radio v-model="updateFormData.sourceState" label="1">停用</el-radio>
                <el-radio v-model="updateFormData.sourceState" label="2">启用</el-radio>
            </el-form-item>
            <el-form-item prop="isConnect"
                        >
              <el-button type="success" plain size="small " @click="testConnect">连接测试</el-button>
          </el-form-item>
        </el-form>
      </div>
            <div slot="footer"
           class="dialog-footer">
        <el-button @click="operateVisable = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseSearch, baseRequest } from '@/api/base'
import { saveUpdate } from '@/utils/validate'
import { encode64 } from '@/utils/base64'
const url = '/confSource/selects'
export default {
  filters: {
    state(val) {
      const item = {
        '0': '删除',
        '1': '停用',
        '2': '生效' }
      return item[val]
    }
  },
  data() {
    return {
      pageNo: 1,
      total: null,
      pageSize: 15,
      sourceName: '', // 列表查询参数
      // tableHeight: 0,
      searchToggle: true,
      tableToggle: true,
      data: [],
      operateStatus: 1, // 1添加 2修改
      operateVisable: false,
      rules: {
        sourceName: [
          { required: true, message: '请填写此项' },
          { max: 256, message: '不能超过256个字' }
        ],
        sourceType: [
          { required: true, message: '请填写此项' }
        ],
        sourceUrl: [
          { required: true, message: '请填写此项' }
          // { validator: (rule, value, callback) => {
          //   if (/(http|https|ftp):\/\/([\w.]+\/?)\S*/.test(value)) {
          //     callback()
          //   } else {
          //     callback(new Error('格式不正确'))
          //   }
          // } }
        ],
        sourceUsername: [
          { required: true, message: '请填写此项' },
          { max: 32, message: '不能超过32个字' }
        ],
        sourcePazzword: [
          { required: true, message: '请填写此项' },
          { max: 32, message: '不能超过32个字' }
        ],
        sourceState: [
          { required: true, message: '请填写此项' }
        ],
        isConnect: [
          { required: true, message: '请测试连接地址' }
        ]
      },
      updateFormData: {
        sourceName: null,
        sourcePazzword: null,
        sourceState: '1',
        sourceType: null,
        sourceUrl: null,
        sourceUsername: null,
        isConnect: null
      },
      currentId: null,
      currentPassword: null
    }
  },
  mounted() {
    this.searchOption()
    // this.getTableHeight()
  },
  watch: {
    searchToggle() {
      // this.getTableHeight()
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.containHeight - 400
    }
  },
  methods: {
    // 测试地址
    testConnect() {
      this.$refs.updateFrom.validateField(['sourceType', 'sourceUrl', 'sourceUsername', 'sourcePazzword'], valid => {
      })
      if (this.updateFormData.sourceType && this.updateFormData.sourceUrl && this.updateFormData.sourceUsername && this.updateFormData.sourcePazzword) {
        const params = {
          sourceType: this.updateFormData.sourceType,
          sourceUrl: this.updateFormData.sourceUrl,
          sourceUsername: this.updateFormData.sourceUsername,
          sourcePazzword: this.updateFormData.sourcePazzword
        }
        if (this.updateFormData.sourcePazzword !== this.currentPassword) {
          params.sourcePazzword = encode64(params.sourcePazzword)
        }
        baseRequest('/confSource/isConnect', params).then(response => {
          this.updateFormData.isConnect = 1
          this.$message.success('测试通过')
          this.$refs.updateFrom.validateField(['isConnect'])
        })
      }
    },
    getTableHeight() {
      this.$nextTick(_ => {
        this.tableHeight = document.body.offsetHeight - 360
      })
    },
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
      const param = { sourceName: this.sourceName, pageNo: this.pageNo, pageSize: this.pageSize } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      baseSearch(url, param).then(response => {
        this.data = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
      })
    },
    // 删除
    deleteForm(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/confSource/delete', { sourceId: row.sourceId }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    addModel() {
      this.operateStatus = 1
      this.updateFormData = {
        sourceName: null,
        sourcePazzword: null,
        sourceState: '1',
        sourceType: null,
        sourceUrl: null,
        sourceUsername: null,
        isConnect: null
      }
      this.operateVisable = true
    },

    // 修改表单
    updateOption(row) {
      this.updateFormData = {
        sourceName: null,
        sourcePazzword: null,
        sourceState: '1',
        sourceType: null,
        sourceUrl: null,
        sourceUsername: null,
        isConnect: null
      }
      this.operateStatus = 2
      this.currentId = row.sourceId
      this.currentPassword = row.sourcePazzword
      for (const key in row) {
        if (this.updateFormData.hasOwnProperty(key)) {
          this.updateFormData[key] = row[key]
          if (this.updateFormData[key]) {
            this.updateFormData[key] = this.updateFormData[key] + ''
          }
        }
      }
      this.operateVisable = true
    },
    saveOperate() {
      const params = {}
      for (const key in this.updateFormData) {
        if (key !== 'sourcePazzword' || this.updateFormData.sourcePazzword === this.currentPassword) {
          params[key] = this.updateFormData[key]
        } else {
          params[key] = encode64(this.updateFormData[key])
        }
      }
      if (this.operateStatus === 2) {
        params.sourceId = this.currentId
        saveUpdate('/confSource/update', params, this.rules, this.$refs.updateFrom).then(() => {
          this.operateVisable = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      } else {
        saveUpdate('/confSource/add', params, this.rules, this.$refs.updateFrom).then(() => {
          this.operateVisable = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>