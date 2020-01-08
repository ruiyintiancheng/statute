/*
 * @Author: wk
 * @Date: 2019-12-26 11:08:37 
 * @Last Modified by: 1k
 * @Last Modified time: 2020-01-07 17:15:01
 * @Description:  学习路上
 */
<template>
  <div class="Learning"
       v-loading="listLoading">
    <div class="Learning-head">
      <img :src="banner">
    </div>
    <div class="Learning-body">
      <div class="Learning-center base-container">
        <div class=" baseitem"
             v-for="item in configData"
             :key="item.id"
             @click="jumpDetails(item.id)">
          <div class="item-frame">
            <div class="item-title">{{item.docTittle}}</div>
            <div class="item-date">{{item.docIssueTime | timeFiltering}}</div>
            <div class="item-speaker">习近平</div>
            <div class=" source"
                 style="font-size:4px">{{item.docSource}}</div>
          </div>
        </div>
      </div>
      <div> </div>
      <div class="paging">
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       layout="total, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import banner from '@/assets/images/banner.jpg'
import { baseSearch } from '@/api/base'
export default {
  name: 'home',
  components: {
  },
  data() {
    return {
      banner,
      searchData: {},
      configData: null,
      pageNo: 1,
      total: null,
      pageSize: 12,
      listLoading: false
    }
  },
  filters: {
    timeFiltering(val) {
      if (val) {
        let newdate = ''
        const date = new Date(val)
        // alert(date)
        newdate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
        return newdate
      }
    }
  },
  mounted() {
    this.searchOption()
  },
  methods: {
    jumpDetails(id) { // 跳转讲话内容
      this.$router.push({
        name: 'verbiage',
        query: {
          crawlConId: id
        }
      })
    },
    searchOption(page) {
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      baseSearch('/bXjpBasic/selectBXjpBasicList', this.searchData).then(response => {
        this.configData = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
        this.listLoading = false
      })
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    }
  }
}
</script>


<style lang="scss" scoped>
.Learning {
  height: 100%;
  .Learning-head {
    margin-bottom: -5px;
    img {
      width: 100%;
    }
  }
  .Learning-body {
    background-color: #def5fb;
    padding: 30px 0;

    .Learning-center {
      // width: 80%;
      // margin: 0 auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .baseitem:nth-child(4n) {
        margin-right: 1px;
      }
      .baseitem {
        width: 274px;
        height: 380px;
        display: inline-block;
        background: #fff;
        margin-bottom: 20px;
        margin-right: 34px;
        padding: 10px;

        .item-frame {
          height: 100%;
          width: 100%;
          // padding: 0 20px 30px 20px;
          // min-height: 30px;
          border: 1px solid #aaaaaa;
          position: relative;
          .item-title {
            position: absolute;
            top: 65px;
            width: 100%;
            color: #ed4d56;
            text-align: center;
            font-size: 20px;
            line-height: 26px;
            font-weight: 500;
            font-family: SimSun;
          }
          .item-date {
            position: absolute;
            top: 145px;
            width: 100%;
            color: #ed4d56;
            text-align: center;
            font-size: 4px;
            margin-top: 25px;
            letter-spacing: 2px;
          }
          .item-speaker {
            position: absolute;
            top: 175px;
            width: 100%;
            color: #ed4d56;
            text-align: center;
            font-size: 14px;
            margin-top: 38px;
            letter-spacing: 8px;
          }
          .source {
            position: absolute;
            bottom: 40px;
            width: 100%;
            color: #ed4d56;
            text-align: center;
            font-size: 14px;
            margin-top: 38px;
            letter-spacing: 8px;
          }
        }
      }
    }
    .paging {
      text-align: center;
    }
  }
}
</style>

