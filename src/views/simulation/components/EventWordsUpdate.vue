<template>
    <ul class="event-words-update">
        <li v-for="(item,index) in words" :key="index" class="word-box">
            <span>{{item}}</span>
            <span class="word-del el-icon-circle-close" @click="deleteHandle(index)"></span>
        </li>
        <li class="word-box add" v-if="words.length < 10" @click="addHandle">
            <span class="el-icon-plus"></span>
        </li>
    </ul>
</template>
<script>
export default {
  props: {
    synonymStr: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.words = this.synonymStr ? this.synonymStr.split(',') : []
  },
  data() {
    return {
      words: []
    }
  },
  methods: {
    addHandle() {
      this.$prompt('请输入词组名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请填写名称'
      }).then(({ value }) => {
        this.words.push(value)
      })
    },
    deleteHandle(index) {
      this.words.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.event-words-update{
    list-style: none;
    .word-box{
        float: left;
        padding:10px 20px;
        background-color: #79BBFF;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        position: relative;
        margin-right: 20px;
        margin-bottom: 20px;
        &.add{
            background-color: #fff;
            color: #666;
            border:1px solid #ccc;
            cursor: pointer;
            &:hover{
                color: #409EFF;
                border:1px solid #79BBFF;
            }
        }
        .word-del{
            position: absolute;
            top: -5px;
            right: -5px;
            color: #fff;
            font-size: 16px;
            background-color: crimson;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
        }
    }
}
</style>