<template>
  <div class="app-container">
    <div class="query">
      <el-input v-model="query.name" class="querys h_40 w_200" clearable size="small" placeholder="请输入账号快速搜索" />
      <el-select v-model="query.roleId" class="querys" clearable placeholder="请选择账号角色">
        <el-option v-for="item in allRoles" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="query.status" class="querys" clearable placeholder="请选择账号状态">
        <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button size="medium" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button size="medium" type="danger" icon="el-icon-plus" @click="add">添加</el-button>
    </div>
    <el-table v-loading="loading" style="width: 100%" :stripe="true" :show-overflow-tooltip="true" :data="list" border>
      <el-table-column label="登陆账号" align="center">
        <template slot-scope="scope"><span>{{ scope.row.name }}</span></template>
      </el-table-column>
      <el-table-column label="权限角色" max-width="400" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope"><span>{{ scope.row.roleStr }}</span></template>
      </el-table-column>
      <el-table-column label="账号状态" align="center">
        <template slot-scope="scope"><el-tag :type="statusTags[scope.row.status]">{{ statusNames[scope.row.status] }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.status<3" class="item" effect="dark" content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="modify(scope.row.id)" />
          </el-tooltip>
          <el-tooltip v-if="scope.row.status==1" class="item" effect="dark" content="锁定" placement="top">
            <el-button type="warning" icon="el-icon-lock" size="mini" @click="changeTo(scope.row,2)" />
          </el-tooltip>
          <el-tooltip v-if="scope.row.status==2" class="item" effect="dark" content="解锁" placement="top">
            <el-button type="success" icon="el-icon-unlock" size="mini" @click="changeTo(scope.row,1)" />
          </el-tooltip>
          <el-tooltip v-if="scope.row.status<3" class="item" effect="dark" content="重置密码" placement="top">
            <el-button type="info" icon="el-icon-refresh" size="mini" @click="changeTo(scope.row,4)" />
          </el-tooltip>
          <el-tooltip v-if="scope.row.status<3" class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="changeTo(scope.row,3)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination">
      <el-pagination :current-page.sync="query.current" :page-size="query.size" layout="total, prev, pager, next, jumper" :total="query.total" background @current-change="change" />
    </div>
    <el-dialog v-droll :title="title" width="500px" :visible.sync="doFlag" :close-on-click-modal="false">
      <div v-loading="doLoading" class="popload">
        <el-form ref="user" :model="user" :rules="rules" label-width="85px">
          <el-form-item class="need" label="登录账号" prop="name">
            <el-input v-model="user.name" placeholder="请输入登录帐号名" maxlength="16" show-word-limit />
          </el-form-item>
          <el-form-item class="need is-required" label="权限角色">
            <el-checkbox-group v-model="checkRoles" size="small">
              <el-checkbox v-for="item in allRoles" :key="item.id" :label="item.id" border>{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <p class="tips">提示：初始密码与账号名一致，管理员可在列表页重置密码。</p>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" plain type="primary" @click="canc">取消</el-button>
          <el-button size="small" type="primary" @click="save">保存</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllRole } from '@/api/role'
import { saveUser, pageUser, getUser } from '@/api/user'
export default
{
  data() {
    return {
      query: { name: null, roleId: null, status: null, current: 1, size: 10, total: 0 },
      list: [],
      statusNames: ['', '正常', '锁定', '删除'],
      statusTags: ['primary', 'primary', 'warning', 'danger'],
      statusList: [{ id: 1, name: '正常' }, { id: 2, name: '锁定' }, { id: 3, name: '删除' }],
      loading: false,
      doLoading: false,
      doFlag: false,
      title: '',
      user: {},
      rules: {
        name: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { required: true, pattern: /^\w+$/, message: '账号支持字母数字下划线组合', trigger: 'blur' }
        ]
      },
      allRoles: [],
      checkRoles: []
    }
  },
  created() {
    this.init()
  },
  methods:
  {
    search() { // 查询
      this.query.current = 1
      this.getList()
    },
    change(current) { // 换页
      this.query.current = current
      this.getList()
    },
    getList() {
      this.loading = true
      pageUser(this.query).then(res => {
        if (res.data) {
          this.list = res.data.records
          this.query.total = res.data.total
        } else {
          this.list = []
          this.query.total = 0
        }
        this.loading = false
      })
    },
    add() { // 添加
      this.canc()
      this.title = '创建登录账号'
      this.doFlag = true
    },
    save() {
      this.$refs.user.validate(valid => {
        if (valid) {
          // 检查角色选择
          if (this.checkRoles.length < 1) {
            this.$message.warning('至少需要选择一个权限角色后提交')
            return false
          }
          this.user.roles = this.checkRoles
          this.saveOne()
        } else {
          this.$message.warning('请输入标红必填项后提交')
          return false
        }
      })
    },
    modify(id) { // 修改
      this.canc()
      this.title = '修改登录账户'
      this.doFlag = true
      this.doLoading = true
      getUser(id).then(res => {
        if (res.data) {
          this.user = res.data
          this.checkRoles = res.data.roles
          this.doLoading = false
        } else {
          this.$message.error('获取用户信息失败')
        }
      })
    },
    changeTo(row, type) { // 锁定 解锁 删除 重置密码
      this.user = { id: row.id }
      let tips = '是否确认删除账号？删除后无法恢复，仅在列表可见！'
      switch (type) {
        case 4 :
          tips = '是否确认重置该账号的密码？密码将重置与账号一致！'
          this.user.resetPwd = 1
          this.user.name = row.name
          break
        case 2 :
          tips = '是否确认锁定账号？锁定后账号将无法登陆系统！'
          this.user.status = type
          break
        case 1 :
          tips = '是否确认解锁账号？解锁后账号将可以登陆系统！'
          this.user.status = type
          break
        default :
          this.user.status = type
          break
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveOne()
      })
    },
    saveOne() {
      this.doLoading = true
      saveUser(this.user).then(res => {
        this.doLoading = false
        if (res.data) {
          this.$message.success('用户数据更新成功')
          this.canc()
          this.getList()
        } else {
          this.$message.error('用户数据更新失败，可能账号名已存在')
        }
      })
    },
    canc() { // 通用弹窗取消
      this.user = {}
      this.checkRoles = []
      this.doFlag = false
      this.title = ''
      this.doLoading = false
    },
    init() { // 页面初始化
      // 获取全部角色
      getAllRole().then(res => {
        if (res.data) {
          this.allRoles = res.data
        }
      })
      this.getList()
    }

  }
}
</script>

<style>
</style>
