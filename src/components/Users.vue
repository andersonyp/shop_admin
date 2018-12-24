<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" @click="showAddModal" class="addBtn" plain>添加用户</el-button>
    </div>
    <!-- 数据渲染表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            @change="updateState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="shoeEditModal(scope.row)"
            icon="el-icon-edit"
            plain
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            @click="delUser(scope.row.id)"
            icon="el-icon-delete"
            plain
            size="mini"
          ></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加模态框 -->
    <el-dialog title="添加用户" :visible.sync="addDdialogVisible" width="40%">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改模态框 -->
    <el-dialog title="添加用户" :visible.sync="editDdialogVisible" width="40%">
      <el-form ref="editForm" :model="editForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDdialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      addDdialogVisible: false,
      editDdialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          {
            min: 3,
            max: 9,
            message: '用户名长度在3~9个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { min: 6, max: 12, message: '密码产长度在6~12个字符' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机格式',
            trigger: 'blur'
          }
        ]
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  methods: {
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { users, total }
      } = res
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    async delUser(id) {
      try {
        await this.$confirm('你确定要删除吗?', '温馨提示', {
          type: 'wraning'
        })

        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`,
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })

        let {
          meta: { status }
        } = res
        if (status === 200) {
          if (this.userList.length <= 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.$message.success('删除成功')
          this.getUserList()
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    async updateState(user) {
      // 发送请求通过后台修改用户状态
      let res = await this.axios({
        method: 'put',
        url: `users/${user.id}/state/${user.mg_state}`
      })
      if (res.meta.status === 200) {
        this.$message.success('用户状态修改成功')
      } else {
        this.$message.error('抱歉,用户状态修改失败')
      }
    },
    showAddModal() {
      this.addDdialogVisible = true
    },
    addUser() {
      this.$refs.addForm.validate(async valida => {
        if (!valida) return false
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        })
        let {
          meta: { status }
        } = res
        if (status === 201) {
          // 关闭模态框
          this.addDdialogVisible = false
          // 重新渲染
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.getUserList()
          // 重置表单
          this.$refs.addForm.resetFields()
        }
      })
    },
    shoeEditModal(user) {
      this.editDdialogVisible = true
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    updateUser() {
      this.$refs.editForm.validate(async valida => {
        if (!valida) return false
        let res = await this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        })
        let {
          meta: { status }
        } = res
        if (status === 200) {
          this.editDdialogVisible = false
          this.$refs.editForm.resetFields()
          this.getUserList()
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.input-with-select {
  width: 350px;
  margin-bottom: 15px;
  border-radius: 10px;
}
.el-table {
  border-radius: 10px;
}
.addBtn {
  margin-left: 20px;
}
</style>
