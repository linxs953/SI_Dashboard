# 🌟 StarInspection Dashboard

> 一个强大的基于云原生的综合性自动化配置平台，提供全方位的测试任务管理、数据管理和系统管理功能。

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)  ![License](https://img.shields.io/badge/license-MIT-green.svg)   ![React](https://img.shields.io/badge/React-18.x-61dafb.svg)  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)

</div>

## 📚 功能特性

### 🎯 1. 任务管理

| 功能 | 描述 |
|------|------|
| 📋 **IDL 管理** | 接口定义语言的版本控制与管理 |
| 📝 **任务管理** | 测试任务的创建、编辑、删除和查询 |
| ▶️ **任务执行** | 支持手动触发和自动调度的任务执行 |
| 📊 **结果查看** | 详细的测试结果展示和分析 |

### 💾 2. 数据管理

| 功能 | 描述 |
|------|------|
| 📘 **API 文档数据** | REST API 接口文档的管理与维护 |
| 🔌 **RPC 接口** | 远程过程调用接口的管理与测试 |
| 🎨 **UI 组件/布局** | 界面组件库和布局模板的管理 |
| 📦 **测试数据** | 测试用例数据的存储与管理 |

### ⚙️ 3. 系统管理

| 功能 | 描述 |
|------|------|
| 🛠️ **系统设置** | 平台配置和参数设置 |
| 📡 **集群监控** | 测试集群的状态监控和资源管理 |
| 📬 **消息通知** | 测试结果通知和系统告警 |

## 🚀 技术栈

- ⚛️ **React 18** - 用户界面构建
- 📘 **TypeScript** - 类型安全
- ⚡ **Vite** - 下一代前端构建工具
- 🔄 **HMR** - 模块热替换
- 📏 **ESLint** - 代码质量控制

## 💻 开发配置

### ESLint 配置

> 💡 如果您正在开发生产应用，我们建议启用类型感知的 lint 规则

#### 基础配置

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

#### 推荐配置步骤

1. 将 `plugin:@typescript-eslint/recommended` 替换为：
   - `plugin:@typescript-eslint/recommended-type-checked` 或
   - `plugin:@typescript-eslint/strict-type-checked`

2. 可选添加 `plugin:@typescript-eslint/stylistic-type-checked`

3. 安装并配置 React ESLint 插件：
   ```bash
   npm install eslint-plugin-react --save-dev
   ```
   将 `plugin:react/recommended` 和 `plugin:react/jsx-runtime` 添加到 `extends` 列表

## 🔌 插件支持

目前支持两个官方插件：

| 插件 | 描述 |
|------|------|
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) | 使用 Babel 实现 Fast Refresh |
| [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) | 使用 SWC 实现 Fast Refresh |

## 📦 项目结构

```
StarInspection/
├── SI_Dashboard/    # 前端界面
├── SI_Core/         # 核心服务
├── SI_Entry/        # 服务入口
├── SI_Registry/     # 服务注册
├── SI_Scheduler/    # 任务调度
└── SI_Storage/      # 数据存储
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8
- Go >= 1.19

### 安装

```bash
# 克隆项目
git clone https://github.com/your-org/star-inspection.git

# 进入项目目录
cd star-inspection/SI_Dashboard

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test
```

## 📝 文档

- [用户指南](./docs/user-guide.md)
- [API 文档](./docs/api.md)
- [开发指南](./docs/development.md)
- [部署文档](./docs/deployment.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 支持与反馈

如果您在使用过程中遇到任何问题或有建议：

- 提交 Issue
- 联系技术支持: support@example.com
- 查看 [常见问题](./docs/faq.md)

---
