<template>
  <div class="app-container">
    <div class="query">
      <el-input v-model="query.name" class="querys h_40 w_200" clearable size="small" placeholder="请输入角色名快速搜索" />
      <el-button size="medium" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button v-authorize="'SYS-ROLE-C'" size="medium" type="danger" icon="el-icon-plus" @click="add">添加</el-button>
    </div>
    <el-table v-loading="loading" style="width: 100%" :stripe="true" :show-overflow-tooltip="true" :data="list" border>
      <el-table-column label="角色名称" align="left">
        <template slot-scope="scope"><span>{{ scope.row.name }}</span></template>
      </el-table-column>
      <el-table-column label="角色KEY" align="left">
        <template slot-scope="scope"><span>{{ scope.row.roleKey }}</span></template>
      </el-table-column>
      <el-table-column label="角色备注" max-width="600" :show-overflow-tooltip="true" align="left">
        <template slot-scope="scope"><span>{{ scope.row.remark }}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="left">
        <template slot-scope="scope">
          <el-tooltip v-authorize="'SYS-ROLE-M'" class="item" effect="dark" content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="modify(scope.row.id)" />
          </el-tooltip>
          <el-tooltip v-authorize="'SYS-ROLE-D'" class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination">
      <el-pagination :current-page.sync="query.current" :page-size="query.size" layout="total, prev, pager, next, jumper" :total="query.total" background @current-change="change" />
    </div>
    <el-dialog v-droll :title="title" width="900px" :visible.sync="doFlag" :close-on-click-modal="false">
      <div v-loading="doLoading" class="popload">
        <el-form ref="role" class="half" :model="role" :rules="rules" label-width="85px">
          <el-form-item class="need" label="角色名称" prop="name">
            <el-input v-model="role.name" placeholder="请输入角色名称" maxlength="16" show-word-limit />
          </el-form-item>
          <el-form-item label="角色KEY">
            <el-input v-model="role.roleKey" placeholder="请输入角色KEY" maxlength="16" show-word-limit />
          </el-form-item>
          <el-form-item class="full" label="角色描述">
            <el-input v-model="role.remark" type="textarea" :rows="3" show-word-limit maxlength="500" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>
        <div class="half">
          <div class="hfitem hlf">
            <el-tree v-if="doFlag" ref="authTree" node-key="id" :data="allAuthTree" :check-strictly="true" :props="{label: 'name'}" show-checkbox :default-expand-all="true" :default-checked-keys="roleAuthIds" @check="checkNode" />
          </div>
          <div class="hfitem hlr">
            <el-table v-if="showTree" style="width: 100%" height="350" size="small" :stripe="true" :show-overflow-tooltip="true" :data="roleAuthTree" row-key="id" default-expand-all :tree-props="{children: 'children'}">
              <el-table-column label="权限名称" align="left">
                <template slot-scope="scope"><span>{{ scope.row.name }}</span></template>
              </el-table-column>
              <el-table-column label="权限类型" align="left">
                <template slot-scope="scope"><el-tag :type="typeTags[scope.row.type]">{{ typeVals[scope.row.type] }}</el-tag></template>
              </el-table-column>
            </el-table>
            <div v-else class="tpx">
              <p>
                您对角色的权限树进行了修改！<br>
                为了避免数据渲染异常！<br>
                提交[保存]后方可看到新的权限树内容！<br>
                如不保存点击[取消]即可！
              </p>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" plain type="primary" @click="canc">取消</el-button>
          <el-button size="small" type="primary" @click="save">保存</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageRole, getRoleInfo, saveRole, delRoleInfo } from '@/api/role'
import { getAllAuthTree } from '@/api/auth'
export default
{
  data() {
    return {
      query: { name: null, current: 1, size: 10, total: 0 },
      list: [],
      loading: false,
      doLoading: false,
      doFlag: false,
      title: '',
      role: {},
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      roleAuthTree: [],
      typeVals: ['', '菜单/路由', '按钮/接口'],
      typeTags: ['primary', 'primary', 'success'],
      roleAuthIds: [],
      allAuthTree: [],
      showTree: true
    }
  },
  created() {
    this.init()
  },
  methods:
  {
    checkNode(data) { // 节点被点击了
      this.showTree = false // 界面隐藏当前TREE
      var thisNode = this.$refs.authTree.getNode(data.id)
      var checked = thisNode.checked
      // 当前节点为子节点
      if (data.pid !== -1) {
        // 获取父级点
        var parentNode = this.$refs.authTree.getNode(data.pid)
        if (checked) {
          this.$refs.authTree.setChecked(data.pid, true)
        } else {
          // 如果取消选中，检查父节点是否该取消选中（可能仍有子节点为选中状态）
          var childNodes = parentNode.childNodes
          var noChildCheck = true
          for (const i in childNodes) {
            if (childNodes[i].checked === true) {
              noChildCheck = false
              break
            }
          }
          if (noChildCheck) {
            this.$refs.authTree.setChecked(data.pid, false)
          }
        }
        // 父级还有上级
        if (parentNode.data.pid !== -1) {
          var gradNode = this.$refs.authTree.getNode(parentNode.data.pid)
          if (checked) {
            this.$refs.authTree.setChecked(parentNode.data.pid, true)
          } else {
            var chilpNodes = gradNode.childNodes
            var noChilpCheck = true
            for (const i in chilpNodes) {
              if (chilpNodes[i].checked === true) {
                noChilpCheck = false
                break
              }
            }
            if (noChilpCheck) {
              this.$refs.authTree.setChecked(parentNode.data.pid, false)
            }
          }
        }
      }
      // 操作的是一个父节点，子节点跟随变动 此处三级树 多级树需要继续嵌套 暂时没考虑做递归
      if (data.children != null) {
        for (const j in data.children) {
          this.$refs.authTree.setChecked(data.children[j].id, checked)
          if (data.children[j].children != null) {
            const childrenU = data.children[j].children
            for (const u in childrenU) {
              this.$refs.authTree.setChecked(childrenU[u].id, checked)
            }
          }
        }
      }
    },
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
      pageRole(this.query).then(res => {
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
      this.$refs.role.validate(valid => {
        if (valid) {
          // 检查权限选择
          const checkAuth = this.$refs.authTree.getCheckedKeys()
          if (checkAuth.length < 1) {
            this.$message.warning('至少需要选择一个权限提交')
            return false
          }
          this.role.authIds = checkAuth
          this.doLoading = true
          saveRole(this.role).then(res => {
            this.doLoading = false
            if (res.data) {
              this.$message.success('角色数据更新成功')
              this.canc()
              this.getList()
            } else {
              this.$message.error('角色数据更新失败')
            }
          })
        } else {
          this.$message.warning('请输入标红必填项后提交')
          return false
        }
      })
    },
    modify(id) { // 修改
      this.canc()
      this.title = '修改角色配置'
      this.doFlag = true
      this.doLoading = true
      getRoleInfo(id).then(res => {
        if (res.data) {
          this.role = res.data
          this.roleAuthIds = this.role.authIds
          this.roleAuthCheckd = this.role.authIds
          this.roleAuthTree = this.role.authTree
          this.showTree = true
          this.doLoading = false
        } else {
          this.$message.error('获取角色信息失败')
        }
      })
    },
    del(id) { // 删除
      const tips = '是否确认此角色？删除使用此角色的用户也会同步删除角色！'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRoleInfo(id).then(res => {
          if (res.data) {
            this.$message.success('角色数据更新成功')
            this.canc()
            this.getList()
          } else {
            this.$message.error('删除角色信息失败')
          }
        })
      })
    },
    canc() { // 通用弹窗取消
      this.role = {}
      this.roleAuthIds = []
      this.roleAuthTree = []
      this.showTree = true
      this.doFlag = false
      this.title = ''
      this.doLoading = false
    },
    init() { // 页面初始化
      // 获取全部权限树
      getAllAuthTree().then(res => {
        if (res.data) {
          this.allAuthTree = res.data
        }
      })
      this.getList()
    }
  }
}
</script>

<style scoped="scoped">
 .half{
   margin-bottom: 15px;
 }
.hfitem.hlf {
    width: calc(50% - 5px);
    margin-right: 5px;
    padding: 5px;
}

.hfitem {
    height: 350px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #ebeef5;
}
.hfitem.hlr{
  overflow: hidden;
}
.tpx {
    border: 1px solid #ebeef5;
    padding: 5px;
    height: 100%;
}

.tpx p {
    margin: 50px 5px;
    line-height: 30px;
    font-size: 16px;
    color:#283443
}
</style>
