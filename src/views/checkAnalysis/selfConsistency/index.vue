/*
 * @Author: weilq 
 * @Date: 2020-4-14 14:11:00 
 * @Last Modified by: 
 * @Last Modified time:
 * @Description:  自洽性校验
 */
<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <div class="box box_centre" style="margin: 0 auto; top: 20%;">
      <!-- 目标文件 -->
      <div class="content box_centre">
        <div class="line clearfix">
          <div class="cell">目标文件:</div>
          <div class="cell" style="width: 500px;"><el-input v-model="sourceFileName" :disabled="true" placeholder=""></el-input></div>
          <div class="cell">
            <el-upload
              ref="upload"
              :action="uploadUrl"
              :on-change="sourceChange"
              :file-list="fileList"
              :http-request="sourceUploadRequest"
              :auto-upload="true">
              <el-button slot="trigger" class="menu" size="small">上传</el-button>
              <el-button class="menu2" size="small" @click="openDialog('source')">选择库中公文</el-button>
            </el-upload>
          </div>
        </div>
        <div class="line clearfix">
          <div class="cell">对比公文:</div>
          <div class="cell" style="width: 500px;"><el-input v-model="targetFileName" :disabled="true" placeholder=""></el-input></div>
          <div class="cell">
            <el-button class="menu2" size="small" @click="openDialog('target')">选择库中公文</el-button>
          </div>
        </div>
        <div class="line clearfix" style="text-align: center;">
          <div><el-button class="menu" size="small" @click="compare">开始对比</el-button></div>
        </div>
      </div>
    </div>
    <search-table ref="searchTable" @selectFileName="selectFileName"></search-table>
  </div>
</template>

<script>
import searchTable from './searchTable'
import { baseUpload } from '@/api/base'
export default {
  components: {
    searchTable
  },
  props: {

  },
  computed: {

  },
  data() {
    return {
      menuId: null,
      item: {},
      // 上传文件
      uploadFileId: null,
      // 目标文件
      targetFileId: null,
      // 对比文件
      contrastFileId: null,
      // 目标文件
      sourceFileName: null,
      // 对比文件名称
      targetFileName: null,
      uploadUrl: '/wsClient/upload',
      fileList: []
    }
  },
  created() {
  },
  mounted() {
    const path = this.$route.path
    this.menuId = path.slice(path.lastIndexOf('/') + 1)

    this.$nextTick(() => {
      document.querySelector('.el-upload-list.el-upload-list--text').style.display = 'none'
    })
  },
  methods: {
    openDialog(val) {
      this.$refs.searchTable.openDialog(val)
    },
    // 开始对比
    compare() {
      // this.targetFileId = 500345
      // this.contrastFileId = 500345

      if ((this.uploadFileId === null && this.targetFileId === null) ||
        this.contrastFileId === null) {
        this.$message({
          showClose: true,
          message: '请选择文件',
          type: 'error'
        })
        return
      }
      const path = this.$route.params.path ? this.$route.params.path : this.$route.path
      this.$router.push({
        name: 'selfCompare',
        query: {
          uploadFileId: this.uploadFileId,
          targetFileId: this.targetFileId,
          contrastFileId: this.contrastFileId,
          sourceFileName: this.sourceFileName,
          targetFileName: this.targetFileName,
          menuId: this.menuId
        },
        params: {
          path
        }
      })
    },
    // 选择库中文件
    selectFileName(type, row) {
      if (type === 'source') {
        this.sourceFileName = row.docName
        this.targetFileId = row.id
        this.uploadFileId = null
      }
      if (type === 'target') {
        this.targetFileName = row.docName
        this.contrastFileId = row.id
      }
    },
    sourceChange(file, fileList) {
      this.sourceFileName = file.name
    },
    targetChange(file, fileList) {
      this.targetFileName = file.name
    },
    // 上传文件
    sourceUploadRequest(content) {
      const patt = new RegExp('.*\.(txt|doc|docx)$')
      if (!patt.test(content.file.name)) {
        this.sourceFileName = null
        this.$refs.upload.clearFiles
        this.$message({
          showClose: true,
          message: '错误的文件类型,请选择txt/doc/docx文件上传',
          type: 'error'
        })
        return
      }
      var form = new FormData()
      form.append('file', content.file)
      baseUpload(this.uploadUrl, form).then((response) => {
        content.onSuccess('文件上传成功！')
        this.uploadFileId = response.data.item.fileId
        this.sourceFileName = response.data.item.fileName
        this.targetFileId = null
      }, _ => {
        this.$refs.upload.clearFiles()
        this.item.fileId = null
        this.$message({
          showClose: true,
          message: '文件上传失败',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style scoped>
  .menu {
    background-color: #3164b7;
    color: white;
  }
  .menu2 {
    background-color: white;
    color: black;
  }

  .box {
    width: 900px;
    height: 250px;
    border: 1px solid #dddddd;
  }
  
  .box_centre {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .content {
    width: 800px;
    height: 150px;
  }

  .line {
    line-height: 40px;
    height: 50px;
    width: 900px;
    position: relative;
  }
  .cell {
    padding: 0 10px;
    float: left;
  }
</style>
