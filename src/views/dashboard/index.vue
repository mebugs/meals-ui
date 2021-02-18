<template>
  <div class="dashboard-container">
    <div class="markdown-body editormd-preview-container" previewcontainer="true" style="padding: 20px;">
      <h1 id="h1-u57FAu672Cu4FE1u606F"><a name="基本信息" class="reference-link" /><span class="header-link octicon octicon-link" />基本信息</h1><p>Meal’S是对Meal工程的增强版。<br>Meal’S依旧不会包含过多的业务逻辑，提供用户-角色-权限集的基础管理能力。<br>Meal’S可以实现自定义角色并为角色自由赋予权限，最终用户所具备的权限集是其所选择的角色权限集的并集。<br>Meal’S工程为了提升效率设置了相对科学的缓存命名空间，下文中会详细说明。</p>
      <p>服务端工程地址：<br><a href="https://gitee.com/mebugs/meals" title="Gitee">Gitee</a><br><a href="https://github.com/mebugs/meals" title="GitHub">GitHub</a></p>
      <p>前端工程地址：<br><a href="https://gitee.com/mebugs/meals-ui" title="Gitee">Gitee</a><br><a href="https://github.com/mebugs/meals-ui" title="GitHub">GitHub</a></p>
      <h2 id="h2-u7279u522Bu81F4u8C22"><a name="特别致谢" class="reference-link" /><span class="header-link octicon octicon-link" />特别致谢</h2><p>Meal’S服务端使用<a href="https://mybatis.plus/" title="MyBatis-Plus">MyBatis-Plus</a>作为基础脚手架。<br>Meal’S服务端使用<a href="https://github.com/jwtk/jjwt" title="jjwt">jjwt</a>实现JWT快速加解密。<br>Meal’S-ui前端工程Fork自<a href="https://github.com/PanJiaChen/vue-admin-template" title="vue-admin-template">vue-admin-template</a>。<br>本人是JAVA服务端开发，<a href="https://github.com/PanJiaChen" title="@花裤衩">@花裤衩</a>的前端系列开源项目为我学习Vue提供非常大的帮助，非常感谢！</p>
      <h1 id="h1-u529Fu80FDu6E05u5355"><a name="功能清单" class="reference-link" /><span class="header-link octicon octicon-link" />功能清单</h1><p>Meal’S工程仅提供了最基本的账号-角色-权限集支撑能力，没有涉及其他功能页面。<br>为了提供更为友好的体验，提供了账号查看自身权限集的能力。</p>
      <h2 id="h2-u767Bu9646u9875"><a name="登陆页" class="reference-link" /><span class="header-link octicon octicon-link" />登陆页</h2><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638188.jpg" alt=""></p>
      <h2 id="h2-u5DE5u4F5Cu4E2Du5FC3"><a name="工作中心" class="reference-link" /><span class="header-link octicon octicon-link" />工作中心</h2><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613639826.jpg" alt=""></p>
      <h2 id="h2-u4E2Au4EBAu4E2Du5FC3"><a name="个人中心" class="reference-link" /><span class="header-link octicon octicon-link" />个人中心</h2><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638233.jpg" alt=""></p>
      <h2 id="h2-u8D26u53F7u7BA1u7406"><a name="账号管理" class="reference-link" /><span class="header-link octicon octicon-link" />账号管理</h2><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638247.jpg" alt=""></p>
      <h2 id="h2-u89D2u8272u7BA1u7406"><a name="角色管理" class="reference-link" /><span class="header-link octicon octicon-link" />角色管理</h2><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638301.jpg" alt=""></p>
      <p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638311.jpg" alt=""></p>
      <h2 id="h2-u6743u9650u96C6u67E5u770B"><a name="权限集查看" class="reference-link" /><span class="header-link octicon octicon-link" />权限集查看</h2><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638354.jpg" alt=""></p>
      <h2 id="h2-u4EE3u7801u751Fu6210"><a name="代码生成" class="reference-link" /><span class="header-link octicon octicon-link" />代码生成</h2><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638325.jpg" alt=""></p>
      <p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638372.jpg" alt=""></p>
      <h1 id="h1-u5F00u53D1u8BF4u660E"><a name="开发说明" class="reference-link" /><span class="header-link octicon octicon-link" />开发说明</h1><h2 id="h2-u670Du52A1u7AEF"><a name="服务端" class="reference-link" /><span class="header-link octicon octicon-link" />服务端</h2><h3 id="h3-u5916u90E8u4F9Du8D56"><a name="外部依赖" class="reference-link" /><span class="header-link octicon octicon-link" />外部依赖</h3>
      <ol><li>JDK 1.8 已知可能持续使用很长时间的版本</li><li>MySql 5.7 经典版本</li><li>Redis 6.0 比较新的一个版本（实际上目前项目中对版本要求没有十分严格）</li></ol>
      <h3 id="h3-u57FAu672Cu7F13u5B58u7ED3u6784u8BF4u660E"><a name="基本缓存结构说明" class="reference-link" /><span class="header-link octicon octicon-link" />基本缓存结构说明</h3><p>Meal’S才用了Redis作为默认缓存工具，为了提升鉴权和查询性能，主要实现两大缓存。<br>权限树缓存：用于界面渲染树形结构。<br>权限集缓存：用户服务端接口鉴权。<br>设置缓存的主要目的用于降低数据库查询压力，尤其是查询权限树时，需要组装树形结构。</p>
      <p><img src="http://www.mebugs.com/blog/upload/post/POST_1613638634.jpg" alt=""></p>
      <h3 id="h3-u5DE5u7A0Bu76EEu5F55"><a name="工程目录" class="reference-link" /><span class="header-link octicon octicon-link" />工程目录</h3><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613639006.jpg" alt=""></p>
      <h3 id="h3-u6838u5FC3u7C7B"><a name="核心类" class="reference-link" /><span class="header-link octicon octicon-link" />核心类</h3>
      <ul><li>MyBatisPlusConfig：MyBatis-Plus配置类，配置Mapper扫描位置、分页插件等。</li><li>RedisConfig：配置Redis为默认缓存工具及常见操作Bean配置。</li><li>CodeMakerUtils：代码生成器的执行类</li><li>JwtUserContext：JWT安全用户上下文对象（全局获取登录用户信息）</li><li>JwtFilter：Jwt过滤器，核心过滤器（登录、授权、拦截）</li><li>ExceptionHandler：全局异常捕获处理（AOP实现，支持自定义异常处理）</li><li>AuthorizeInterceptor：权限拦截器（基于自定义注解<a href="https://github.com/Authorize" title="@Authorize" class="at-link">@Authorize</a>实现鉴权）</li><li>EncryptionUtils：盐值加密工具（账号的密码生成，不可逆加密算法）</li><li>SysInitTask：系统启动任务（当前主要缓存全部权限树）</li><li>ThreadAuthRole：角色权限变动线程（根据变动的角色ID更新角色、涉及用户权限相关缓存）</li><li>ThreadPoolConfig：基于Spring的线程池配置</li></ul>
      <h3 id="h3-u5F00u53D1u8BF4u660E"><a name="开发说明" class="reference-link" /><span class="header-link octicon octicon-link" />开发说明</h3>
      <ol><li>数据库初始化刷库</li><li>application-dev.yml配置您的数据库信息和redis信息（默认localhost）</li><li>启动App类</li></ol>
      <p>启动示意图：<br><img src="http://www.mebugs.com/blog/upload/post/POST_1613639279.jpg" alt=""></p>
      <h2 id="h2-u524Du7AEF"><a name="前端" class="reference-link" /><span class="header-link octicon octicon-link" />前端</h2><h3 id="h3-u5916u90E8u4F9Du8D56"><a name="外部依赖" class="reference-link" /><span class="header-link octicon octicon-link" />外部依赖</h3>
      <ol><li>Node.js（基本工具）</li><li>Git（多数前端工程依赖会需要调用Git下载）</li></ol>
      <h3 id="h3-u5DE5u7A0Bu76EEu5F55"><a name="工程目录" class="reference-link" /><span class="header-link octicon octicon-link" />工程目录</h3><p>因为Meals-ui和Meal-ui的工程目录结构没有产生变动，因此此处直接引用了Meal-ui的工程目录结构图。</p>
      <p><img src="http://www.mebugs.com/blog/upload/post/POST_1613615776.jpg" alt=""></p>
      <p><img src="http://www.mebugs.com/blog/upload/post/POST_1613615784.jpg" alt=""></p>
      <h3 id="h3-u76F8u5BF9u539Fu672Cu7684u6539u52A8"><a name="相对原本的改动" class="reference-link" /><span class="header-link octicon octicon-link" />相对原本的改动</h3>
      <ol><li>移除Mocks模拟返回服务（调用meal服务端工程）</li><li>移除测试模块以及相关依赖</li><li>移除Cookies插件依赖，Cookies统一替换为window.localStorage</li><li>补充动态路由由服务端返回的用户角色集Roles控制</li><li>移除自定义icon（svg格式），替换为element-ui的图标，直接修改了Sidebar/Item.vue</li><li>核心方法getUserBase获取用户基础信息src/store/modules/user.js getInfo()</li><li>增加v-droll可以自由在屏幕范围内拖动弹窗（src/directive/droll.js）</li></ol>
      <p>以下为Meals-ui基于Meal-ui增加的主要改动。</p>
      <ol><li>增加自定义指令v-authorize判断界面按钮菜单是否具备权限</li><li>修改路由rolse为auth（路由指定唯一auth标示需要的权限）</li><li>代码生成器增强，支持模糊查询表名，支持多选生成代码</li><li>对原本的element-ui主题配色进行了修改</li></ol>
      <pre class="prettyprint linenums prettyprinted" style=""><ol class="linenums"><li class="L0"><code class="lang-html"><span class="com">&lt;!-- v-authorize使用方式 --&gt;</span></code></li><li class="L1"><code class="lang-html"><span class="tag">&lt;button</span> <span class="atn">type</span><span class="pun">=</span><span class="atv">"button"</span> <span class="atn">v-authorize</span><span class="pun">=</span><span class="atv">"'SYS-USER-M'"</span> <span class="tag">/&gt;</span></code></li></ol></pre>
      <h3 id="h3-u542Fu52A8u754Cu9762"><a name="启动界面" class="reference-link" /><span class="header-link octicon octicon-link" />启动界面</h3><p><img src="http://www.mebugs.com/blog/upload/post/POST_1613616164.jpg" alt=""></p>
      <h3 id="h3-u5F00u53D1u8BF4u660E"><a name="开发说明" class="reference-link" /><span class="header-link octicon octicon-link" />开发说明</h3><pre class="prettyprint linenums prettyprinted" style=""><ol class="linenums"><li class="L0"><code class="lang-bash"><span class="com"># 依赖下载</span></code></li><li class="L1"><code class="lang-bash"><span class="pln">npm install</span></code></li><li class="L2"><code class="lang-bash"><span class="com"># 开发模式</span></code></li><li class="L3"><code class="lang-bash"><span class="pln">npm run dev</span></code></li><li class="L4"><code class="lang-bash"><span class="com"># 生产编译</span></code></li><li class="L5"><code class="lang-bash"><span class="pln">npm run build</span></code></li></ol></pre>
      <h1 id="h1-u5173u4E8Eu4E2Au4EBA"><a name="关于个人" class="reference-link" /><span class="header-link octicon octicon-link" />关于个人</h1><p><a href="http://www.mebugs.com/some/about.html" title="关于米虫先生">关于米虫先生</a></p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style scoped>
  @import 'http://www.mebugs.com/blog/css/editormd.css';
</style>
