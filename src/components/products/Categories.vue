<template>
  <div class="catefories">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类 -->
    <el-button class="add" @click="showAddDialog" type="success" plain>添加商品分类</el-button>
    <!-- 表格组件渲染数据 -->
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="cateList">
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indentSize="30"
      ></el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="{row}">{{ row.cat_deleted ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level">
        <template slot-scope="{row}">
          <span v-if="row.cat_level === 0">一级</span>
          <span v-else-if="row.cat_level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" class="el-icon-edit" size="mini" plain></el-button>
          <el-button
            @click="delCategory(row)"
            type="danger"
            class="el-icon-delete"
            size="mini"
            plain
          ></el-button>
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
      background
    ></el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            :options="options"
            v-model="addForm.cat_pid"
            :props="props"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      addDialogVisible: false,
      addForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { result, total }
      } = res
      if (status === 200) {
        this.loading = false
        this.cateList = result
        this.total = total
      }
    },
    // 显示添加对话框
    async showAddDialog() {
      this.addDialogVisible = true
      // 获取二级分类列表
      let res = await this.axios.get('categories?type=2')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.options = data
      }
    },
    // 添加商品分类
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        let { cat_pid: catPid, cat_name: catName } = this.addForm
        let res = await this.axios.post('categories', {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        if (res.meta.status === 201) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getCateList()
          this.$message.success('添加商品分类成功')
        }
      })
    },
    // 分页功能
    handleSizeChange(val) {
      this.pageSize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCateList()
    },
    // 删除商品分类
    async delCategory(cate) {
      try {
        await this.$confirm('你确定删除该分类吗?', '温馨提示', {
          type: 'warnning'
        })
        let res = await this.axios.delete(`categories/${cate.cat_id}`)
        console.log(res)
        if (res.meta.status === 200) {
          this.getCateList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.warning('取消删除')
      }
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.add {
  margin: 20px 0;
}
.el-table {
  border-radius: 15px;
}
</style>
