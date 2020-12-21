<template>
  <div class="app-container">
    <div class="query">
      <el-input v-model="query.tableName" class="querys h_40 w_200" clearable size="small" placeholder="请输入表名模糊查询" />
      <el-button size="medium" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button size="medium" :type="showBatch ? 'danger' : 'info'" icon="el-icon-plus" @click="addBatch">批量生成代码</el-button>
    </div>
    <el-table v-loading="loading" style="width: 100%" :stripe="true" :show-overflow-tooltip="true" :data="list" border @selection-change="listSelect">
      <el-table-column type="selection" width="40" />
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
      <div v-loading="doLoading" class="popload">
        <el-form ref="conf" class="half" :model="conf" :rules="rules" label-width="75px">
          <el-table v-if="batchFlag" style="width: 100%;margin-bottom: 10px;" :stripe="true" size="mini" :show-overflow-tooltip="true" :data="seList" border>
            <el-table-column label="表名" align="center">
              <template slot-scope="scope"><span>{{ scope.row.tableName }}</span></template>
            </el-table-column>
            <el-table-column label="注释" max-width="400" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope"><span>{{ scope.row.comments }}</span></template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope"><span>{{ scope.row.createTime }}</span></template>
            </el-table-column>
          </el-table>
          <el-table v-else style="width: 100%;margin-bottom: 10px;" :stripe="true" size="mini" :show-overflow-tooltip="true" :data="columnList" border>
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
            <el-input v-model="conf.packageName" placeholder="请输入生成代码基础包路径(代码最终生成路径为该包路径+模块名),如:com.meals" />
          </el-form-item>
          <el-form-item class="need" label="模块名" prop="moduleName">
            <el-input v-model="conf.moduleName" placeholder="请输入该表所在模块名,如:sys" />
          </el-form-item>
          <el-form-item class="need" label="作者名" prop="author">
            <el-input v-model="conf.author" placeholder="请输入作者@author,如:米虫" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" plain type="primary" @click="canc">取消</el-button>
          <el-button size="small" type="primary" @click="save">保存</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTableList, getTableColumnList, makeCode } from '@/api/codeMaker'
export default
{
  data() {
    return {
      query: { tableName: null },
      list: [],
      loading: false,
      doFlag: false,
      doLoading: false,
      title: '',
      columnList: [],
      conf: {},
      rules: {
        packageName: [{ required: true, message: '请输入生成代码基础包路径', trigger: 'blur' }],
        moduleName: [{ required: true, message: '请输入该表所在模块名', trigger: 'blur' }],
        author: [{ required: true, message: '请输入作者@author', trigger: 'blur' }]
      },
      seList: [],
      showBatch: false,
      batchFlag: false
    }
  },
  created() {
    this.init()
  },
  methods:
  {
    addBatch() { // 发起批量创建操作
      if (this.seList && this.seList.length > 1) {
        this.canc()
        this.title = '多表代码批量生成'
        this.doFlag = true
        this.doLoading = true
        this.batchFlag = true
        this.conf.tableName = []
        this.seList.forEach(item => {
          this.conf.tableName.push(item.tableName)
        })
        this.doLoading = false
      } else {
        this.$message.warning('至少需要选择2个以上表进行批量生成，单表生成点击表数据后方的蓝色[代码生成]即可')
      }
    },
    listSelect(val) { // 触发多选
      if (val && val.length > 2) {
        this.showBatch = true
      } else {
        this.showBatch = false
      }
      this.seList = val
    },
    search() { // 查询方法
      this.getList()
    },
    makeCode(row) { // 代码生成
      this.canc()
      this.title = '[ ' + row.tableName + ' ] 代码生成'
      this.doFlag = true
      this.doLoading = true
      this.columnList = []
      getTableColumnList(row.tableName).then(res => {
        if (res.data) {
          this.columnList = res.data
          this.conf.tableName = [row.tableName]
          this.doLoading = false
        } else {
          this.$message.error('获取数据库表字段信息失败')
        }
      })
    },
    canc() {
      this.doFlag = false
      this.conf = {}
    },
    save() {
      this.$refs.conf.validate(valid => {
        if (valid) {
          this.doLoading = true
          makeCode(this.conf).then(res => {
            this.doLoading = false
            if (res.data) {
              this.$message.success('代码生成完成，请到服务端项目中查看')
              this.doFlag = false
            } else {
              this.$message.error('获取数据库表字段信息失败')
            }
          })
        } else {
          this.$message.warning('请输入标红必填项后提交')
          return false
        }
      })
    },
    getList() { // 获取表数据
      this.loading = true
      getTableList(this.query).then(res => {
        if (res.data) {
          this.list = res.data
        } else {
          this.list = []
        }
        this.loading = false
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
