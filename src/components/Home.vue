<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <span>欢迎进入</span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      localStorage.clear('token')
      this.$router.push('/login')
      this.$message({
        message: '退出成功',
        type: 'success',
        duration: 1000
      })
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    display: flex;
    .logo {
      width: 180px;
      background: url('~@/assets/images/logo.png') no-repeat;
      background-size: contain;
      background-position: center;
    }
    .logout {
      width: 180px;
      line-height: 60px;
      font-weight: 700;
      a {
        color: chocolate;
      }
    }
    .title {
      flex: 1;
      h1 {
        text-align: center;
        line-height: 60px;
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #eaeef1;
  }
}
</style>
