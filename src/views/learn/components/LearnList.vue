/*
 * @Author: lk 
 * @Date: 2020-02-18 15:29:45 
 * @Last Modified by: lk
 * @Last Modified time: 2020-02-20 13:57:11
 * @Description:  学习列表
 */

<template>
    <div class="learn-list" v-loading="listLoading">
        <div class="learning-center">
          <div class="baseitem"
              v-for="item in configData"
              :key="item.id"
              @click="jumpDetails(item.id)">
            <div class="item-frame">
              <div class="item-title">{{item.docTittle}}</div>
              <div class="item-date">{{item.docIssueTime | timeFiltering}}</div>
              <div class="item-speaker">{{item.docType}}</div>
              <div class=" source"
                  style="font-size:12px">{{item.docSource}}</div>
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
</template>
<script>
import { baseSearch } from '@/api/base'
export default {
  props: {
    activeName: String,
    keyword: String
  },
  data() {
    return {
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
        const date = new Date(Date.parse(val.replace(/-/g, '/')))
        newdate = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
        return newdate
      }
    },
    moduleIdType(val) {
      if (val === '1') {
        return '习近平'
      } else if (val === '2') {
        return '十三五'
      }
    }
  },
  mounted() {
    // this.searchOption()
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
      const wd = {
        content: this.keyword,
        moduleId: [this.activeName]
      }
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      this.searchData.wd = wd
      baseSearch('/esIndexXuexi/queryDoc', this.searchData).then(response => {
        this.configData = response.data.item.list
        this.total = response.data.item.total
        this.pageSize = response.data.item.pageSize
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
.learn-list{
        .learning-center {
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
            padding: 0px 15px;
            font-family: SimHei;
            height: 78px;
            overflow: hidden;
          }
          .item-date {
            position: absolute;
            top: 150px;
            width: 100%;
            color: #ed4d56;
            text-align: center;
            font-size: 12px;
            letter-spacing: 1px;
            box-shadow: 0 0 black;
            font-family: FangSong;
          }
          .item-speaker {
            position: absolute;
            top: 173px;
            width: 100%;
            color: #ed4d56;
            text-align: center;
            font-size: 12px;
            letter-spacing: 8px;
            font-family: FangSong;
          }
          .source {
            position: absolute;
            bottom: 30px;
            width: 100%;
            color: #ed4d56;
            text-align: center;
            font-size: 14px;
            letter-spacing: 3px;
            font-family: FangSong;
          }
        }
      }
    }
    .paging {
      text-align: center;
    }
}
</style>
