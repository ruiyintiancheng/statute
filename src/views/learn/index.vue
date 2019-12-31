/*
 * @Author: wk
 * @Date: 2019-12-26 11:08:37 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-12-31 16:06:41
 * @Description:  学习路上
 */
<template>
  <div class="Learning">
    <div class="Learning-head">
      <img :src="banner">
    </div>
    <div class="Learning-body">
      <div class="Learning-center base-container">

        <div class=" baseitem"
             @click="jumpDetails(1)">
          <div class="item-frame">
            <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
            <div class="item-date">(2016年4月19日)</div>
            <div class="item-speaker">习近平</div>
            <div class="item-speaker"
                 style="margin-top:110px;font-size:4px">人民出版社</div>
          </div>
        </div>
        <div class=" baseitem">
          <div class="item-frame">
            <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
            <div class="item-date">(2016年4月19日)</div>
            <div class="item-speaker">习近平</div>
            <div class="item-speaker"
                 style="margin-top:110px;font-size:4px">人民出版社</div>
          </div>
        </div>
        <div class=" baseitem">
          <div class="item-frame">
            <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
            <div class="item-date">(2016年4月19日)</div>
            <div class="item-speaker">习近平</div>
            <div class="item-speaker"
                 style="margin-top:110px;font-size:4px">人民出版社</div>
          </div>
        </div>
        <div class=" baseitem">
          <div class="item-frame">
            <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
            <div class="item-date">(2016年4月19日)</div>
            <div class="item-speaker">习近平</div>
            <div class="item-speaker"
                 style="margin-top:110px;font-size:4px">人民出版社</div>
          </div>
        </div>
        <div class=" baseitem">
          <div class="item-frame">
            <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
            <div class="item-date">(2016年4月19日)</div>
            <div class="item-speaker">习近平</div>
            <div class="item-speaker"
                 style="margin-top:110px;font-size:4px">人民出版社</div>
          </div>
        </div>
      </div>
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
      pageNo: 1,
      total: 40,
      pageSize: 10
    }
  },
  methods: {
    jumpDetails(id) { // 跳转讲话内容
      this.$router.push({
        name: 'verbiage'
      })
    },
    searchOption(page) {
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      baseSearch('/keywordInfos/selects', this.searchData).then(response => {
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
        margin-right: 0px;
      }
      .baseitem {
        width: 274px;
        display: inline-block;
        background: #fff;
        margin-bottom: 20px;
        margin-right: 34px;
        padding: 10px;

        .item-frame {
          height: 100%;
          width: 100%;
          padding: 90px 20px 30px 20px;
          // min-height: 30px;
          border: 1px solid #aaaaaa;
          .item-title {
            color: #ed4d56;
            text-align: center;
            font-size: 20px;
            line-height: 26px;
            font-weight: 500;
            font-family: SimSun;
          }
          .item-date {
            color: #ed4d56;
            text-align: center;
            font-size: 4px;
            margin-top: 25px;
            letter-spacing: 2px;
          }
          .item-speaker {
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

