<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-button class="add" @click="showAddDialog" type="success" plain>添加角色</el-button>
    <!-- 表格组件渲染数据 -->
    <el-table :data="rolesList">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span v-if="row.children.length === 0">暂无权限</span>
          <!-- 显示一级权限 -->
          <el-row class="level1" v-for="level1 in row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag @close="delRight(row,level1.id)" closable>{{ level1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 显示二级权限 -->
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag
                    @close="delRight(row,level2.id)"
                    type="success"
                    closable
                  >{{ level2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <span v-for="level3 in level2.children" :key="level3.id">
                    <el-tag
                      @close="delRight(row,level3.id)"
                      class="level3"
                      type="danger"
                      closable
                    >{{ level3.authName }}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            @click="showEditDialog(row)"
            class="el-icon-edit"
            plain
            size="mini"
          ></el-button>
          <el-button type="danger" @click="delRole(row)" class="el-icon-delete" plain size="mini"></el-button>
          <el-button
            type="success"
            @click="showAssignDialog(row)"
            icon="el-icon-check"
            plain
            size="mini"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="40%">
      <el-tree
        ref="tree"
        node-key="id"
        :data="data"
        :props="defaultProps"
        show-checkbox
        default-expand-all
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">分 配</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改角色对话框 -->
    <el-dialog
      :title="this.addForm.id ? '修改角色' : '添加角色'"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <el-form status-icon ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      assignDialogVisible: false,
      addDialogVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取列表数据
    async getRolesList() {
      let res = await this.axios.get('roles')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.rolesList = data
      }
    },
    // 删除角色
    async delRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        // 为了避免整个页面重新加载,只需要将children中的数据重新渲染即可
        role.children = data
        this.$message.success('取消权限成功')
      } else {
        this.$message.error('取消权限失败')
      }
    },
    async showAssignDialog(role) {
      this.assignDialogVisible = true
      this.roleId = role.id
      let res = await this.axios.get('rights/tree')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.data = data
      }
      // 让节点默认选中
      // 找到当前角色的拥有的所有的三级权限
      let ids = []
      role.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            ids.push(level3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    // 分配角色权限
    async assignRight() {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let halfcheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = checkedKeys.concat(halfcheckedKeys).join()
      // 发送ajax请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      let {
        meta: { status }
      } = res
      if (status === 200) {
        this.getRolesList()
        this.assignDialogVisible = false
        this.$message.success('权限分配成功')
      } else {
        this.$message.success('权限分配失败')
      }
    },
    // 显示添加对话框
    showAddDialog() {
      this.addDialogVisible = true
      this.addForm.roleName = ''
      this.addForm.roleDesc = ''
      this.addForm.id = ''
    },
    // 添加\修改
    saveRole() {
      this.$refs.addForm.validate(async valia => {
        if (!valia) return false

        let id = this.addForm.id
        let method = id ? 'put' : 'post'
        let url = id ? `roles/${id}` : `roles`
        let status = id ? 200 : 201
        let res = await this.axios({
          method,
          url,
          data: this.addForm
        })
        if (res.meta.status === status) {
          this.addDialogVisible = false
          this.getRolesList()
          this.$refs.addForm.resetFields()
          this.$message.success('操作成功')
        }
      })
    },
    // 显示修改对话框
    showEditDialog(role) {
      this.addDialogVisible = true
      // 回显数据
      this.addForm.roleName = role.roleName
      this.addForm.roleDesc = role.roleDesc
      this.addForm.id = role.id
    },
    // 删除角色
    async delRole(role) {
      try {
        await this.$confirm('你确定要删除该角色吗?', '温馨提示', {
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${role.id}`)
        if (res.meta.status === 200) {
          this.getRolesList()
          this.$message.success('删除角色成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
  border-radius: 10px;
  .level1 {
    border-bottom: 1px dotted #ccc;
    padding: 15px 0 0 0;
    .level2 {
      margin-bottom: 15px;
      .level3 {
        margin-right: 10px;
      }
    }
  }
}
.add {
  margin-top: 20px;
}
</style>
