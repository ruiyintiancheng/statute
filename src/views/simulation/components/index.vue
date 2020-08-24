<template>
    <div class="simulation-index">
            <el-form :inline="true" :model="updateFormData" >
                <el-form-item label="领域" prop="fuseField">
                    <el-select style="width:275px;" v-model="updateFormData.fuseField" placeholder=""
                        multiple
                        collapse-tags
                        @change="selectControl($event,'fuseField','Military_Integration')">
                        <el-option v-for="(text,item) in Military_Integration"
                            :key="item"
                            :label="text"
                            :value="item+'|'+text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="docUseBroad"
                    label="波及范围">
                    <el-select style="width:275px;"
                    placeholder=""
                    multiple
                    collapse-tags
                    @change="selectControl($event,'docUseBroad','DOC_USE_BROAD')"
                    v-model="updateFormData.docUseBroad"
                    clearable>
                        <el-option v-for="(text,item) in DOC_USE_BROAD"
                        :key="item"
                        :label="text"
                        :value="item+'|'+text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-input style="width:275px;" v-model.trim="updateFormData.content" clear placeholder="请输入重大事件关键词"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchHandle()">分析</el-button>
                </el-form-item>
            </el-form>

            <div class="searchBody"
         v-loading="listLoading">
      <div class="query-results"
           v-if="hasData">
        <div class="data-bar"
             v-for="(item,index) in tabularData"
             :key="index">
          <a @click="jumpPage(item.id)"
             style="color:#666">
            <h4>
              <span v-if="judgingBody(item.issueOrgText)"
                    v-html="item.issueOrgText"></span>
              <span v-if="judgingBody(item.issueOrgText)">:</span>
              <span v-html="item.docName"></span>
            </h4>
          </a>
          <p class="bar-title"
             style="font-size:14px;color:#777"
             v-html="item.docContent"></p>
          <p class="bar-date"
             style="font-size:12px;color:#999">{{item.docIssueTime==='null'?'':item.docIssueTime}}</p>
        </div>
        <el-pagination v-if="total || total === 0"
                       background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       style="margin-bottom:10px;text-align:center;margin-top:44px;"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination>
      </div>
      <div v-else
           class="not-find">
            <h3>未查询到相关结果,建议:</h3>
            <p>1.请检查输入是否有误</p>
            <p>2.请您尝试简化输入词</p>
            <p>3.请您尝试用类似词或常见词</p>
      </div>
      <div class="search-tip" v-if="tabularData.length <= 0 && hasData">请根据条件分析查询</div>
    </div>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  data() {
    return {
      tabularData: [],
      Military_Integration: {},
      DOC_USE_BROAD: {},
      updateFormData: {
        fuseField: [],
        docUseBroad: [],
        content: ''
      },
      repeatedEngravingForm: {
        fuseField: [],
        docUseBroad: []
      },
      pageNo: 1,
      pageSize: 15,
      total: null,
      hasData: true,
      listLoading: false
    }
  },
  mounted() {
    this.getSelectOptions()
  },
  methods: {
    searchHandle(page) {
      if (!this.updateFormData.content) {
        this.$message.warning('请输入重大事件关键词')
        return
      }
      if (!page) {
        this.pageNo = 1
      }
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        wd: {
          content: this.updateFormData.content,
          fuseField: this.updateFormData.fuseField,
          docUseBroad: this.updateFormData.docUseBroad
        }
      }
      this.listLoading = true
      // baseRequest('/esIndex/queryDoc', params).then(response => {
      baseRequest(page ? '/wsClient/queryPage' : '/wsClient/queryDoc', params).then(response => {
        this.tabularData = response.data.item.list
        this.total = response.data.item.total
        this.pageSize = response.data.item.pageSize
        if (response.data.item.list.length !== 0) {
          this.hasData = true
        } else {
          this.hasData = false
        }
        this.listLoading = false
      }, _ => {
        this.listLoading = false
      })
    },
    getSelectOptions() {
      const IDs = 'AA-012000000000000000-0001,AA-011000000000000000-0001,AA-003000000000000000-0001,AA-006000000000000000-0001,AA-014000000000000000-0001'
      baseRequest('/bCode/getOptionByFCodeId', { fCodeIds: IDs }).then(response => {
        this.Military_Integration = response.data.item.fuseField || {}
        this.DOC_USE_BROAD = response.data.item.docUseBroad || {}
        if (this.Military_Integration) {
          this.$set(this.Military_Integration, 0, '全部')
        }
        if (this.DOC_USE_BROAD) {
        // this.DOC_USE_BROAD[0] = '全部'
          this.$set(this.DOC_USE_BROAD, 0, '全部')
        }
      })
    },
    // 选中控制
    selectControl(val, prop, options) {
      if (val.length && val[val.length - 1] === '0|全部') {
        const all = []
        for (const key in this[options]) {
          all.push(key + '|' + this[options][key])
        }
        this.updateFormData[prop] = all
        this.repeatedEngravingForm[prop] = all
      } else if (val.find(item => item === '0|全部')) {
        this.updateFormData[prop] = this.updateFormData[prop].filter(item => item !== '0|全部')
        this.repeatedEngravingForm[prop] = this.updateFormData[prop].filter(item => item !== '0|全部')
      } else if (val.find(item => item !== '0|全部')) {
        const all = []
        for (const key in this[options]) {
          all.push(key + '|' + this[options][key])
        }
        if (val.length === all.length - 1) {
          if (this.repeatedEngravingForm[prop].length === all.length) {
            this.updateFormData[prop] = []
            this.repeatedEngravingForm[prop] = []
          } else if (this.repeatedEngravingForm[prop].length < all.length) {
            this.updateFormData[prop] = all
            this.repeatedEngravingForm[prop] = all
          }
        }
      }
    },
    jumpPage(crawlConId) {
      // const path = this.$route.params.path ? this.$route.params.path : this.$route.path
      // this.$router.push({ name: 'simulationPolicy', query: { crawlConId }, params: { path }})
      this.$emit('toDetail', crawlConId)
    },
    judgingBody(str) { // 判断标题发布机构是否有值
      if (str && str !== '') {
        if (str.indexOf('EA-') === -1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchHandle(true)
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchHandle(true)
    }
  }
}
</script>
<style lang="scss">
    .simulation-index{
        margin: 15px auto 0;
        padding-bottom: 15px;
        width: 1100px;
          .searchBody {
            .search-tip{
                font-size: 30px;
                color: #409EFF;
                font-weight: 600;
                text-align: center;
                margin-top:200px;
            }
            .not-find {
            font-size: 14px;
            color: #666;
            line-height: 43px;
            h3 {
                font-size: 20px;
            }
            p {
                padding-left: 40px;
                font-size: 17px;
                color: #909399;
            }
            }
            .data-bar {
            padding: 0 40px;
            h4 {
                line-height: 30px;
                position: relative;
                padding: 28px 0 11px;
                &::before {
                content: "";
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #1f73f3;
                position: absolute;
                top: 36px;
                left: -18px;
                }
            }
            .bar-title {
                line-height: 28px;
                padding: 0 30px 0 5px;
                border: 1px dashed #ccc;
            }
            .bar-date {
                height: 46px;
                line-height: 46px;
            }
            h4,
            p {
                margin: 0;
            }
            &:nth-of-type(2n-1) {
                background-color: #fff;
            }
            }
        }
    }
</style>