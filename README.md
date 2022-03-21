<p align="center">
  <img src="./public/logo.png">
</p>
<h1 align="center">DataV Vue</h1>
<p align="center">
  <a href="https://github.com/pengxiaotian/datav-vue/actions/workflows/main-deploy.yml">
    <img src="https://github.com/pengxiaotian/datav-vue/actions/workflows/main-deploy.yml/badge.svg?branch=main">
  </a>
  <br>
</p>
<p align="center">一款数据可视化应用搭建工具</p>

* 💪 Vue 3.0+
* 🍍 Pinia 2.0+
* 🔥 TypeScript 4.0+
* 🔥 ECharts 5.0+

## 关于贡献

在完成第一个可用版本之前只接受 `fixbug PR`，不接受 `feature PR`。

## 简介

- [国外 GitHub](https://github.com/pengxiaotian/datav-vue)
- [国内 Gitee](https://gitee.com/pengxiaotian/datav-vue)

### 预览
- [DataV 在线预览](https://datav.pengxiaotian.com)

> 因 [RAP2](https://github.com/thx/rap2-delos) 只支持 `HTTP`, 所以只在开发环境中使用

> 生产环境使用 [Mockjs](https://github.com/nuysoft/Mock) 代替

#### 示例
|        |        |
| ------ | ------ |
| ![登录页](./demo/login.png)  |  ![可视化列表](./demo/home.png) |
| ![模板列表](./demo/template.png)  |  ![编辑器](./demo/editor.png) |
|||

## CheckList

```
- 页面功能
- [x] 登录页
  * [x] 看板娘
- [x] 首页
  * [x] 可视化管理
    - [x] 模板
  * [ ] 数据管理
  * [ ] 组件管理
  * [ ] 示例&教程
- [x] 编辑器
  * [x] 图层面板
  * [x] 组件面板
  * [x] 配置面板
    - [x] 画布属性面板
    - [x] 组件属性面板
    - [x] 组件数据面板
    - [x] 组件交互面板
  * [x] 画布/右键菜单/快捷键
    - [x] 截屏/标尺/参考线/组件拖拽/缩放布局
    - [x] 置顶/置底/上移一层/下移一层/解锁/锁定/显示/隐藏/重命名/复制/删除
    - [x] 撤销/恢复
    - [ ] 框选组件/组合/拆分
  * [x] 其他
    - [x] 滤镜配置
    - [x] 保存/预览/发布

- 基础组件库
- [ ] 柱图
  * [x] 基本柱状图
  * [ ] 弧形柱图
  * [ ] 折线柱图
  * [ ] 水平基本柱状图
- [ ] 折线
  * [x] 基本折线图
  * [ ] 区域图
- [ ] 饼图
  * [ ] 基本饼图
  * [ ] 指标占比图
- [ ] 关系
  * [ ] 树图
- [ ] 地图
  * [ ] 基础平面地图
    - [ ] 动态气泡层
    - [ ] 飞线层
  * [ ] 世界地图
- [x] 文本标题
  * [x] 通用标题
  * [x] 数字翻牌器
  * [x] 跑马灯
  * [x] 多行文本
  * [x] 时间器
  * [x] 词云
- [ ] 列表
  * [ ] 轮播列表
  * [ ] 轮播列表柱状图
- [x] 媒体
  * [x] 单张图片
  * [x] 装饰
  * [x] 边框
  * [x] 自定义背景
- [ ] 控件
  * [x] 全屏切换
  * [ ] Tab列表
  * [ ] 进度条
- [x] 其他
  * [x] 日期选择器
```

## 安装与使用

```bash
# 初始化项目
pnpm run bootstrap

# 跑起来！
pnpm run dev

# 构建发布
pnpm run build

# 本地预览，需要先执行 build
pnpm run serve
```

### 新建可视化组件

```bash
pnpm run new datav
```

### 配置可视化组件

#### 目录结构 (如: main-title):

```bash
main-title
├── index.ts             # 组件入口
└── src
    ├── index.vue        # 组件入口
    ├── main-title.ts    # 组件声明类
    ├── config.vue       # 组件属性配置
    └── config.json      # 用于生成 config.vue 的配置文件
```

#### 使用工具

> 其中 `config.vue` 和 `config.json` 文件，可以在 `development` 模式下，通过访问 `http://localhost:9090/#/dev/props-config` 配置生成。

- 工具预览
![prop-config](./demo/prop-config.png)

- 目前还是个简易版生成工具，使用说明：
```js
// 1. 输入组件路径

// 2. 选择加载模式，有三种模式可选：
// 模式1(.ts): 使用组件同名 .ts 文件生成。
// 模式2(.json): 使用 config.json 文件生成。
// 模式3(.ts&.json): 同时加载组件同名 .ts 文件和 config.json，然后进行策略混合。

// 3. 按需配置好组件属性后，点击 `生成配置代码` 或 `生成模板代码` 按钮。

// 4. 复制生成后的代码到相应文件中即可。如果需要复杂逻辑判断的，需要在代码生成后手动处理。
```

#### 使用组件

- 想要在项目中使用组件还需要进行注册：

```js
// 涉及三个文件：
// 1. 组件注册：src/components/index.ts
// 2. 组件工厂：src/components/datav.ts
// 3. 组件列表：src/data/system-components.ts
```

### 更多新建选项

- 快速创建一个组件

```bash
pnpm run gc [component name]
```

- 通过选项模式

```bash
# 创建组件
pnpm run new component

# 创建 Store
pnpm run new store

# 创建 Icon
pnpm run new icons
```

## 国际化
目前只有 `登录页` 进行了国际化设置，有需要可自行添加。

### 添加多语言

多语言文件位置：`@/locales/lang/*.js`

### 使用

- 在模板中使用：
```html
<template>
  ...
    {{ $t('xxx') }}
  ...
</template>
```

- Componsition API：
```js
import { useI18n } from 'vue-i18n'

...
setup() {
  const { t } = useI18n({ useScope: 'global' })

  t('xxx')

  return { t }
}
...
```

## 许可

DataV Vue 使用 [MIT license](https://opensource.org/licenses/MIT) 许可证书。

## 注意

本项目主要用来研究与学习，如果商用请注意：项目里含有一些第三方付费素材，如：`orbitron-bold` 字体。
