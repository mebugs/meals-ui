forked from PanJiaChen/vue-admin-template

# 特别致谢

本工程FORK自https://panjiachen.github.io/ 的基础模版

个人是JAVA后端开发，本工程为我学习Vue提供非常大的帮助

# meal-ui

本工程基于vue-admin-template进行精简和修改，主要为了便于与meal服务端工程配套使用

能够快速铺开一些微小的应用项目

# 关键开发日志
 - 移除Mocks模拟返回服务（调用meal服务端工程）
 - 移除测试模块以及相关依赖
 - 移除Cookies插件依赖，Cookies统一替换为window.localStorage
 - 补充动态路由由Roles控制（参考vue-admin-template实现）
 - 未移除自定义icon（svg格式），替换为element-ui的图标，直接修改了Sidebar/Item.vue
 - 核心方法getUserBase获取用户基础信息并存于state中
 - 增加v-droll可以自由在屏幕范围内拖动弹窗（utils/droll.js）
