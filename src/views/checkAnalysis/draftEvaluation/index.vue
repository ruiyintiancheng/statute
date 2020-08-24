/*
 * @Author: weilq 
 * @Date: 2020-4-14 14:11:00 
 * @Last Modified by: 
 * @Last Modified time:
 * @Description:  草案评估
 */
<template>
  <div style="width:100%; height: 100%; position: relative;">
    <div class="box box_centre">
      <!-- 目标文件 -->
      <div class="content box_centre">
        <div class="line clearfix" style="text-align: center;">
          <div class="cell">草案:</div>
          <div class="cell" style="width: 80%;"><el-input v-model="sourceFileName" :disabled="true" placeholder=""></el-input></div>
          <div class="cell">
            <el-upload
              ref="upload"
              :action="uploadUrl"
              :on-change="sourceChange"
              :file-list="fileList"
              :http-request="sourceUploadRequest"
              :auto-upload="true">
              <el-button slot="trigger" class="menu" size="small">上传</el-button>
            </el-upload>
          </div>
        </div>
        <div class="line clearfix" style="text-align: center;">
          <div><el-button class="menu" size="small" @click="compare">开始评估</el-button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUpload } from '@/api/base'
export default {
  components: {
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
      uploadUrl: '/wsClient/upload',
      sourceFileName: null,
      fileList: []
    }
  },
  created() {

  },
  mounted() {
    // this.uploadFileId = 605
    // this.sourceFileName = '国防科技创新快速响应小组（深圳）2020年第7批需求名单.txt'

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
      if (this.uploadFileId === null) {
        this.$message({
          showClose: true,
          message: '请选择文件',
          type: 'error'
        })
        return
      }
      const path = this.$route.params.path ? this.$route.params.path : this.$route.path
      this.$router.push({
        name: 'draft-index',
        query: {
          uploadFileId: this.uploadFileId,
          menuId: this.menuId
        },
        params: {
          path,
          sourceFileName: this.sourceFileName
        }
      })
    },
    sourceChange(file, fileList) {
      this.sourceFileName = file.name
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
    /* margin: auto; */
    top: 20%;
    bottom: 0;
    left: 50%;
    right: 0;
    transform: translateX(-50%);
  }

  .content {
    width: 800px;
    height: 100px;
  }

  .line {
    line-height: 40px;
    height: 50px;
    position: relative;
  }
  .cell {
    padding: 0 10px;
    float: left;
  }
</style>
