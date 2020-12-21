# 特别致谢
本工程FORK自https://panjiachen.github.io/ 的基础模版

个人是JAVA后端开发，本工程为我学习Vue提供非常大的帮助

meals-ui基于meal-ui进行一定程度的功能补充

关于meal:

meal（[gitee地址](https://gitee.com/mebugs/meal) [github地址](https://github.com/mebugs/meal)）

meal-ui（[gitee地址](https://gitee.com/mebugs/meal-ui) [github地址](https://github.com/mebugs/meal-ui)）

meals相比meal增加了更为细致化的权限定义，不再仅仅是根据角色授权而是根据具体的权限集清单进行授权操作。

# meals-ui
本仓库为meals仓库的前端仓库

meals旨在提供基础的权限管理，包含账号、用户、角色、权限，使得构建新业务系统时不再关注基础支撑能力，直接关心具体业务实现即可。

本仓库地址：

meals-ui（[gitee地址](https://gitee.com/mebugs/meals-ui) [github地址](https://github.com/mebugs/meals-ui)）

服务端仓库地址：

meals（[gitee地址](https://gitee.com/mebugs/meals) [github地址](https://github.com/mebugs/meals)）

服务端项目JAVA语言开发，是一个简化开发的基础脚手架（基于SpringBoot）。

# 关键开发日志
**本工程基于meal-ui继续开发，部分已有能力不再此处赘述**
 - v-droll移动至自定义指令相关目录
 - 增加自定义指令v-authorize判断界面按钮菜单是否具备权限
 - 增加全局方法authorize('AUTH')返回boolean用于特定组件判断权限通过v-if="authorize('AUTH')"
 - 修改路由rolse为auth（路由指定唯一auth标示需要的权限）
 - 代码生成器增强，支持模糊查询表名，支持多选生成代码

# 构建
 - 启动前需要先启动后段工程meals
 - 开发模式： npm run dev
 - 生产编译： npm run build