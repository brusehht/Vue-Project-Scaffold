> 本项目是`vue-cli@3`基础上二次配置的 typescript+vue 开发环境

# 项目结构

* mock 接口模拟
* dist build 生产环境资源
* public HTML 和一些拷贝到 dist 下的静态资源
* src 开发目录
  * api 接口配置文件 axios websocket
  * assets css font img json 等资源
  * components 公用 vue 组件
  * config 配置 基础开发需引入的文件
  * plugins Vue 插件
  * type typescript 声明文件
  * view 页面
  * utils 工具函数
  * store
  * route
* test 单元测试 e2e 测试
* ts.config.json typescript 配置文件
* vue.config.js webpack 自定义配置

---

# 使用

* `npm run serve` 开发
* `npm run build` 生产

# 开发相关

### 1. public 下包含`systemConfig.js`

可用于更改接口和websocket相关配置

### 2. vue-property-decorator

Vue 装饰器

### 3. Vue 单文件开发前需引入`config/base.imports`

包括 Vue 装饰器 Utils 接口 websocket 相关

### 4. Vue 文件内 this 报错

可将`this:any`作为第一个参数传入

### 5.```vue.config.js```已开启webpack-dll
默认使用package.json中dependencies作为dll bundle
