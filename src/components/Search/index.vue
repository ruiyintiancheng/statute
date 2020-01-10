/*
 * @Author: lk 
 * @Date: 2019-12-24 19:52:31 
 * @Last Modified by: lk
 * @Last Modified time: 2020-01-09 18:40:36
 * @Description:  高级搜索
 */
 <template>
  <div class="search">
    <el-input placeholder="请输入内容"
              class="text-search"
              ref="searchInput"
              @keyup.enter.native="seacrHandle"
              v-model="dataValue">
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
      <el-form-item prop="docPositioning"
                    label="定 位">
        <el-select class="form-input"
                   placeholder=""
                   multiple
                   collapse-tags
                   style="width:100%"
                   @change="selectControl($event,'docPositioning','DOC_POSITIONING')"
                   @remove-tag="removeTag"
                   v-model="updateFormData.docPositioning"
                   clearable>
          <el-option v-for="(text,item) in DOC_POSITIONING"
                     :key="item"
                     :label="text"
                     :value="text"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item prop="docTimeliness"
                    label="时效性">
        <el-select class="form-input"
                   placeholder=""
                   collapse-tags
                   style="width:100%"
                   v-model="updateFormData.docTimeliness"
                   clearable>
          <el-option v-for="(text,item) in DOC_TIMELINESS"
                     :key="item"
                     :label="text"
                     :value="item"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item prop="docType"
                    label="公文类型">
        <el-select class="form-input"
                   placeholder=""
                   multiple
                   collapse-tags
                   style="width:100%"
                   @change="selectControl($event,'docType','DOC_TYPE')"
                   v-model="updateFormData.docType"
                   clearable>
          <el-option v-for="(text,item)  in DOC_TYPE"
                     :key="item"
                     :label="text"
                     :value="text"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item prop="issueType"
                    label="发文方式">
        <el-select class="form-input"
                   placeholder=""
                   multiple
                   collapse-tags
                   style="width:100%"
                    @change="selectControl($event,'issueType','ISSUE_TYPE')"
                   v-model="updateFormData.issueType"
                   clearable>
          <el-option v-for="(text,item) in ISSUE_TYPE"
                     :key="item"
                     :label="text"
                     :value="text"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item prop="docUseBroad"
                    label="适用范围">
        <el-select class="form-input"
                   placeholder=""
                   multiple
                   collapse-tags
                   style="width:100%"
                   @change="selectControl($event,'docUseBroad','DOC_USE_BROAD')"
                   v-model="updateFormData.docUseBroad"
                   clearable>
          <el-option v-for="(text,item) in DOC_USE_BROAD"
                     :key="item"
                     :label="text"
                     :value="text"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item prop="issueOrgText"
                    class="single-form-item"
                    label="发布单位">
        <el-autocomplete v-model="updateFormData.issueOrgText"
                         clearable
                         style="width:100%"
                         :fetch-suggestions="querySearchAsync"
                         placeholder=""
                         @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item prop="docSource"
                    class="single-form-item"
                    label="来源网络">
        <el-autocomplete v-model="updateFormData.docSource"
                         clearable
                         style="width:100%"
                         :fetch-suggestions="querySearchAsync2"
                         placeholder=""
                         @select="handleSelect2"></el-autocomplete>
      </el-form-item>
      <el-form-item prop="startTime"
                    label="发布时间">
        <el-date-picker v-model="updateFormData.startTime"
                        type="date"
                        value-format='yyyy-MM-dd'
                        style="width:100%"
                        :picker-options="pickerOptions1"
                        placeholder="开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime"
                    label=" ">
        <el-date-picker v-model="updateFormData.endTime"
                        type="date"
                        value-format='yyyy-MM-dd'
                        style="width:100%"
                        :picker-options="pickerOptions2"
                        placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排 序" prop="orderby" >
          <el-radio v-model="updateFormData.orderby" label="_score">按相似度</el-radio>
          <el-radio v-model="updateFormData.orderby" label="docIssueTime">按发布时间</el-radio>
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
        // publishingStructure: null,
        docPositioning: [],
        docTimeliness: '',
        docType: [],
        issueType: [],
        docUseBroad: [],
        issueOrgText: '',
        docSource: '',
        orderby: '_score',
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
      DOC_POSITIONING: {},
      DOC_TIMELINESS: {},
      DOC_TYPE: {},
      ISSUE_TYPE: {},
      DOC_USE_BROAD: {}
    }
  },
  mounted() {
    baseRequest('/bFieldCode/getBFieldCodeOption').then(response => {
      this.DOC_POSITIONING = response.data.item.DOC_POSITIONING || {}
      this.DOC_TIMELINESS = response.data.item.DOC_TIMELINESS || {}
      this.DOC_TYPE = response.data.item.DOC_TYPE || {}
      this.ISSUE_TYPE = response.data.item.ISSUE_TYPE || {}
      this.DOC_USE_BROAD = response.data.item.DOC_USE_BROAD || {}
    })
    this.$nextTick(_ => {
      document.body.addEventListener('click', this.pannalHandle)
    })
  },
  destroyed() {
    document.body.removeEventListener(this.pannalHandle)
  },
  methods: {
    // 选中控制
    selectControl(val, prop, options) {
      if (val.length && val[val.length - 1] === '全部') {
        const all = []
        for (const key in this[options]) {
          all.push(this[options][key])
        }
        this.updateFormData[prop] = all
      } else if (val.find(item => item === '全部')) {
        this.updateFormData[prop] = this.updateFormData[prop].filter(item => item !== '全部')
      }
    },
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
      this.updateFormData.docPositioning = []
      this.updateFormData.docTimeliness = ''
      this.updateFormData.docType = []
      this.updateFormData.issueType = []
      this.updateFormData.docUseBroad = []
      this.updateFormData.issueOrgText = ''
      this.updateFormData.docSource = ''
      this.updateFormData.orderby = '_score'
      this.updateFormData.starTime = ''
      this.updateFormData.endTime = ''
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
    querySearchAsync(queryString, cb) {
      baseRequest('/bFieldCode/getVagueOption', { codeName: queryString, fieldValue: 'ISSUE_ORG_NAME ' }).then(response => {
        const options = response.data.item
        cb(options)
      })
    },
    handleSelect(item) {
      this.updateFormData.issueOrgText = item.value
    },
    querySearchAsync2(queryString, cb) {
      baseRequest('/bFieldCode/getVagueOption', { codeName: queryString, fieldValue: 'DOC_SOURCE_NAME' }).then(response => {
        const options = response.data.item
        cb(options)
      })
    },
    handleSelect2(item) {
      this.updateFormData.docSource = item.value
    }
  }
}
</script>
