<template>
  <div class="app-container">
    <p>本页面全员可见</p>
    <p v-authorize="'admin'">自定义指令：v-authorize（管理员可见）</p>
    <p v-authorize="'dev'">自定义指令：v-authorize（开发者可见）</p>
    <p v-authorize="'test'">自定义指令：v-authorize（测试可见）</p>
  </div>
</template>

<script>
</script>

<style>
</style>
