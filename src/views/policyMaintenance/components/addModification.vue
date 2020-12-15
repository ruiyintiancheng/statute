/*
 * @Author: wk 
 * @Date: 2020-06-02 16:50:54 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-12-15 14:48:05
 * @Description:  添加修改
 */
<template>
  <div v-if="pringBox">
    <!-- <el-dialog :title="dialogTitle[operateStatus]" -->
    <el-dialog title="政策公文"
               v-el-drag-dialog
               :visible.sync="pringBox"
               width="1100px"
               custom-class="dialog-default autoHeight">
      <div class="dialog-contant-default"
           style="height:500px;overflow:auto">
        <el-form :inline="true"
                 ref="formOutside"
                 :model="updateFormData"
                 label-width="125px">
          <el-form-item label="军民融合相关度">
            <el-select v-model="updateFormData.about"
                       clearable
                       style="width:200px"
                       placeholder="">
              <el-option v-for=" item in allDrop.about"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker v-model="updateFormData.docIssueTime"
                            type="date"
                            style="width:200px"
                            value-format="yyyy-MM-dd"
                            placeholder="">
            </el-date-picker>

          </el-form-item>
          <el-form-item label="内容体系">
            <el-select v-model="updateFormData.docContentSys "
                       clearable
                       multiple
                       style="width:200px"
                       collapse-tags
                       placeholder="">
              <el-option v-for=" item in allDrop.docContentSys"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="生效时间">
            <el-date-picker v-model="updateFormData.docEffectiveTime"
                            type="date"
                            style="width:200px"
                            value-format="yyyy-MM-dd"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="领域类型">
            <el-select v-model="updateFormData.docDomainType "
                       clearable
                       style="width:200px"
                       multiple
                       collapse-tags
                       placeholder="">
              <el-option v-for=" item in allDrop.docDomainType"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="废止时间">
            <el-date-picker v-model="updateFormData.docAnnulTime"
                            type="date"
                            style="width:200px"
                            value-format="yyyy-MM-dd"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="评估重点">
            <el-select v-model="updateFormData.docFocalPoint"
                       clearable
                       style="width:200px"
                       placeholder="">
              <el-option v-for=" item in allDrop.docFocalPoint"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="军民融合条款摘录">
            <el-input type="textarea"
                      style="width:539px"
                      v-model="updateFormData.docSummary"></el-input>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.docKeyWord"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="政策原文名称">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.docName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="政策法规文号">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.docNum"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="可操作性">
            <el-select v-model="updateFormData.docOperability"
                       clearable
                       style="width:200px"
                       placeholder="">
              <el-option v-for=" item in allDrop.docOperability"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="定位">
            <el-select v-model="updateFormData.docPositioning "
                       clearable
                       multiple
                       style="width:200px"
                       collapse-tags
                       placeholder="">
              <el-option v-for=" item in allDrop.docPositioning"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="密级">
            <el-select v-model="updateFormData.docSecretClass"
                       clearable
                       style="width:200px"
                       placeholder="">
              <el-option v-for=" item in allDrop.docSecretClass"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="政策体系">
            <el-select v-model="updateFormData.docSys "
                       clearable
                       style="width:200px"
                       multiple
                       collapse-tags
                       placeholder="">
              <el-option v-for=" item in allDrop.docSys"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="政策法规名称">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.docTittle"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="文章类型">
            <el-select v-model="updateFormData.docType "
                       clearable
                       style="width:200px"
                       multiple
                       collapse-tags
                       placeholder="">
              <el-option v-for=" item in allDrop.docType"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="链接地址">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.docUri"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="适用范围">
            <el-select v-model="updateFormData.docUseBroad "
                       clearable
                       style="width:200px"
                       multiple
                       collapse-tags
                       placeholder="">
              <el-option v-for=" item in allDrop.docUseBroad"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="适用范围描述">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.docUseBroadText"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="关联法规名称">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.fDocTittle"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="关联法规文号">
            <el-input class="form-input"
                      style="width:200px"
                      v-model="updateFormData.fDocNum"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="军民融合领域">
            <el-select v-model="updateFormData.fuseField "
                       clearable
                       style="width:200px"
                       multiple
                       collapse-tags
                       placeholder="">
              <el-option v-for=" item in allDrop.fuseField"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发文机构">
            <el-cascader v-model="Dispatch"
                         clearable
                         placeholder=""
                         ref="dispatch"
                         style="width:200px"
                         collapse-tags
                         @change="articleSelection"
                         :props="{  multiple: true, checkStrictly: true}"
                         :options="organization"></el-cascader>
          </el-form-item>
          <el-form-item label="发布单位类型">
            <el-select v-model="updateFormData.issueOrgType "
                       clearable
                       style="width:200px"
                       multiple
                       collapse-tags
                       placeholder="">
              <el-option v-for=" item in allDrop.issueOrgType"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发文方式">
            <el-select v-model="updateFormData.issueType"
                       clearable
                       style="width:200px"
                       placeholder="">
              <el-option v-for=" item in allDrop.issueType"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item label="是否属于新形式新任务"
                        label-width="auto">
            <el-select v-model="updateFormData.newSituaTask"
                       clearable
                       style="width:200px"
                       placeholder="">
              <el-option label="是"
                         value="是"></el-option>
              <el-option label="否"
                         value="否"></el-option>

            </el-select>
          </el-form-item>

          <el-form-item>

          </el-form-item>
        </el-form>

        <!-- <div class="enclosure">
          <span>政策公文:</span>
          <el-input v-model="wzName"
                    :disabled="true"
                    style="width: 500px;"
                    placeholder=""></el-input>
          <el-upload ref="upload"
                     action="/bDocBasic/uploadDoc"
                     :on-change="wzChange "
                     style=" display: inline-block"
                     :show-file-list="false"
                     :http-request="sourceUploadRequest"
                     :auto-upload="true">
            <el-button slot="trigger"
                       class="menu"
                       size="small">上传</el-button>

          </el-upload>
        </div> -->
        <div class="enclosure"
             v-for="(item,index) in form"
             :key="item+index">
          <span>附件:</span>
          <el-input v-model="item.value"
                    :disabled="true"
                    style="width: 500px;"
                    placeholder=""></el-input>
          <el-upload :ref="'upload'+index"
                     action="/bDocBasic/uploadAnnexDoc"
                     :on-change="(file, fileList)=>{sourceChange(file, fileList, index)} "
                     style=" display: inline-block"
                     :show-file-list="false"
                     :http-request="(content)=>{sourceUploadRequest1(content,index)}"
                     :auto-upload="true">
            <el-button slot="trigger"
                       class="menu"
                       size="small">上传</el-button>
            <el-button v-if="form.length > 1"
                       @click="minusOption(index)"
                       icon="el-icon-minus"
                       plain
                       size="small"></el-button>
            <el-button @click="addOption"
                       v-if="index === form.length-1"
                       icon="el-icon-plus"
                       plain
                       size="small"></el-button>
          </el-upload>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
            <el-upload ref="upload"
                     action="/bDocBasic/uploadDoc"
                     style=" display: inline-block"
                     :show-file-list="false"
                     :http-request="sourceUploadRequest"
                     :auto-upload="true">
            <el-button slot="trigger"
                      >重新上传</el-button>
                       </el-upload>
        <el-button type="danger" plain @click="deleteHandle">删除</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseRequest, baseUpload } from '@/api/base' // baseUpload
import { deepClone } from '@/utils'
export default {
  data() {
    return {
      articleId: '',
      value1: '',
      value2: '',
      value3: '',
      allDrop: {},
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改',
        3: '删除'
      },
      // outsideRules: {
      //   formulaName: [
      //     { required: true, message: '该项为必填项' }
      //   ],
      //   actionId: [
      //     { required: true, message: '该项为必填项' }
      //   ]
      // },
      wzName: '',
      form: [{ value: '' }],
      operateStatus: null, // 操作选项
      pringBox: false, // 父类数据弹框开关
      Dispatch: [], // 发文机构
      organization: [],
      updateFormData: {
        about: '',
        docIssueTime: '',
        docEffectiveTime: '',
        docAnnulTime: '',
        endTime: '',
        docEffEndTime: '',
        docAnnulEndTime: '',
        docContentSys: '',
        docDomainType: '',
        docKeyWord: '',
        docFocalPoint: '',
        docName: '',
        docNum: '',
        docOperability: '',
        docPositioning: '',
        docSecretClass: '',
        docSummary: '',
        docSys: '',
        docTittle: '',
        docType: '',
        docUri: '',
        docUseBroad: '',
        docUseBroadText: '',
        fDocNum: '',
        fDocTittle: '',
        fuseField: '',
        issueOrgText: '',
        issueOrgType: '',
        issueType: '',
        newSituaTask: ''
      }
    }
  },
  mounted() {
    baseRequest('/bCode/getOptionByFCodeId', { dfa: 32132132132132 }).then(response => {
      this.allDrop = response.data.item
    })
    baseRequest('/bCode/getOrgOption').then(response => {
      this.organization = response.data.item
    })
  },
  methods: {
    saveOperate() {
      if (this.articleId) {
        baseRequest(process.env.CHART_API + '/chart/updateGData', {}).then(_ => {
          baseRequest(process.env.CHART_API + '/chart/updateGragh', {}).then(_ => {

          })
        })
        const params = deepClone(this.updateFormData)
        params.id = this.articleId
        params.docContentSys = params.docContentSys ? params.docContentSys.join(';') : ''
        params.docDomainType = params.docDomainType ? params.docDomainType.join(';') : ''
        params.docPositioning = params.docPositioning ? params.docPositioning.join(';') : ''
        params.docSys = params.docSys ? params.docSys.join(';') : ''
        params.docType = params.docType ? params.docType.join(';') : ''
        params.docUseBroad = params.docUseBroad ? params.docUseBroad.join(';') : ''
        params.fuseField = params.fuseField ? params.fuseField.join(';') : ''
        // this.articleSelection(this.Dispatch)

        params.issueOrgText = params.issueOrgText ? params.issueOrgText.join(';') : ''
        params.issueOrgType = params.issueOrgType ? params.issueOrgType.join(';') : ''

        baseRequest('/bDocBasic/update', params).then(response => {
          this.$parent.searchOption()
          this.pringBox = false
          this.$Message.success('操作成功')
        })
      } else {
        this.$Message.warning('请先上传文章')
        return
      }
    },
    deleteHandle() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/bDocBasic/delete', { id: this.articleId }).then(response => {
          this.$Message.success('操作成功')
          this.pringBox = false
          this.$emit('searchOption')
        })
      })
    },
    maintainMod(data) {
      this.operateStatus = 2
      this.articleId = data.id
      baseRequest('/bDocBasic/select', { id: this.articleId }).then(response => {
        const updata = response.data.item
        this.updateFormData = response.data.item
        this.updateFormData.docContentSys = updata.docContentSys ? updata.docContentSys.split(';') : ''
        this.updateFormData.docDomainType = updata.docDomainType ? updata.docDomainType.split(';') : ''
        this.updateFormData.docPositioning = updata.docPositioning ? updata.docPositioning.split(';') : ''
        this.updateFormData.docSys = updata.docSys ? updata.docSys.split(';') : ''
        this.updateFormData.docType = updata.docType ? updata.docType.split(';') : ''
        this.updateFormData.docUseBroad = updata.docUseBroad ? updata.docUseBroad.split(';') : ''
        this.updateFormData.fuseField = updata.fuseField ? updata.fuseField.split(';') : ''
        this.updateFormData.issueOrgText = updata.issueOrgText ? updata.issueOrgText.split(';') : ''
        this.updateFormData.issueOrgType = updata.issueOrgType ? updata.issueOrgType.split(';') : ''
        if (updata.docFile) {
          const w = updata.docFile.split(';')
          const z = []
          for (const item of w) {
            if (item.lastIndexOf('/') !== -1) {
              z.push({ value: item.slice(item.lastIndexOf('/')) })
            } else {
              z.push({ value: item.slice(0) })
            }
          }
          this.wzName = z[0].value
          z.shift()
          this.form = z
          if (this.form.length <= 0) {
            this.form = [{ value: '' }]
          }
        } else {
          this.form = [{ value: '' }]
        }
        if (updata.issueOrgText) {
          const c = updata.issueOrgText.join(';')
          baseRequest('/bCode/getTwoLevelOpt', { codeName: c }).then(response => {
            this.Dispatch = response.data.item
          })
        }
        this.pringBox = true
      }).finally(_ => {
        // this.$emit('changeLoading', false)
      })
    },
    resetFuJian(data) {
      this.operateStatus = 2
      this.articleId = data.id
      baseRequest('/bDocBasic/select', { id: this.articleId }).then(response => {
        const updata = response.data.item
        if (updata.docFile) {
          const w = updata.docFile.split(';')
          const z = []
          for (const item of w) {
            if (item.lastIndexOf('/') !== -1) {
              z.push({ value: item.slice(item.lastIndexOf('/')) })
            } else {
              z.push({ value: item.slice(0) })
            }
          }
          this.wzName = z[0].value
          z.shift()
          this.form = z
          if (this.form.length <= 0) {
            this.form = [{ value: '' }]
          }
        } else {
          this.form = [{ value: '' }]
        }
        if (updata.issueOrgText) {
          const c = updata.issueOrgText.join(';')
          baseRequest('/bCode/getTwoLevelOpt', { codeName: c }).then(response => {
            this.Dispatch = response.data.item
          })
        }
        this.pringBox = true
      }).finally(_ => {
        // this.$emit('changeLoading', false)
      })
    },
    maintainAdd() {
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      this.Dispatch = []
      this.articleId = ''
      this.form = [{ value: '' }]
      this.wzName = ''
      this.pringBox = true
      this.$nextTick(_ => {
        this.$refs.formOutside.clearValidate()
      })
    },
    addOption() {
      this.form.push({ value: '' })
    },
    minusOption(index) {
      if (this.form.length <= 1) {
        return
      }
      if (this.form[index].value) {
        this.$confirm('此操作将永久删除该附件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          baseRequest('/bDocBasic/delAnnexDoc', { id: this.articleId, annexIndex: index + 1 }).then(response => {
            this.$message.success('附件删除成功')
            this.maintainMod({ id: this.articleId })
            // this.form.splice(index, 1)
          })
        })
      }
    },
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
            arr.push(fa[0].label)
          } else if (i.length > 1) {
            const f = this.organization.filter((n) => {
              return n.value === i[0]
            })
            const ch = f[0].children.filter((n) => {
              return n.value === i[1]
            })
            arr.push(ch[0].label)
          }
        }
      }

      this.updateFormData.issueOrgText = arr
    },
    sourceChange(file, fileList, index) {
      this.form[index].value = file.name
      this.sourceFileName = file.name
    },
    wzChange(file, fileList) {
      this.wzName = file.name
    },
    sourceUploadRequest(content) {
      const patt = new RegExp('.*\.(txt|doc|docx)$')
      if (!patt.test(content.file.name)) {
        // this.$refs.upload.clearFiles
        this.$message({
          showClose: true,
          message: '错误的文件类型,请选择txt/doc/docx文件上传',
          type: 'error'
        })
        return
      }
      // const isLt100M = content.file.size / 1024 / 1024 < 100
      // if (!isLt100M) {
      //   this.$refs.upload.clearFiles
      //   this.$message({
      //     showClose: true,
      //     message: '文件大小不能超过100M',
      //     type: 'error'
      //   })
      //   return
      // }
      var form = new FormData()
      form.append('file', content.file)
      form.append('id', this.articleId || '')
      // this.loading = true
      this.pringBox = false
      this.$emit('changeLoading', true)

      baseUpload('/bDocBasic/uploadDoc', form).then((response) => {
        this.loading = false
        this.articleId = response.data.item.id
        this.$emit('searchOption')
        this.maintainMod({ id: this.articleId })
        this.$message.success('导入成功')
      }, _ => {
        // this.$refs.upload.clearFiles()
        this.loading = false
        this.$message({
          showClose: true,
          message: '上传失败',
          type: 'error'
        })
      }).finally(_ => {
        this.$emit('changeLoading', false)
      })
    },
    sourceUploadRequest1(content, index) { // 上传附件
      if (this.articleId) {
        const patt = new RegExp('.*\.(txt|doc|docx)$')
        if (!patt.test(content.file.name)) {
          this.$message({
            showClose: true,
            message: '错误的文件类型,请选择txt/doc/docx文件上传',
            type: 'error'
          })
          this.resetFuJian({ id: this.articleId })
          return
        }
        // const isLt100M = content.file.size / 1024 / 1024 < 100
        // if (!isLt100M) {
        //   this.$refs.upload.clearFiles
        //   this.$message({
        //     showClose: true,
        //     message: '文件大小不能超过100M',
        //     type: 'error'
        //   })
        //   return
        // }
        var form = new FormData()
        form.append('file', content.file)
        form.append('id', this.articleId)
        form.append('annexIndex', index + 1)
        this.loading = true

        baseUpload('/bDocBasic/uploadAnnexDoc', form).then((response) => {
          this.loading = false
          // this.articleId = response.data.item.id
          this.resetFuJian({ id: this.articleId })
          this.$message.success('附件添加成功')
        }, _ => {
          this.loading = false
          this.resetFuJian({ id: this.articleId })
          this.$message({
            showClose: true,
            message: '上传失败',
            type: 'error'
          })
        })
      } else {
        this.$message.warning('请先上传文章')
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.enclosure {
  // text-align: center;
  margin: 10px auto;
  padding-left: 227px;
}
</style>