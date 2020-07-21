/*
 * @Author: wk 
 * @Date: 2020-06-02 15:15:55 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-16 09:36:56
 * @Description:  搜索
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
             class="searchForm poli"
             :model="updateFormData"
             label-width="110px">
      <el-form-item prop="docSys"
                    label="政策层次"
                    style="margin-bottom:20px">
        <el-select class="form-input"
                   placeholder=""
                   multiple
                   collapse-tags
                   style="width:100%"
                   @change="selectControl($event,'docSys','Policy_Level')"
                   v-model="updateFormData.docSys"
                   clearable>
          <el-option v-for="(text,item) in Policy_Level"
                     :key="item"
                     :label="text"
                     :value="text"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item prop="fuseField"
                    style="margin-bottom:20px"
                    label="军民融合领域">
        <el-select class="form-input"
                   placeholder=""
                   multiple
                   collapse-tags
                   style="width:100%"
                   @change="selectControl($event,'fuseField','Military_Integration')"
                   v-model="updateFormData.fuseField"
                   clearable>
          <el-option v-for="(text,item) in Military_Integration"
                     :key="item"
                     :label="text"
                     :value="text"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item prop="docType"
                    style="margin-bottom:20px"
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

      <!-- <el-form-item prop="issueType"
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
      </el-form-item> -->
      <el-form-item prop="docUseBroad"
                    style="margin-bottom:20px"
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
      <el-form-item prop="startTime"
                    style="margin-bottom:20px"
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
                    style="margin-bottom:20px"
                    label=" ">
        <el-date-picker v-model="updateFormData.endTime"
                        type="date"
                        value-format='yyyy-MM-dd'
                        style="width:100%"
                        :picker-options="pickerOptions2"
                        placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="startTime"
                    style="margin-bottom:20px"
                    label="生效时间">
        <el-date-picker v-model="updateFormData.docEffStartTime"
                        type="date"
                        value-format='yyyy-MM-dd'
                        style="width:100%"
                        :picker-options="pickerOptions3"
                        placeholder="开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime"
                    style="margin-bottom:20px"
                    label=" ">
        <el-date-picker v-model="updateFormData.docEffEndTime"
                        type="date"
                        value-format='yyyy-MM-dd'
                        style="width:100%"
                        :picker-options="pickerOptions4"
                        placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="startTime"
                    style="margin-bottom:20px"
                    label="废止时间">
        <el-date-picker v-model="updateFormData.docAnnulStartTime"
                        type="date"
                        value-format='yyyy-MM-dd'
                        style="width:100%"
                        :picker-options="pickerOptions5"
                        placeholder="开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime"
                    style="margin-bottom:20px"
                    label=" ">
        <el-date-picker v-model="updateFormData.docAnnulEndTime"
                        type="date"
                        value-format='yyyy-MM-dd'
                        style="width:100%"
                        :picker-options="pickerOptions6"
                        placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发文机构 "
                    style="margin-bottom:20px"
                    prop="Dispatch">
        <el-cascader v-model="Dispatch"
                     clearable
                     placeholder=""
                     ref="dispatch"
                     style="width:100%"
                     collapse-tags
                     @change="articleSelection"
                     :props="{  multiple: true, checkStrictly: true}"
                     :options="organization"></el-cascader>
      </el-form-item>

      <el-form-item prop="docTimeliness"
                    style="margin-bottom:20px"
                    label="时效性">
        <el-select class="form-input"
                   placeholder=""
                   multiple
                   collapse-tags
                   style="width:100%"
                   @change="selectContro($event,'docTimeliness','DOC_TIMELINESS')"
                   v-model="updateFormData.docTimeliness"
                   clearable>
          <el-option v-for="(text,item) in DOC_TIMELINESS"
                     :key="item"
                     :label="text"
                     :value="item"></el-option>

        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="issueOrgText"
                    class="single-form-item"
                    label="发布单位">
        <el-autocomplete v-model="updateFormData.issueOrgText"
                         clearable
                         style="width:100%"
                         :fetch-suggestions="querySearchAsync"
                         placeholder=""
                         @select="handleSelect"></el-autocomplete>
      </el-form-item> -->
      <!-- <el-form-item prop="docSource"
                    class="single-form-item"
                    label="来源网络">
        <el-autocomplete v-model="updateFormData.docSource"
                         clearable
                         style="width:100%"
                         :fetch-suggestions="querySearchAsync2"
                         placeholder=""
                         @select="handleSelect2"></el-autocomplete>
      </el-form-item> -->

      <!-- <el-form-item label="排 序"
                    prop="orderby">
        <el-radio v-model="updateFormData.orderby"
                  label="_score">按相似度</el-radio>
        <el-radio v-model="updateFormData.orderby"
                  label="docIssueTime">按发布时间</el-radio>
      </el-form-item> -->
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
      Dispatch: [], // 发文机构
      organization: [],
      repeatedEngravingForm: {
        docSys: [], // 政策层次
        fuseField: [], // 军民融合领域
        // docPositioning: [],
        docTimeliness: [],
        docType: [],
        // issueType: [],
        docUseBroad: []
      },
      updateFormData: {
        docSys: [], // 政策层次
        fuseField: [], // 军民融合领域
        // publishingStructure: null,
        // docPositioning: [],
        docTimeliness: [],
        docType: [],
        // issueType: [],
        docUseBroad: [],
        issueOrgText: [],
        // docSource: '',
        orderby: '_score',
        startTime: '',
        docEffStartTime: '',
        docAnnulStartTime: '',
        endTime: '',
        docEffEndTime: '',
        docAnnulEndTime: ''
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
      pickerOptions3: {
        disabledDate: (time) => {
          if (this.updateFormData.docEffEndTime !== '') {
            let date = this.updateFormData.docEffEndTime + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() > newDate
          }
        }
      },
      pickerOptions5: {
        disabledDate: (time) => {
          if (this.updateFormData.docAnnulEndTime !== '') {
            let date = this.updateFormData.docAnnulEndTime + ' 00:00:00'
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
      pickerOptions4: {
        disabledDate: (time) => {
          if (this.updateFormData.docEffStartTime !== '') {
            let date = this.updateFormData.docEffStartTime + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() < newDate
          }
        }
      },
      pickerOptions6: {
        disabledDate: (time) => {
          if (this.updateFormData.docAnnulStartTime !== '') {
            let date = this.updateFormData.docAnnulStartTime + ' 00:00:00'
            date = date.replace(/-/g, '/')
            const newDate = new Date(date).getTime()
            return time.getTime() < newDate
          }
        }
      },
      generalSearch: true, // 搜索开关
      seniorForm: false, // 表单开关
      dataValue: '',
      // DOC_POSITIONING: {},
      DOC_TIMELINESS: {},
      DOC_TYPE: {},
      // ISSUE_TYPE: {},
      DOC_USE_BROAD: {},
      Policy_Level: {}, // 政策层次
      Military_Integration: {}// 军民融合领域
    }
  },
  mounted() {
    baseRequest('/bCode/getOrgOption').then(response => {
      this.organization = response.data.item
    })
    const IDs = 'AA-012000000000000000-0001,AA-011000000000000000-0001,AA-003000000000000000-0001,AA-006000000000000000-0001,AA-014000000000000000-0001'
    baseRequest('/bCode/getOptionByFCodeId', { fCodeIds: IDs }).then(response => {
      this.Military_Integration = response.data.item.fuseField || {}
      this.Policy_Level = response.data.item.docSys || {}
      // this.DOC_POSITIONING = response.data.item.DOC_POSITIONING || {}
      this.DOC_TIMELINESS = response.data.item.timeliness || {}
      this.DOC_TYPE = response.data.item.docType || {}
      // this.ISSUE_TYPE = response.data.item.ISSUE_TYPE || {}
      this.DOC_USE_BROAD = response.data.item.docUseBroad || {}
      if (this.Military_Integration && this.Military_Integration !== {}) {
        // this.Military_Integration[0] = '全部'
        this.$set(this.Military_Integration, 0, '全部')
      }
      if (this.Policy_Level && this.Policy_Level !== {}) {
        // this.Policy_Level[0] = '全部'
        this.$set(this.Policy_Level, 0, '全部')
      }
      if (this.DOC_TIMELINESS && this.DOC_TIMELINESS !== {}) {
        // this.DOC_TIMELINESS[0] = '全部'
        this.$set(this.DOC_TIMELINESS, 0, '全部')
      }
      if (this.DOC_TYPE && this.DOC_TYPE !== {}) {
        // this.DOC_TYPE[0] = '全部'
        this.$set(this.DOC_TYPE, 0, '全部')
      }
      if (this.DOC_USE_BROAD && this.DOC_USE_BROAD !== {}) {
        // this.DOC_USE_BROAD[0] = '全部'
        this.$set(this.DOC_USE_BROAD, 0, '全部')
      }
    })
    this.$nextTick(_ => {
      // document.body.addEventListener('click', this.pannalHandle)

      // document.body.addEventListener('click', this.pannalHandle)
      // document.getElementsByClassName('el-date-picker').addEventListener('click', (e) => {
      //   e.stopPropagation()
      // })
    })
  },
  destroyed() {
    document.body.removeEventListener(this.pannalHandle)
  },
  methods: {
    articleSelection(item) {
      // const checknodes = this.$refs.dispatch.getCheckedNodes()
      const arr = []
      if (item) {
        for (const i of item) {
          // arr = arr.concat(i)
          // arr.push(i.data.value + '|' + i.data.label)
          if (i.length === 1) {
            const fa = this.organization.filter((n) => {
              return n.value === i[0]
            })
            arr.push(fa[0].value)
          } else if (i.length > 1) {
            const f = this.organization.filter((n) => {
              return n.value === i[0]
            })
            const ch = f[0].children.filter((n) => {
              return n.value === i[1]
            })
            arr.push(ch[0].value)
          }
        }
      }

      this.updateFormData.issueOrgText = arr
    },
    // 选中控制
    selectControl(val, prop, options) {
      if (val.length && val[val.length - 1] === '全部') {
        const all = []
        for (const key in this[options]) {
          all.push(this[options][key])
        }
        this.updateFormData[prop] = all
        this.repeatedEngravingForm[prop] = all
      } else if (val.find(item => item === '全部')) {
        this.updateFormData[prop] = this.updateFormData[prop].filter(item => item !== '全部')
        this.repeatedEngravingForm[prop] = this.updateFormData[prop].filter(item => item !== '全部')
      } else if (val.find(item => item !== '全部')) {
        const all = []
        for (const key in this[options]) {
          all.push(this[options][key])
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
    selectContro(val, prop, options) {
      if (val.length && val[val.length - 1] === '0') {
        const all = []
        for (const key in this[options]) {
          all.push(key)
        }
        this.updateFormData[prop] = all
        this.repeatedEngravingForm[prop] = all
      } else if (val.find(item => item === '0')) {
        this.updateFormData[prop] = this.updateFormData[prop].filter(item => item !== '0')
        this.repeatedEngravingForm[prop] = this.updateFormData[prop].filter(item => item !== '0')
      } else if (val.find(item => item !== '0')) {
        const all = []
        for (const key in this[options]) {
          all.push(key)
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
    setText(val) {
      this.dataValue = val
    },
    setParams(params) {
      this.Dispatch = params.Dispatch
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
      // const params = Object.assign(this.updateFormData, { content: this.dataValue })
      const params = {}
      // params.Dispatch = this.Dispatch
      params.docTittle = this.dataValue
      params.endTime = this.updateFormData.endTime
      params.docEffEndTime = this.updateFormData.docEffEndTime
      params.docAnnulEndTime = this.updateFormData.docAnnulEndTime
      params.startTime = this.updateFormData.startTime
      params.docEffStartTime = this.updateFormData.docEffStartTime
      params.docAnnulStartTime = this.updateFormData.docAnnulStartTime
      // params.orderby = this.updateFormData.orderby
      params.issueOrgText = this.updateFormData.issueOrgText.filter(item => item !== '全部').join('|')
      params.docUseBroad = this.updateFormData.docUseBroad.filter(item => item !== '全部').join('|')
      params.docType = this.updateFormData.docType.filter(item => item !== '全部').join('|')
      params.docTimeliness = this.updateFormData.docTimeliness.filter(item => item !== '全部').join('|')
      params.fuseField = this.updateFormData.fuseField.filter(item => item !== '全部').join('|')
      params.docSys = this.updateFormData.docSys.filter(item => item !== '全部').join('|')
      this.$emit('searchOperate', params)
      this.seniorForm = false
      this.generalSearch = true
    },
    resetForm() { // 重置表单
      this.Dispatch = []
      this.updateFormData.docSys = [] // 政策层次
      this.updateFormData.fuseField = [] // 军民融合领域
      // this.updateFormData.docPositioning = []
      this.updateFormData.docTimeliness = []
      this.updateFormData.docType = []
      // this.updateFormData.issueType = []
      this.updateFormData.docUseBroad = []
      this.updateFormData.issueOrgText = []
      // this.updateFormData.docSource = ''
      this.updateFormData.orderby = '_score'
      this.updateFormData.startTime = ''
      this.updateFormData.docEffStartTime = ''
      this.updateFormData.docAnnulStartTime = ''
      this.updateFormData.endTime = ''
      this.updateFormData.docEffEndTime = ''
      this.updateFormData.docAnnulEndTime = ''
    },
    seacrHandle() {
      // if (this.dataValue.length <= 0) {
      //   return false
      // }
      this.$emit('seacrHandle', { docTittle: this.dataValue })
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
<style lang="scss" scoped>
.poli {
  padding: 25px 30px;
}
</style>