# 小红书爆款内容工厂

基于 FastAPI + React 的小红书内容生成 Web 应用。

## 功能特性

- 🎯 智能关键词内容生成
- 🤖 支持 LLM 增强生成
- 📊 多平台 API 支持（OpenAI/百度）
- 💾 内容导出功能
- 🎨 现代化 UI 设计

## 技术栈

### 后端
- **FastAPI** - 高性能 Python Web 框架
- **Pydantic** - 数据验证
- **动态内容生成引擎**

### 前端
- **React 18** - UI 框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Axios** - HTTP 客户端

## 快速开始

### 后端启动
```bash
cd backend
pip install -r requirements.txt
bash start.sh
```

### 前端启动
```bash
npm install
npm run dev
```

## 项目结构

```
webapp/
├── backend/          # 后端服务
│   ├── app/
│   │   ├── api/      # API 路由
│   │   └── services/ # 服务层
│   └── requirements.txt
├── public/           # 静态资源
├── src/              # 前端源码
│   ├── assets/       # 资源文件
│   └── components/   # React 组件
└── config files      # 配置文件
```

## 部署

支持 Netlify 一键部署，配置详见 `netlify.toml`。

## License

MIT
