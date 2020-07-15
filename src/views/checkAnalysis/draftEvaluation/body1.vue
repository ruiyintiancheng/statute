<template>
  <div class="score clearfix">
    <div class="score-container first">
      <div class="score-name">{{$route.params.fileName}}</div>
      <div class="score-text" v-html="summary"></div>
      <div class="line"></div>
      <div class="score-text" v-html="sourceContent"></div>
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
      summary: '',
      uploadFileId: null
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
        uploadFileId: this.uploadFileId
      }
      baseRequest('/wsClient/getSoucreContext', params).then(response => {
        this.sourceContent = response.data.item.sourceDocContent
        this.summary = response.data.item.summary
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .score {
        height:100%;
        .score-container{
          // overflow-x: hidden;
            // margin-top:10px;
            // margin-bottom:30px;
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

  .line {
    position: relative;
    display: block;
    width: 100%;
    height: 1px;
    margin: 12px 0;
    background-color: #DCDFE6;
  }
</style>