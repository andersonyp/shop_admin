<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类 -->
    <el-button class="add" type="success" @click="$router.push('/goods-add')" plain>添加商品</el-button>
    <!-- 表格组件渲染数据 -->
    <el-table :data="goodsList">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间" prop="add_time"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" @click="delGood(row)" plain size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    // 获取商品列表数据
    async getGoodList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { total, goods }
      } = res
      if (status === 200) {
        this.goodsList = goods
        this.total = total
      }
    },
    // 分页数据
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodList()
    },
    // 自定义表格索引
    indexMethod(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize
    },
    // 删除商品
    async delGood(row) {
      try {
        await this.$confirm('你确定要删除该商品吗?', '温馨提示', {
          type: 'warning'
        })
        let res = await this.axios.delete(`goods/${row.goods_id}`)
        console.log(res)
        if (res.meta.status === 200) {
          this.getGoodList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$messge.warning('取消删除')
      }
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style lang="less" scoped>
.add {
  margin: 20px 0;
}
</style>
