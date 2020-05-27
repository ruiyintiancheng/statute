<template>
    <div class="learn-upload" v-loading="loading" element-loading-text="上传中,请稍后...">
        <span class="upload-warning">*仅支持zip、doc、docx、txt格式文件上传,且文件大小不大于100M</span>
                <el-upload
                    class="avatar-uploader"
                    ref="upload"
                    :action="uploadUrl"
                    :http-request="sourceUploadRequest"
                    :show-file-list="false"
                    :auto-upload="true">
                    <i  class="el-icon-upload avatar-uploader-icon">点击上传</i>
                    </el-upload>
          <el-dialog title="上传结果"
               :visible.sync="uploadDetailVisable"
               width="45%"
               custom-class="dialog-default fixedHeight"
               >
            <div class="dialog-contant-default" v-if="uploadDetailVisable">
              <div class="upload-detail-tip">
                上传成功
                  <a class="sc" @click="openResultList">3</a>
                  个,上传失败
                  <a class="fa" @click="openResultList">4
                  </a>个
              </div>
            </div>
                  <div slot="footer"
                class="dialog-footer">
              <el-button @click="openResultList">查看明细</el-button>
              <el-button @click="uploadDetailVisable = false">关闭</el-button>
            </div>
          </el-dialog>
          <el-dialog title="上传结果明细"
               :visible.sync="uploadResult"
               width="80%"
               append-to-body
               custom-class="dialog-default no-footer">
          <div class="dialog-contant-default" v-if="uploadResult">
            <el-table :data="tableData"
                  border
                  :height="tableHeight"
                  >
                <el-table-column prop="agntName"
                                label="ID"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="agntName"
                                label="文件名称"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="agntName"
                                label="状态"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="agntName"
                                label="时间"
                                align="center"
                                min-width="200">
                </el-table-column>
                <el-table-column prop="agntName"
                                label="上传状态"
                                align="center"
                                min-width="200">
                </el-table-column>
                  </el-table>
          </div>
        </el-dialog>
    </div>
</template>
<script>
// import { baseUpload } from '@/api/base'
export default {
  props: {
    labelId: Number
  },
  data() {
    return {
      uploadUrl: '/wsClient/upload',
      loading: false,
      uploadDetailVisable: false,
      uploadResult: false,
      tableData: [],
      tableHeight: 0
    }
  },
  mounted() {
    this.getTableHeight()
  },
  methods: {
    openResultList() {
      this.uploadResult = true
    },
    getTableHeight() {
      this.$nextTick(_ => {
        this.tableHeight = document.body.offsetHeight * 0.75 - 90
      })
    },
    sourceUploadRequest(content) {
      const patt = new RegExp('.*\.(zip|txt|doc|docx)$')
      if (!patt.test(content.file.name)) {
        this.$refs.upload.clearFiles
        this.$message({
          showClose: true,
          message: '错误的文件类型,请选择zip/txt/doc/docx文件上传',
          type: 'error'
        })
        return
      }
      const isLt100M = content.file.size / 1024 / 1024 < 100
      if (!isLt100M) {
        this.$refs.upload.clearFiles
        this.$message({
          showClose: true,
          message: '文件大小不能超过100M',
          type: 'error'
        })
        return
      }
      var form = new FormData()
      form.append('file', content.file)
      // this.loading = true
      this.uploadDetailVisable = true

      // baseUpload(this.uploadUrl, form).then((response) => {
      //   this.uploadDetailVisable = true
      //   this.loading = false
      // }, _ => {
      //   this.$refs.upload.clearFiles()
      //   this.loading = false
      //   this.$message({
      //     showClose: true,
      //     message: '上传失败',
      //     type: 'error'
      //   })
      // })
    }
  }
}
</script>
<style lang="scss">
.learn-upload{
    position: relative;
    .upload-warning{
        font-size: 14px;
        color:#F56C6C;
    }
}
.upload-detail-tip{
    margin-top: 40px;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #606266;
    a{
      text-decoration: underline;
      &.sc{
        color:#67C23A;
      }
      &.fa{
        color:#F56C6C;
      }
    }
}
</style>
<style>
  .avatar-uploader .el-upload {
    margin: 100px auto;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: block;
    width: 278px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 278px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    color: #409EFF;
  }
  .avatar {
    width: 278px;
    height: 178px;
    display: block;
  }
</style>