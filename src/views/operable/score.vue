<template>
  <div class="operable-score">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="内容对比" name="first">
        <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">
          <span>此篇文章可操作性为<span style="color: #db0b0b;">{{getEffect(score.synthesize)}}</span></span>
        </div>
        <div class="score clearfix" style="width:125%;">
          <div v-if="uploadFileId" class="clearfix" style="padding: 0 0 10px 0; line-height: 50px; margin-left: calc(60% - 180px);">
            <div class="score-mo" >
              <span class="score-label">分值: </span>
              <span class="score-value">{{fraction}}</span>
            </div>
            <div style="line-height: 36px;">
              <a class="score-back" @click="$router.go(-1)">返回</a>
            </div>
          </div>
          <div v-else class="clearfix" style="padding: 0 0 10px 0;  line-height: 50px; margin: 0 136px;">
            <div class="score-mo" >
              <span class="score-label">系统分值: </span>
              <span class="score-value">{{score.system}}</span>
            </div>
            <div class="score-mo">
              <span class="score-label">专家评分: </span>
              <el-input class="score-input" v-model="score.manualScore" @change="changeArtificial" />
            </div>
            <div class="score-mo">
              <span class="score-label">综合分值: </span>
              <span class="score-value">{{score.synthesize}}</span>
            </div>
            <div class="score-mo" style="padding-right: 10px;">
              <el-popover
                placement="left-start"
                width="500"
                trigger="hover">
                <help :system="score.system" :manualScore="score.tempArtificial" 
                  :synthesize="score.synthesize"
                  :s="score.formula.s" :m="score.formula.m" 
                  :x="score.formula.x"></help>
                  <span slot="reference"><svg-icon iconClass="tootip" style="color: #3365b5;" /></span>
              </el-popover>
            </div>
            <div style="line-height: 30px;">
              <el-button class="menu" type="primary" size="small" @click="saveScore" style="width: 93px; background-color: #3365b5; border-color: #3365b5;">保存</el-button>
              <!-- <a class="score-back" @click="$router.go(-1)">返回</a> -->
            </div>
          </div>
          <!-- <el-scrollbar style="height:100%;" > -->
          <!-- <div v-if="uploadFileId" class="score-header">
            <h2 class="score-title">
                分值: 
                <span class="score-value">{{fraction}}</span>
                <a class="score-back" @click="$router.go(-1)">返回</a>
            </h2>
          </div>
          <div v-else class="score-header2">
            <div class="score-mo" >
              <span>系统分值: </span>
              <span style="color: red;">{{score.system}}</span>
            </div>
            <div class="score-mo">
              <div style="float: left; padding-right: 10px;">专家评分: </div>
              <div style="float: left; width: 70px">
                <el-input v-model="score.manualScore" @change="changeArtificial"></el-input>
              </div>
            </div>
            <div class="score-mo">
              <span>综合分值: </span>
              <span style="color: red;">{{score.synthesize}}</span>
            </div>
            <div>
              <el-button class="score-save" type="primary" size="small" @click="saveScore">保存</el-button>
              <a class="score-back" @click="$router.go(-1)">返回</a>
            </div>
          </div> -->
          <div class="score-container first">
            <div class="score-name">{{$route.query.sourceFileName}}</div>
            <div class="score-text" v-html="sourceContent"></div>
          </div>
          <!-- <div class="score-container last" > -->
            <!-- <div class="score-name">分值</div> -->
            <!-- <div class="score-text" v-html="targetContent"></div> -->
          <!-- </div> -->
          <!-- </el-scrollbar> -->
        </div>
      </el-tab-pane>  
      <el-tab-pane label="帮助" name="third">
        <div>
          <help :system="score.system" :manualScore="score.tempArtificial" :synthesize="score.synthesize"
              :s="score.formula.s" :m="score.formula.m" :x="score.formula.x"></help>
        </div>
      </el-tab-pane>
    </el-tabs>  
    
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import help from './help'
export default {
  components: {
    help
  },
  data() {
    return {
      activeName: 'first',
      sourceContent: '',
      targetContent: '',
      fraction: '',

      uploadFileId: null,
      targetFileId: null,
      score: {
        actionId: null,
        system: 0, // 系统分值
        manualScore: 0, // 专家评分
        tempArtificial: 0,
        synthesize: 0, // 综合分值
        formula: {
          s: 0.5,
          m: 0.5,
          x: 0
        }
      }
    }
  },
  mounted() {
    this.uploadFileId = this.$route.query.uploadFileId
    this.targetFileId = this.$route.query.targetFileId
    this.score.actionId = this.$route.query.menuId

    this.$nextTick(_ => {
      document.querySelector('.el-tabs__nav-scroll').style.backgroundColor = 'white'
      document.querySelector('.el-tabs__nav-scroll').style.paddingLeft = '30px'

      const x = document.querySelectorAll('.el-tabs__item')
      for (let i = 0; i < x.length; i++) {
        x[i].style.fontSize = '17px'
        x[i].style.fontWeight = 600
      }

      this.getData()
    })
    window.addEventListener('resize', function() {
      this.getData()
    }.bind(this), false)
  },
  methods: {
    getData() {
      const params = {
        targetFileId: this.$route.query.targetFileId,
        uploadFileId: this.$route.query.uploadFileId,
        actionId: this.score.actionId
      }
      baseRequest('/wsClient/operabilityCheck', params).then(response => {
        this.initArticle(response)
      })
    },
    // 计算综合分值
    changeArtificial(val) {
      if (!isNaN(val) && parseInt(val) <= 100 && parseInt(val) >= 0) {
        this.computedScore()
        this.score.tempArtificial = val
      } else {
        this.score.manualScore = this.score.tempArtificial
      }
    },
    computedScore() {
      const s = this.score.formula.s
      const m = this.score.formula.m
      const x = this.score.formula.x
      const num = this.score.system * s + this.score.manualScore * m + x
      this.score.synthesize = num.toFixed(2)
    },
    initArticle(response) {
      this.fraction = response.data.item.fraction
      this.score.system = response.data.item.fraction
      this.score.manualScore = response.data.item.manualScore || 0
      const formula = response.data.item.formula
      if (formula) {
        this.score.formula = formula
      }
      this.score.tempArtificial = this.score.manualScore
      this.computedScore()

      const sourceFile = response.data.item.sourceDocContent
      const checkResult = response.data.item.checkResult

      if (!checkResult) {
        this.sourceContent = sourceFile
        return
      }
      // 数据处理
      const sourceArray = []
      const targetArray = []
      const sourceSet = new Set()
      const targetSet = new Set()
      checkResult.forEach(d => {
        d.sourceId = `source${d.OUT_SOURCE_START}-${d.OUT_SOURCE_END}`
        d.targetId = `target${d.OUT_TARGET_START}-${d.OUT_TARGET_END}`

        if (!sourceSet.has(d.sourceId)) {
          sourceArray.push(d)
          sourceSet.add(d.sourceId)
        }

        if (!targetSet.has(d.targetId)) {
          targetArray.push(d)
          targetSet.add(d.targetId)
        }
        // this.checkResult.push(d)
      })
      this.sourceResult = sourceArray
      this.targetResult = targetArray

      sourceArray.sort(function(a, b) {
        return a.OUT_SOURCE_START - b.OUT_SOURCE_START
      })
      // 生成公文
      let sourceContent = ''
      // let targetContent = ''
      let sourceIndex = 0
      // const mainWidth = document.querySelector('.score').offsetWidth
      const containerWidth = document.querySelector('.score-container').offsetWidth
      // const jj = mainWidth * 0.04 - 10
      sourceArray.forEach(d => {
        // const sourceId = d.sourceId
        const itemScore = (d.SCORE * 100).toFixed(2)
        sourceContent += sourceFile.substring(sourceIndex, d.OUT_SOURCE_START)
        // targetContent += `<span style="opacity:0;">${sourceFile.substring(sourceIndex, d.OUT_SOURCE_START)}</span>`
        const offsetLeft = 10
        // if (/^\s/.test(d.OUT_SOURCE_CONTENT)) {
        //   offsetLeft = 40
        // }
        sourceContent += `<span style="color: rgb(3, 126, 251);position:relative;">${sourceFile.substring(d.OUT_SOURCE_START, d.OUT_SOURCE_END)}<span style="position: absolute;top: -4px;left: ${offsetLeft}px;width: ${containerWidth}px;height: 6px;border: 1px solid rgb(49, 100, 183);border-bottom: none;"><i style="font-size: 12px;position: absolute;right: -16px;color: #F56C6C;font-style:normal;"> ${itemScore} 可操作性：${this.getEffect(itemScore)}</i></span></span>`
        // targetContent += `<span style="color: rgb(3, 126, 251);position:relative;">${sourceFile.substring(d.OUT_SOURCE_START, d.OUT_SOURCE_END)}</span>`
        sourceIndex = d.OUT_SOURCE_END
      })
      sourceContent += sourceFile.slice(sourceIndex)
      // targetContent += `<span style="opacity:0;">${sourceFile.slice(sourceIndex)}</span>`
      this.sourceContent = sourceContent
      // this.targetContent = targetContent
    },
    // 保存专家评分
    saveScore() {
      const params = {
        sourceId: this.targetFileId,
        manualScore: this.score.manualScore
      }
      baseRequest('/operabilityHis/add', params)
        .then(response => {
          this.$message({
            showClose: true,
            message: '专家评分保存成功',
            type: 'success'
          })
        }, _ => {
          this.$message({
            showClose: true,
            message: '专家评分保存失败',
            type: 'error'
          })
        })
    },
    getEffect(fraction) {
      let result = ''
      if (fraction >= 75 && fraction <= 100) {
        result = '高'
      } else if (fraction >= 50 && fraction < 75) {
        result = '中'
      } else {
        result = '低'
      }
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.operable-score{
  height: calc(100%);
  overflow: auto;
  /deep/ .el-tabs__content{
    overflow-x: auto;
  }
}
  .score-mo {
    float: left;
    padding-right: 50px;
    line-height: 36px;
    .score-label {
      display: block;
      float: left;
      margin-right: 5px;
      height: 30px;
      font-size: 14px;
      color: #141414;
    }
    .score-value {
      display: block;
      float: left;
      height: 30px;
      font-weight: bold;
      font-size: 24px;
      color: #db0b0b;
    }
    .score-input {
      display: block;
      float: left;
      width: 100px;
      height: 36px; 
    }
  }

    .score {
        // padding-bottom:30px;
        height:100%;
        width: 100%;
        // overflow-x: hidden;
        .score-header{
          height: 60px;
          width:100%;
          line-height: 60px;
          // background-color: #DCDFE6;
          // position:absolute;
          // top:60px;
        }
        .score-header2{
          height: 60px;
          width: 60%;
          margin:0px auto;
          line-height: 60px;
          .score-save {
            background-color: #3164b7;
            color: white;
          }
          .score-back{
            color:rgb(3, 126, 251);
            font-size: 14px;
            float: right;
          }
        }
        .score-title{
          // position: relative;
          // margin-left:15%;
          width: 50%;
          margin:0px auto;
          color:#606266;
          .score-value{
            color:#F56C6C;
          }
          .score-back{
            // position: absolute;
            color:rgb(3, 126, 251);
            font-size: 14px;
            // right: 100px;
            // top:60px;
            float: right;
          }
        }
        .score-container{
          // overflow-x: hidden;
            // margin-top:10px;
            // margin-bottom:30px;
            width: 40%;
            margin:0px auto 30px;
            margin-left: 20%;
            // float:left;
            min-height: calc(100% - 90px);
            white-space: pre-line; 
            font-size: 14px; 
            // line-height: 150%;
            line-height: 28px;
            padding: 10px 30px 20px;
            // color: gray;
            // overflow: auto;
            color:gray;
            &.first{
              //  margin-left:15%;
               background-color: #fff;
               box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
               .score-name{
                border-bottom:1px solid #DCDFE6;
               }
            }
            // &.last{
            //     // margin-left:4%;
            // }
            .score-name{
              padding: 5px;
              color:#666;
              text-align: center;
              font-size: 16px;
              letter-spacing: 1px;
              font-weight: 600;
            }
            .score-text{
              margin-top:10px;
            }
        }
    }
</style>
<style lang="scss">
// .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
//    white-space: nowrap;
// }
.score{
  .el-scrollbar__wrap {
  overflow-x: hidden;
  }
}
  .score-mo {
    float: left;
    padding-right: 50px;
    font-size: 1.3em;
    font-weight: bold;
  }
</style>