# Frameless PC

**workspace 模式已经释出一个版本，从 @enn/fl-scripts 0.1.38 开始可以使用，目前（0.1.38）视不同机器，可能会遇到进程内存不足崩溃的情况，重启即可，如果频率太高，咨询 @周一鸣**

**上手开发前务必通读本文档，避免低级错误，有疑惑的话找 @zhouyiming 。**

**开发过程中有任何疑惑到 frameless 答疑群询问 @zhouyiming**

## 更简短的开发手册，更好读一些

https://alidocs.dingtalk.com/i/nodes/pq7N1kjGYznWyGELMglwJO43vrPX95oA?utm_scene=team_space

## 开发范围

当前将开发维度分为了两个，应用维度、页面维度

- 应用
  - App 级别的开发负责处理全局副作用逻辑，比如：
    - 全局登陆
    - 监控接入
    - ...
- 页面
  - Page 级别的开发负责主要的业务逻辑，比如:
    - 表单
    - 详情
    - ...

## 开始开发

### 启动开发服务

`enpm i`

`enpm run dev`

http://localhost:9999 上会启动开发工作台

在页面列表中点击 **查看** 可以跳转应用页面

在页面列表 **日志** 中有页面进程的控制台输出

页面开发服务会在 4000 以上端口启动

#### 创建页面

访问 [开发工作台](http://localhost:9999)
访问 [开发工作台 - 页面管理 - 新建页面](http://localhost:9999/page-manage/create)

一般情况下，没有嵌套路由则选择 vue3 + ency + ts
如果需要使用 vue-router，则选择 vue3 + vue-router + ency + ts
其他情况按需选择

#### 开发限制

1. 进行正常开发即可，页面间路由跳转必须使用原生方法，比如 `a 链接` 或者 `history.pushState` 或者 `history.replaceState`。
   1. - 核心库文档 [native-spa-route 文档](https://www.npmjs.com/package/native-spa-route)。
2. 最好对页面的工程结构不要做太大的改动，使用非 vite 的情况下需要自己支持一些属性。
3. 注意下页面内的 CSS 引用不要忘记了，全局的引用会导致问题，因此请确保页面中用到的样式文件都被 import 过。
4. 目前项目内容都是开放的，实际上的自由度非常高，可以按自己需求调整，但是同样会看到一些平时不关心的内容，忽略就好。
5. 其余参考 iCome 文档

## 特殊命令用法详解

### add-dep

依赖添加辅助命令，可以在多个页面中安装依赖。

`enpm run add-dep --dep <依赖1> [--dep <依赖2>] [[--page-route <页面路由，如 demo/zhouyiming/demo1>]]`

### exec

可以在多个页面上同时执行命令。

`enpm run exec -c "<你的命令>" [[-p <页面路由>]]`
