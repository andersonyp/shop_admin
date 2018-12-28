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
      <el-aside width="200px">
        <el-menu
          :default-active="this.$route.path.slice(1)"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <!-- unique-opened:只保持一个子菜单的展开 router: 启用导航模式,以index作为path进行路由跳转
          -->
          <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.path">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    async logout() {
      try {
        await this.$confirm('你确定要退出吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message.success('退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
      } catch (e) {
        this.$message.info('取消退出')
      }
    },
    // 动态渲染菜单权限
    async getMenuList() {
      let res = await this.axios.get('menus')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.menuList = data
      }
    }
  },
  created() {
    this.getMenuList()
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #F7BB9D;
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
    background-color: #F4F7BB;
  }
}
</style>
