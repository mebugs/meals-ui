<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.el-menu-item i,.el-submenu__title i{color:#dcedff!important;font-size:20px!important}
ul.el-menu--collapse.el-menu i{margin:15px;font-size:24px!important}
.el-dialog{}
.el-dialog__body{padding:15px!important;overflow:hidden}
.el-dialog__header{margin-bottom:5px;padding:15px;background:#283443;cursor: move;}
.el-dialog__header .el-dialog__title{color: #fff;font-weight:900;}
.el-dialog__header button{top:15px;right: 15px;}
i.el-dialog__close.el-icon.el-icon-close{color:#fff;font-weight:900;font-size:24px}
.half{overflow:hidden}
.half .el-form-item{width:50%;float:left}
.need label.el-form-item__label{color:#f44336}
.el-form-item{margin-bottom:18px}
.el-form-item.full{width:100%}
p.tp {margin: 10px 0;padding: 10px;background: #304156;color: #dcedff;}
input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{color:#666!important}
input:-moz-placeholder,textarea:-moz-placeholder{color:#666!important}
input::-moz-placeholder,textarea::-moz-placeholder{color:#666!important}
input:-ms-input-placeholder,textarea:-ms-input-placeholder{color:#666!important}
::-webkit-scrollbar{width:16px;height:16px}
::-webkit-scrollbar-thumb{border-radius:0;background-color:#283443}
::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px #eee;background-color:#fbfbfb;border-radius:0}
@media(max-width:600px){.el-dialog{width:90%!important}
.half .el-form-item{width:100%}
}
</style>
