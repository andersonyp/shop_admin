<template>
  <div class="login">
    <el-form status-icon ref="form" :rules="rules" :model="form" label-width="80px">
      <img src="@/assets/images/avatar.jpg" alt>
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input @keyup.enter.native="login" v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '用户名长度在3~9个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { min: 6, max: 12, message: '密码长度在6~12个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 调用reserFields()方法重置表单
    resetForm () {
      this.$refs.form.resetFields()
    },
    // 调用validate()方法实现登录功能
    login () {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        let {meta: {status}, data: {token}} = res
        if (status === 200) {
          // 通过message消息提示框实现消息提示
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 1000
          })
          // 将后台的token存到localStorage
          localStorage.setItem('token', token)
          // 通过编程式路由 router.$router.push()方法实现路由跳转
          this.$router.push('/home')
        } else {
          this.$message({
            message: '登录失败',
            type: 'error',
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 40px 15px;
    position: relative;
    border-radius: 20px;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -80px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button + .el-button {
      margin-left: 80px;
    }
  }
}
</style>
