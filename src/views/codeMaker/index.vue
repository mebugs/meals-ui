<template>
  <div class="app-container">
    <el-table v-loading="loading" style="width: 100%" :stripe="true" :show-overflow-tooltip="true" :data="list" border>
      <el-table-column label="表名" align="center">
        <template slot-scope="scope"><span>{{ scope.row.tableName }}</span></template>
      </el-table-column>
      <el-table-column label="注释" max-width="400" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope"><span>{{ scope.row.comments }}</span></template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope"><span>{{ scope.row.createTime }}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="代码生成" placement="top">
            <el-button type="primary" icon="el-icon-brush" size="mini" @click="makeCode(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-droll :title="title" width="900px" :visible.sync="doFlag" :close-on-click-modal="false">
      <el-form ref="conf" class="half" :model="conf" :rules="rules" label-width="75px">
        <el-table style="width: 100%;margin-bottom: 10px;" :stripe="true" size="mini" :show-overflow-tooltip="true" :data="columnList" border>
          <el-table-column label="字段名" align="center">
            <template slot-scope="scope"><span>{{ scope.row.columnName }}</span></template>
          </el-table-column>
          <el-table-column label="字段类型" align="center">
            <template slot-scope="scope"><span>{{ scope.row.columnType }}</span></template>
          </el-table-column>
          <el-table-column label="字段描述" max-width="400" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope"><span>{{ scope.row.columnComment }}</span></template>
          </el-table-column>
          <el-table-column label="字符编码" align="center">
            <template slot-scope="scope"><span>{{ scope.row.characterSetName }}</span></template>
          </el-table-column>
        </el-table>
        <el-form-item class="need full" label="包路径" prop="packageName">
          <el-input v-model="conf.packageName" placeholder="请输入生成代码基础包路径(代码最终生成路径为该路径+包名)" />
        </el-form-item>
        <el-form-item class="need" label="模块名" prop="moduleName">
          <el-input v-model="conf.moduleName" placeholder="请输入该表所在模块名" />
        </el-form-item>
        <el-form-item class="need" label="作者名" prop="author">
          <el-input v-model="conf.author" placeholder="请输入作者@author" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" plain type="primary" @click="canc">取消</el-button>
        <el-button size="small" type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTableList, getTableColumnList } from '@/api/codeMaker.js'
export default
{
  data() {
    return {
      list: [],
      loading: false,
      doFlag: false,
      title: '',
      columnList: [],
      conf: {},
      rules: {
        packageName: [{ required: true, message: '请输入生成代码基础包路径', trigger: 'blur' }],
        moduleName: [{ required: true, message: '请输入该表所在模块名', trigger: 'blur' }],
        author: [{ required: true, message: '请输入作者@author', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods:
  {
    makeCode(row) { // 代码生成
      this.title = '[ ' + row.tableName + ' ] 代码生成'
      this.columnList = []
      getTableColumnList(row.tableName).then(res => {
        if (res.data) {
          this.columnList = res.data
          this.conf = {}
          this.doFlag = true
        } else {
          this.$message.error('获取数据库表字段信息失败')
        }
      })
    },
    canc() {

    },
    save() {

    },
    getList() { // 获取表数据
      getTableList().then(res => {
        if (res.data) {
          this.list = res.data
        } else {
          this.list = []
        }
      })
    },
    init() {
      this.getList()
    }
  }
}
</script>

<style>
</style>
