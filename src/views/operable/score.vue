<template>
    <div class="score clearfix">
        <h2 class="score-title">
            分值: 
            <span class="score-value">{{fraction}}</span>
        </h2>
        <div class="score-container first">
          <div class="score-name">{{$route.query.sourceFileName}}</div>
          <div class="score-text" v-html="sourceContent"></div>
        </div>
        <div class="score-container last" >
          <div class="score-name">{{$route.query.sourceFileName}}</div>
          <div class="score-text" v-html="targetContent"></div>
        </div>
    </div>
</template>
<script>
import { baseRequest } from '@/api/base'
export default {
  data() {
    return {
      sourceContent: '',
      targetContent: '',
      fraction: ''
    }
  },
  mounted() {
    this.$nextTick(_ => {
      this.getData()
    })
  },
  methods: {
    getData() {
      const params = {
        targetFileId: this.$route.query.targetFileId,
        uploadFileId: this.$route.query.uploadFileId
      }
      baseRequest('/wsClient/operabilityCheck', params).then(response => {
        this.initArticle(response)
      })
    },
    initArticle(response) {
      this.fraction = response.data.item.fraction
      const sourceFile = response.data.item.sourceDocContent
      const checkResult = response.data.item.checkResult
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
      let targetContent = ''
      let sourceIndex = 0
      const mainWidth = document.querySelector('.score').offsetWidth
      const containerWidth = document.querySelector('.score-container').offsetWidth
      const jj = mainWidth * 0.04 - 10
      sourceArray.forEach(d => {
        // const sourceId = d.sourceId

        sourceContent += sourceFile.substring(sourceIndex, d.OUT_SOURCE_START)
        targetContent += `<span style="opacity:0;">${sourceFile.substring(sourceIndex, d.OUT_SOURCE_START)}</span>`
        const offsetLeft = 10
        // if (/^\s/.test(d.OUT_SOURCE_CONTENT)) {
        //   offsetLeft = 40
        // }
        sourceContent += `<span style="color: rgb(3, 126, 251);position:relative;">${sourceFile.substring(d.OUT_SOURCE_START, d.OUT_SOURCE_END)}<span style="position: absolute;top: -4px;left: ${offsetLeft}px;width: ${containerWidth + jj}px;height: 6px;border: 1px solid rgb(49, 100, 183);border-bottom: none;"></span></span>`
        targetContent += `<span style="color: rgb(3, 126, 251);position:relative;">${sourceFile.substring(d.OUT_SOURCE_START, d.OUT_SOURCE_END)}</span>`
        sourceIndex = d.OUT_SOURCE_END
      })
      sourceContent += sourceFile.slice(sourceIndex)
      targetContent += `<span style="opacity:0;">${sourceFile.slice(sourceIndex)}</span>`
      this.sourceContent = sourceContent
      this.targetContent = targetContent
    }
  }
}
</script>
<style lang="scss" scoped>
    .score {
        padding:30px;
        // height:100%;
        .score-title{
          .score-value{
            color:red;
          }
        }
        .score-container{
            margin-top:10px;
            margin-bottom:30px;
            width: 45%;
            float:left;
            height: calc(100% - 50px);
            white-space: pre-line; 
            font-size: 14px; 
            line-height: 150%;
            padding: 10px 30px 20px;
            // color: gray;
            // overflow: auto;
            color:gray;
            &.first{
               background-color: #fff;
               box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
               .score-name{
                border-bottom:1px solid #DCDFE6;
               }
            }
            &.last{
                margin-left:4%;
                .score-name{
                  opacity:0;
                }
            }
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