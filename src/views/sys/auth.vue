<template>
  <div class="app-container">
    <el-table v-loading="loading" style="width: 100%" :stripe="true" :show-overflow-tooltip="true" :data="list" border row-key="id" default-expand-all :tree-props="{children: 'children'}">
      <el-table-column label="权限名称" align="left">
        <template slot-scope="scope"><span>{{ scope.row.name }}</span></template>
      </el-table-column>
      <el-table-column label="权限类型" width="120" align="left">
        <template slot-scope="scope"><el-tag :type="typeTags[scope.row.type]">{{ typeVals[scope.row.type] }}</el-tag></template>
      </el-table-column>
      <el-table-column label="权限等级" width="100" align="left">
        <template slot-scope="scope">{{ scope.row.level+'级' }}</template>
      </el-table-column>
      <el-table-column label="权限KEY" align="left">
        <template slot-scope="scope"><span>{{ scope.row.authKey }}</span></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllAuthTree } from '@/api/auth'
export default
{
  data() {
    return {
      list: [],
      loading: false,
      typeVals: ['', '菜单/路由', '按钮/接口' ],
      typeTags: ['primary', 'primary', 'success']
    }
  },
  created() {
    this.init()
  },
  methods:
  {
    getList() {
      this.loading = true
      getAllAuthTree().then(res => {
        if (res.data) {
          this.list = res.data
        } else {
          this.list = []
        }
        this.loading = false
      })
    },
    init() { // 页面初始化
      this.getList()
    }

  }
}
</script>

<style>
</style>
