/*
 * @Author: weilq 
 * @Date: 2020-7-8
 * @Last Modified by: 
 * @Last Modified time:
 * @Description:  草案页面
 */
<template>
  <div v-loading="mainLoading" style="width:100%; position: relative;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="内容对比" name="first">
        <div style="width: 75%; margin: 1px auto 15px;">
          <div class="table-head">
            <el-row class="row-cell">
              <el-col class="grid" :span="24">
                <div style="font-size: 1.3em;">
                  总分值: <span class="score">{{compareScore.score}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row class="row-cell">
              <el-col :span="6" class="grid">
                <div style="text-align: center;">可行性评估</div>
              </el-col>
              <el-col class="col-cell grid" :span="12">
                <div class="">矛盾性: <span class="score">{{compareScore.contradict}}</span></div>
              </el-col>
              <el-col :span="6" class="grid">
                <div style="text-align: center;">
                  <el-button v-if="!body2Show" slot="trigger" class="menu" size="mini" @click="openDialog">查看详情</el-button>
                  <el-button v-else slot="trigger" class="menu" size="mini" @click="toIndex">返回</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row class="row-cell">
              <el-col :span="6" class="grid">
                <div style="text-align: center;">质量评估</div>
              </el-col>
              <el-col :span="12" class="col-cell">
                <el-row>
                  <el-col :span="24" class="bottom-cell" style="line-height: 25px; padding: 0 20px;">
                    <div>操作性: <span class="score">{{compareScore.fraction}}</span></div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style="line-height: 25px; padding: 0 20px;">
                    <div>时效性: <span class="score">{{compareScore.timeliness}}</span></div>
                  </el-col>
                </el-row>                
              </el-col>
              <el-col :span="6" class="grid">
                <div style="text-align: center;">
                  <el-button v-if="!body3Show" slot="trigger" class="menu" size="mini" @click="selOperable">查看详情</el-button>
                  <el-button v-else slot="trigger" class="menu" size="mini" @click="toIndex">返回</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-body">
            <router-view></router-view>
          </div>
        </div>  
      </el-tab-pane>
      <el-tab-pane label="帮助" name="second">
        <help></help>
      </el-tab-pane>
    </el-tabs>
    <search-table ref="searchTable" @selectFileName="selectFileName"></search-table>
  </div>
</template>

<script>
// import { baseUpload } from '@/api/base'
import { baseRequest } from '@/api/base'
import searchTable from './components/searchTable'
import help from './components/help'
export default {
  components: {
    searchTable,
    help
  },
  props: {

  },
  computed: {

  },
  data() {
    return {
      mainLoading: true,
      activeName: 'first',
      viewHeight: 500,

      uploadFileId: null, // 上传文件id
      fileName: '',
      actionId: null, // 菜单id

      compareScore: {
        themes: null, // 相似主题列表
        score: null, // 总分
        contradict: null, // 矛盾性评分
        docTitle: null, // 标题
        timeliness: null, // 时效性评分
        fraction: null // 操作性评分
      },
      body2Show: false,
      body3Show: false
    }
  },
  created() {
  },
  mounted() {
    this.uploadFileId = this.$route.query.uploadFileId
    this.fileName = this.$route.params.sourceFileName
    this.actionId = this.$route.query.menuId

    const height = document.querySelector('.app-main').offsetHeight
    this.viewHeight = height - 135

    this.getData()

    this.$nextTick(function() {
      document.querySelector('.el-tabs__nav-scroll').style.backgroundColor = 'white'
      document.querySelector('.el-tabs__nav-scroll').style.paddingLeft = '30px'

      const x = document.querySelectorAll('.el-tabs__item')
      for (let i = 0; i < x.length; i++) {
        x[i].style.fontSize = '17px'
        x[i].style.fontWeight = 600
      }
    })
  },
  // 销毁完成
  destroyed() {
    // console.error('销毁..............')
  },
  methods: {
    getData() {
      const params = {
        uploadFileId: this.uploadFileId,
        actionId: this.actionId
      }
      // const url = 'http://39.96.94.120:38080/app/mock/36/wsClient/compareScore'
      const url = '/wsClient/compareScore'
      baseRequest(url, params)
        .then(response => {
          const item = response.data.item
          this.compareScore.themes = item.themes
          this.compareScore.score = item.score
          this.compareScore.contradict = item.contradict
          this.compareScore.docTitle = item.doc_name
          this.compareScore.timeliness = item.timeliness
          this.compareScore.fraction = item.fraction

          this.mainLoading = false
          this.selSelf()
        })
        .catch(error => {
          this.mainLoading = false
          console.error(error)
        })
    },
    openDialog() {
      // this.selectFileName()
      this.$refs.searchTable.openDialog(this.compareScore.themes)
    },
    toIndex(btn) {
      this.selSelf()
      this.body2Show = false
      this.body3Show = false
    },
    // 内容展示 body1
    selSelf() {
      this.$router.push({
        name: 'draft-body1',
        query: {
          uploadFileId: this.uploadFileId
        },
        params: {
          fileName: this.fileName
        }
      })
    },
    // 自洽性对比 body2
    selectFileName(row) {
      this.$router.push({
        name: 'draft-body2',
        query: {
          uploadFileId: this.uploadFileId,
          contrastFileId: row.id
        },
        params: {
          sourceFileName: this.fileName,
          targetFileName: row.docName
        }
      })
      this.body2Show = true
      this.body3Show = false
    },
    // 可操作对比 body3
    selOperable() {
      this.$router.push({
        name: 'draft-body3',
        query: {
          uploadFileId: this.uploadFileId
        },
        params: {
          sourceFileName: this.fileName
        }
      })
      this.body2Show = false
      this.body3Show = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-head {
    .score {
      color: red
    }

    .row-cell {
      border: 1px solid #ccc;
      margin-left: -1px;
      margin-top: -1px;
    }
    .col-cell {
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      margin-left: -1px;
    }
    .top-cell {
      border-top: 1px solid #ccc;
    }
    .bottom-cell {
      border-bottom: 1px solid #ccc;
    }
    .left-cell {
      border-left: 1px solid #ccc;
    }
    .right-cell{
      border-right: 1px solid #ccc;
    }

    .grid {
      line-height: 50px;
      padding: 0 20px;
      // margin: 0 10px;
    }
    .grid-height {
      height: 50px;
    }
  }

  .box-body {
    padding: 10px 20px; 
    border: 1px solid #ccc;
    margin-left: -1px;
    margin-top: -1px;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .menu {
    background-color: #3164b7;
    color: white;
    width: 80px;
  }
  .menu2 {
    background-color: white;
    color: black;
  }
</style>
