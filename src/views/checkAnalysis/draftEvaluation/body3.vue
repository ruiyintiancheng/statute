<template>
  <div>
    <div class="score clearfix">
          <div class="score-header">
            <h2 class="score-title">
                分值: 
                <span class="score-value">{{fraction}}</span>
            </h2>
          </div>
          <div class="score-container first">
            <div class="score-name">{{$route.params.sourceFileName}}</div>
            <!-- <div>
              <div v-for="(item, i) in keywords" :key="i">
                <span>{{`${i + 1}.${item}`}}</span>
              </div>
            </div>
            <div class="line"></div> -->
            <div class="score-text" v-html="sourceContent"></div>
          </div>
        </div>    
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  components: {},
  data() {
    return {
      sourceContent: '',
      fraction: '',
      uploadFileId: null,
      keywords: []
    }
  },
  mounted() {
    this.uploadFileId = this.$route.query.uploadFileId

    this.$nextTick(_ => {
      this.getData()
    })
    window.addEventListener('resize', function() {
      this.getData()
    }.bind(this), false)
  },
  methods: {
    getData() {
      const params = {
        uploadFileId: this.$route.query.uploadFileId
      }

      baseRequest('/wsClient/operaAndTimeCheck', params)
        .then(response => {
          this.initArticle(response)
        })
    },
    initArticle(response) {
      this.fraction = response.data.item.fraction
      this.keywords = response.data.item.KEYWORDS

      const sourceFile = response.data.item.sourceDocContent
      const checkResult = response.data.item.checkResult

      if (!checkResult) {
        this.sourceContent = sourceFile
        return
      }
      // 数据处理
      const sourceArray = []
      const sourceSet = new Set()
      checkResult.forEach(d => {
        d.sourceId = `source${d.OUT_SOURCE_START}-${d.OUT_SOURCE_END}`

        if (!sourceSet.has(d.sourceId)) {
          sourceArray.push(d)
          sourceSet.add(d.sourceId)
        }
      })
      this.sourceResult = sourceArray

      sourceArray.sort(function(a, b) {
        return a.OUT_SOURCE_START - b.OUT_SOURCE_START
      })
      // 生成公文
      let sourceContent = ''
      let sourceIndex = 0
      // const mainWidth = document.querySelector('.score').offsetWidth
      const containerWidth = document.querySelector('.score-container').offsetWidth
      // const jj = mainWidth * 0.04 - 10
      sourceArray.forEach(d => {
        // const sourceId = d.sourceId
        const itemScore = (d.SCORE * 100).toFixed(2)
        sourceContent += sourceFile.substring(sourceIndex, d.OUT_SOURCE_START)
        const offsetLeft = 10
        sourceContent += `<span style="color: rgb(3, 126, 251);position:relative;">${sourceFile.substring(d.OUT_SOURCE_START, d.OUT_SOURCE_END)}<span style="position: absolute;top: -4px;left: ${offsetLeft}px;width: ${containerWidth}px;height: 6px;border: 1px solid rgb(49, 100, 183);border-bottom: none;"><i style="font-size: 12px;position: absolute;right: -16px;color: #F56C6C;font-style:normal;"> ${itemScore}</i></span></span>`
        sourceIndex = d.OUT_SOURCE_END
      })
      sourceContent += sourceFile.slice(sourceIndex)
      // targetContent += `<span style="opacity:0;">${sourceFile.slice(sourceIndex)}</span>`
      this.sourceContent = sourceContent
      // this.targetContent = targetContent
    }
  }
}
</script>
<style lang="scss" scoped>
    .score {
        height:100%;
        .score-header{
          height: 60px;
          width:100%;
          line-height: 60px;
        }
        .score-title{
          width: 80%;
          margin:0px auto;
          color:#606266;
          .score-value{
            color:#F56C6C;
          }
        }
        .score-container{
            width: 80%;
            margin:0px auto 30px;
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
  .line {
    position: relative;
    display: block;
     width: 100%;
    height: 1px;
    margin: 12px 0;
    background-color: #DCDFE6;
  }
</style>