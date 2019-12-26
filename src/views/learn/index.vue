/*
 * @Author: wk
 * @Date: 2019-12-26 11:08:37 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-12-26 16:20:44
 * @Description:  学习路上
 */
<template>
  <div class="Learning">
    <div class="Learning-head">
      <img :src="banner">
    </div>
    <div class="Learning-body">
      <div class="Learning-center">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple baseitem">
              <div class="item-frame">
                <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
                <div class="item-date">(2016年4月19日)</div>
                <div class="item-speaker">习近平</div>
                <div class="item-speaker"
                     style="margin-top:110px;font-size:4px">人民出版社</div>
              </div>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple baseitem">
              <div class="item-frame">
                <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
                <div class="item-date">(2016年4月19日)</div>
                <div class="item-speaker">习近平</div>
                <div class="item-speaker"
                     style="margin-top:110px;font-size:4px">人民出版社</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple baseitem">
              <div class="item-frame">
                <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
                <div class="item-date">(2016年4月19日)</div>
                <div class="item-speaker">习近平</div>
                <div class="item-speaker"
                     style="margin-top:110px;font-size:4px">人民出版社</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple baseitem">
              <div class="item-frame">
                <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
                <div class="item-date">(2016年4月19日)</div>
                <div class="item-speaker">习近平</div>
                <div class="item-speaker"
                     style="margin-top:110px;font-size:4px">人民出版社</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple baseitem">
              <div class="item-frame">
                <div class="item-title">在网络完全和信息化工作座谈会上的讲话</div>
                <div class="item-date">(2016年4月19日)</div>
                <div class="item-speaker">习近平</div>
                <div class="item-speaker"
                     style="margin-top:110px;font-size:4px">人民出版社</div>
              </div>
            </div>
          </el-col>

        </el-row>
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
<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

<style lang="scss" scoped>
.Learning {
  height: 100%;
  .Learning-head {
    img {
      width: 100%;
    }
  }
  .Learning-body {
    background-color: #def5fb;
    padding: 30px 0;
    .Learning-center {
      width: 80%;
      margin: 0 auto;

      .baseitem {
        background: #fff;
        margin-bottom: 15px;
        padding: 10px;
        .item-frame {
          height: 100%;
          width: 100%;
          padding: 90px 20px 30px 20px;
          // min-height: 30px;
          border: 1px solid #aaaaaa;
          .item-title {
            color: red;
            text-align: center;
            font-size: 22px;
            line-height: 26px;
            font-weight: 500;
            font-family: SimSun;
          }
          .item-date {
            color: red;
            text-align: center;
            font-size: 4px;
            margin-top: 25px;
            letter-spacing: 2px;
          }
          .item-speaker {
            color: red;
            text-align: center;
            font-size: 14px;
            margin-top: 38px;
            letter-spacing: 8px;
          }
        }
      }
      .paging {
        text-align: center;
      }
    }
  }
}
</style>

