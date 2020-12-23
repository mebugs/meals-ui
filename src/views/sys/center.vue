<template>
  <div v-loading="loading" class="app-container">
    <div v-if="mine" class="mine">
      <p>欢迎回来：<b>{{ mine.name }}</b></p>
    </div>
    <div class="fux">
      <div class="lx">
        <div class="authT">
          <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in allAuthTree" :label="item.roleName" :name="item.roleName">
              <el-table style="width: 100%" class="tfull" size="small" :stripe="true" :show-overflow-tooltip="true" :data="item.authTree" row-key="id" default-expand-all :tree-props="{children: 'children'}" border>
                <el-table-column label="权限名称" align="left">
                  <template slot-scope="scope"><span>{{ scope.row.name }}</span></template>
                </el-table-column>
                <el-table-column label="权限类型" align="left">
                  <template slot-scope="scope"><el-tag :type="typeTags[scope.row.type]">{{ typeVals[scope.row.type] }}</el-tag></template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="rx">
        <p class="tips">提示：如遗忘密码可联系管理重置密码，初始密码与账号名一致。</p>
        <div v-loading="doLoading" class="popload">
          <el-form ref="user" :model="user" :rules="rules" label-width="85px">
            <el-form-item class="need" label="当前密码" prop="nowPwd">
              <el-input v-model="user.nowPwd" type="password" placeholder="请输入当前登录密码" maxlength="16" show-word-limit />
            </el-form-item>
            <el-form-item class="need" label="修改密码" prop="newPwd">
              <el-input v-model="user.newPwd" type="password" placeholder="请输入新登录密码" maxlength="16" show-word-limit />
            </el-form-item>
            <el-form-item class="need" label="确认密码" prop="newPwdRe">
              <el-input v-model="user.newPwdRe" type="password" placeholder="请确认新登录密码" maxlength="16" show-word-limit />
            </el-form-item>
          </el-form>
          <el-button size="medium" type="primary" @click="save">确认修改</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getMine, resetPwd } from '@/api/user'
export default
{
  data() {
    return {
      mine: null,
      loading: true,
      user: {},
      doLoading: false,
      rules: {
        nowPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { required: true, pattern: /^\w+$/, message: '密码支持字母数字下划线组合', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { required: true, pattern: /^\w+$/, message: '密码支持字母数字下划线组合', trigger: 'blur' }
        ],
        newPwdRe: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { required: true, pattern: /^\w+$/, message: '密码支持字母数字下划线组合', trigger: 'blur' }
        ]
      },
      activeName: '全部权限',
      allAuthTree: [],
      typeVals: ['', '菜单/路由', '按钮/接口'],
      typeTags: ['primary', 'primary', 'success']
    }
  },
  created() {
    this.init()
  },
  methods:
  {
    save() {
      this.$refs.user.validate(valid => {
        if (valid) {
          // 检查角色选择
          if (this.user.newPwd !== this.user.newPwdRe) {
            this.$message.warning('确认密码需要与修改密码一致方可提交')
            return false
          }
          if (this.user.newPwd === this.user.nowPwd) {
            this.$message.warning('新旧密码需要不相同方可提交')
            return false
          }
          this.doLoading = true
          resetPwd(this.user).then(res => {
            this.doLoading = false
            if (res.data) {
              this.$message.success('密码数据更新成功')
              this.user = {}
            } else {
              this.$message.error('密码数据更新失败，可能原密码不正确')
            }
          })
        } else {
          this.$message.warning('请输入标红必填项后提交')
          return false
        }
      })
    },
    init() {
      // 获取我的信息
      getMine().then(res => {
        if (res.data) {
          this.loading = false
          this.mine = res.data
          this.allAuthTree = this.mine.userAuthVos
        }
      })
    }
  }
}
</script>

<style scoped>
  .mine p {
      line-height: 1.5;
      font-size: 15px;
      padding: 5px;
  }
  .mine p b {
      margin: 0 5px;
      font-size: 16px;
      color: #304156;
  }
  .popload {
    width: 300px;
  }
  .fux {
      display: flex;
  }

  .lx {
      width: calc(60% - 40px);
      margin-right: 40px;
  }

  .rx {
      width: 40%;
  }
  .tfull {
      max-height: calc(100vh - 210px);
      overflow-y: auto;
      overflow-x: hidden;
  }
</style>
