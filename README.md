<p align="center">
  <img src="./src/assets/logo.png">
</p>
<h1 align="center">DataV Vue</h1>
<p align="center">
  <a href="https://github.com/pengxiaotian/datav-vue/actions/workflows/master-deploy.yml">
    <img src="https://github.com/pengxiaotian/datav-vue/actions/workflows/master-deploy.yml/badge.svg?branch=master">
  </a>
  <br>
</p>
<p align="center">一个基于 Vue3.x 的数据可视化项目</p>

* 💪 Vue 3.0+
* 🔥 TypeScript 4.2+

### 简介

- [DataV Demo](http://datav.pengxiaotian.com)

#### 登录页
![登录页](./demo/login.png)

#### 可视化列表
![可视化列表](./demo/home.png)

#### 编辑器
![编辑器](./demo/editor.png)

### 安装与使用

```bash
# 初始化项目
yarn bootstrap

# 跑起来！
yarn serve

# 构建发布
yarn build
```

#### 创建组件

```bash
yarn gc [component name]
```

#### 创建组件 or Store

```bash
yarn new
```

#### Git提交模板

```bash
yarn cz
```
例子：
```
[TYPE](SCOPE):DESCRIPTION#[ISSUE]
# example feat(button):add type 'button' for form usage #1234
```

Git提交模板配置：`./commitlint.config.js`

### 注意

本项目主要用来研究与学习，如果商用请注意：项目里含有一些第三方付费素材，如：`orbitron-bold` 字体。
