<template>
  <div class="addGood">
    <!-- 步骤条 -->
    <el-steps :active="active" simple process-status="process" finish-status="success">
      <el-step title="基本信息" icon="el-icon-edit"></el-step>
      <el-step title="商品图片" icon="el-icon-picture"></el-step>
      <el-step title="商品内容" icon="el-icon-upload"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs @tab-click="change" v-model="activeName" tab-position="left" type="border-card">
      <el-tab-pane name="basic" label="基本信息">
        <el-form ref="addForm" :model="addForm" label-width="120px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader :options="options" v-model="addForm.goods_cat" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item label="商品是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next(2)">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="pic" label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
          :headers="headers"
          :on-success="handerSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button class="second" type="primary" @click="next(3)">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="desc" label="商品内容">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button class="add" type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'basic',
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        is_promote: false
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    // 将标签页和步骤条绑定
    change(tab) {
      this.active = +tab.index
    },
    // 下一步
    next(step) {
      if (step === 2) {
        this.active = 1
        this.activeName = 'pic'
      } else {
        this.active = 2
        this.activeName = 'desc'
      }
    },
    // 文件上传成功
    handerSuccess(res, file, fileList) {
      if (res.meta.status === 200) {
        this.addForm.pics.push({
          pics: res.data.tmp_path
        })
      }
    },
    // 添加商品
    async addGood() {
      let res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      console.log(res)
      if (res.meta.status === 201) {
        this.$router.push('/goods')
      }
    }
  },
  async created() {
    // 获取商品层级列表
    let res = await this.axios.get('categories?type=3')
    if (res.meta.status === 200) {
      this.options = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  border-radius: 10px;
  margin-bottom: 40px;
}
.el-tabs {
  border-radius: 10px;
}
.second {
  margin-top: 50px;
}
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
.add {
  margin-top: 20px;
}
</style>
