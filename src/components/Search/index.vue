/*
 * @Author: lk 
 * @Date: 2019-12-24 19:52:31 
 * @Last Modified by: lk
 * @Last Modified time: 2019-12-25 00:56:41
 * @Description:  高级搜索
 */
 <template>
      <div class="search">
            <el-input placeholder="请输入内容"
                      class="text-search"
                      ref="searchInput"
                      @keyup.enter.native="seacrHandle"
                      v-model="dataValue"
                      >
              <el-button slot="prepend"
                        @click.stop="advancedSearch">高级搜索 <i class="el-icon-arrow-down"></i></el-button>
              <el-button slot="append"
                        v-if="generalSearch"
                        icon="el-icon-search"
                        @click="seacrHandle">搜索</el-button>
            </el-input>
            <!-- 高级搜索 -->
            <el-form ref="form"
                    v-if="seniorForm"
                    :inline="true"
                    @click.native.stop=""
                    class="searchForm"
                    :model="updateFormData"
                    label-width="100px">
              <el-form-item prop="archiveMode"
                            class="single-form-item"
                            label="发布机构">
                <el-autocomplete v-model="updateFormData.publishingStructure"
                                clearable
                                style="width:100%"
                                :fetch-suggestions="querySearchAsync"
                                placeholder=""
                                @select="handleSelect"></el-autocomplete>
              </el-form-item>
              <el-form-item prop="archiveMode"
                            label="主题分类">
                <el-select class="form-input"
                          placeholder=""
                          multiple
                          @change="themeSelection"
                          collapse-tags
                          style="width:100%"
                          v-model="updateFormData.subjectClassification"
                          clearable>
                  <el-option v-for="item in classification"
                            :key="item"
                            :label="item"
                            :value="item"></el-option>

                </el-select>
              </el-form-item>
              <el-form-item prop="archiveMode"
                            label="数据来源">
                <el-select class="form-input"
                          placeholder=""
                          multiple
                          collapse-tags
                          style="width:100%"
                          v-model="updateFormData.publishingUnit"
                          clearable>
                  <el-option v-for="item  in company"
                            :key="item"
                            :label="item"
                            :value="item"></el-option>

                </el-select>
              </el-form-item>
              <el-form-item prop="archiveMode"
                            label="相关体系">
                <el-select class="form-input"
                          placeholder=""
                          multiple
                          @change="systemWideSelection"
                          collapse-tags
                          style="width:100%"
                          v-model="updateFormData.relatedSystem"
                          clearable>
                  <el-option v-for="item  in system"
                            :key="item"
                            :label="item"
                            :value="item"></el-option>

                </el-select>
              </el-form-item>
              <el-form-item prop="archiveMode"
                            label="相关领域">
                <el-select class="form-input"
                          placeholder=""
                          multiple
                          @change="fieldSelection"
                          collapse-tags
                          style="width:100%"
                          v-model="updateFormData.relatedFields"
                          clearable>
                  <el-option v-for="item in field"
                            :key="item"
                            :label="item"
                            :value="item"></el-option>

                </el-select>
              </el-form-item>
              <el-form-item label="一带一路">
                <el-checkbox-group v-model="updateFormData.type">
                  <el-checkbox label=""
                              name="type"></el-checkbox>
                  <div style="width:300px;padding-right:290px"></div>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item prop="archiveMode"
                            label="执行范围">
                <el-select class="form-input"
                          placeholder=""
                          multiple
                          @change="scopeSelection"
                          collapse-tags
                          style="width:100%"
                          v-model="updateFormData.scopeOfExecution"
                          clearable>
                  <el-option v-for="item  in range"
                            :key="item"
                            :label="item"
                            :value="item"></el-option>

                </el-select>
              </el-form-item>
              <el-form-item prop="archiveMode"
                            label="开始时间">
                <el-date-picker v-model="updateFormData.startTime"
                                type="date"
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                :picker-options="pickerOptions1"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="archiveMode"
                            label="结束时间">
                <el-date-picker v-model="updateFormData.endTime"
                                type="date"
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                :picker-options="pickerOptions2"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <div class="dialog-footer"
                  style="text-align: center;">
                <el-button @click="resetForm">清除</el-button>
                <el-button type="primary"
                          @click="searchOperate()">搜索</el-button>

              </div>
            </el-form>
        </div>
 </template>
 
<script>
import { baseRequest } from '@/api/base'
export default {
  data() {
    return {
      updateFormData: {
        publishingStructure: null,
        subjectClassification: '',
        publishingUnit: '',
        relatedSystem: '',
        relatedFields: '',
        type: '',
        scopeOfExecution: '',
        startTime: '',
        endTime: ''
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.updateFormData.endTime !== '') {
            let date = this.updateFormData.endTime + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() > newDate
          }
        }
      },
      pickerOptions2: {
        disabledDate: (time) => {
          if (this.updateFormData.startTime !== '') {
            let date = this.updateFormData.startTime + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() < newDate
          }
        }
      },
      generalSearch: true, // 搜索开关
      seniorForm: false, // 表单开关
      dataValue: '',
      company: null,
      classification: null,
      system: null,
      field: null,
      range: null,
      dropDown: null // 发布机构下拉
    }
  },
  mounted() {
    if (this.defaultValue) {
      this.dataValue = this.defaultValue
    }
    if (this.defaultParams) {
      for (const key in this.defaultParams) {
        if (this.updateFormData.hasOwnProperty(key)) {
          this.updateFormData[key] = this.defaultParams[key]
        }
      }
    }
    baseRequest('/crawlCode/getCrawlCodeOption', { codeType: '1' }).then(response => {
      this.classification = response.data.item
    })
    baseRequest('/websiteInfo/getWebSiteOption').then(response => {
      this.company = response.data.item
    })
    baseRequest('/crawlCode/getCrawlCodeOption', { codeType: '2' }).then(response => {
      this.system = response.data.item
    })
    baseRequest('/crawlCode/getCrawlCodeOption', { codeType: '3' }).then(response => {
      this.field = response.data.item
    })
    baseRequest('/crawlCode/getCrawlCodeOption', { codeType: '4' }).then(response => {
      this.range = response.data.item
    })
    this.$nextTick(_ => {
      document.body.addEventListener('click', this.pannalHandle)
    })
  },
  destroyed() {
    document.body.removeEventListener(this.pannalHandle)
  },
  methods: {
    setText(val) {
      this.dataValue = val
    },
    setParams(params) {
      for (const key in params) {
        if (this.updateFormData.hasOwnProperty(key)) {
          this.updateFormData[key] = params[key]
        }
      }
    },
    // 点击撤销下拉
    pannalHandle() {
      this.seniorForm = false
      this.generalSearch = true
    },
    searchOperate() { // 高级搜索的搜索
      const params = Object.assign(this.updateFormData, { content: this.dataValue })
      this.$emit('searchOperate', params)
      this.seniorForm = false
      this.generalSearch = true
    },
    resetForm() { // 重置表单
      for (const formitem in this.updateFormData) {
        this.updateFormData[formitem] = ''
      }
      this.updateFormData.type = []
    },
    seacrHandle() {
      if (this.dataValue.length <= 0) {
        return false
      }
      this.$emit('seacrHandle', { dataValue: this.dataValue })
    },
    advancedSearch() { // 打开表单
      this.seniorForm = !this.seniorForm
      this.generalSearch = this.seniorForm !== true
    },
    querySearchAsync(queryString, cb) { // 发布机构远程搜索
      baseRequest('/crawlCode/getPublishMechanism', { codeName: queryString, codeType: '5' }).then(response => {
        this.dropDown = response.data.item
        cb(this.dropDown)
      })
    },
    handleSelect(item) { // 下拉选中
      this.updateFormData.publishingStructure = item.value
    },
    themeSelection(val) { // 高级搜索所选选中
      for (const ts in val) {
        if (val[ts] === '全部主题') {
          const ztfl = []
          for (const st in this.classification) {
            ztfl.push(this.classification[st])
          }
          this.updateFormData.subjectClassification = ztfl
        }
      }
    },
    systemWideSelection(val) { // 高级搜索所选选中
      for (const tx in val) {
        if (val[tx] === '全部体系') {
          const ztfl = []
          for (const xt in this.system) {
            ztfl.push(this.system[xt])
          }
          this.updateFormData.relatedSystem = ztfl
        }
      }
    },
    fieldSelection(val) { // 高级搜索所选选中
      for (const ly in val) {
        if (val[ly] === '全部领域') {
          const ztfl = []
          for (const yl in this.field) {
            ztfl.push(this.field[yl])
          }
          this.updateFormData.relatedFields = ztfl
        }
      }
    },
    scopeSelection(val) { // 高级搜索所选选中
      for (const fw in val) {
        if (val[fw] === '全部') {
          const ztfl = []
          for (const wf in this.range) {
            ztfl.push(this.range[wf])
          }
          this.updateFormData.scopeOfExecution = ztfl
        }
      }
    }
  }
}
</script>
