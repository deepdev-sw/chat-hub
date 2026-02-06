# ChatHub 🤖

ChatHub 是一个基于 **Electron** 和 **Vue 3** 构建的桌面端 AI 聊天聚合应用。它将 DeepSeek、Qwen（通义千问）等主流 AI 模型的网页版界面集成到一个统一的桌面客户端中，提供便捷的切换和使用体验。

> ⚠️ **注意**：本项目是一个 Webview 包装器，不直接调用 API。您需要直接在加载的网页中登录您的账号即可使用。

## ✨ 功能特性

- **多模型聚合**：内置 DeepSeek、Qwen 等多种 AI 模型适配器。
- **无需 API Key**：直接加载官方网页版，登录账号即可使用，无需配置复杂的 API Key。
- **桌面级体验**：
  - 独立的应用程序窗口，不再淹没在浏览器标签页中。
  - 针对桌面端优化的样式注入（CSS），提供更清爽的界面。
- **自动脚本注入**：通过脚本自动处理输入框聚焦、消息发送等交互，体验更流畅。

## 🛠️ 技术栈

- **Core**: [Electron](https://www.electronjs.org/)
- **Frontend**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) + [Electron Builder](https://www.electron.build/)

## 🚀 快速开始

### 环境要求

- Node.js (推荐 v18 或更高版本)
- npm 或 pnpm

### 安装依赖

```bash
npm install
# 或者
pnpm install
```

### 开发模式启动

启动开发服务器，支持热重载：

```bash
npm run dev
```

### 打包构建

构建生产环境的应用程序（支持 macOS, Windows, Linux）：

```bash
npm run build
```

构建产物将位于 `release/` 目录下。

## 📁 项目结构

```
chat-hub/
├── electron/        # Electron 主进程代码
│   ├── adapters/    # 各个 AI 模型的适配器 (DeepSeek, Qwen 等)
│   ├── services/    # 核心服务 (如 BrowserManager)
│   └── main.ts      # Electron 入口文件
├── src/             # Vue 渲染进程代码
│   ├── components/  # Vue 组件
│   └── App.vue      # 主应用视图
├── release/         # 打包输出目录 (git ignored)
└── package.json     # 项目配置与脚本
```

## 🤝 贡献指南

欢迎提交 Pull Request 来添加更多的 AI 模型适配器！只需在 `electron/adapters/` 下添加新的适配器类并在 `electron/services/browser-manager.ts` 中注册即可。

## 📄 许可证

[MIT](LICENSE)
