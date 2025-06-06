# 火花课堂 - 智慧动漫教育平台

一个专为小学至高中生设计的智慧自动化课堂，提供AI驱动的个性化学习体验。

## 核心功能

- **登录注册系统**：支持手机号、邮箱注册登录，可关联第三方账号
- **个性化学习**：根据学生年级和学科提供定制化学习内容
- **多种学习模式**：系统学习、自主学习和智能复习提醒
- **游戏化学习**：通过益智游戏强化知识，提高学习兴趣
- **社区互动**：学生、家长、教师交流平台
- **公益激励**：学习积分可用于种树等公益项目

## 技术栈

### 前端
- HTML, CSS, JavaScript
- 响应式设计
- 外部库：Font Awesome, Google Fonts, Swiper, AOS

### 后端
- Node.js, Express (API服务)
- Spring Boot (Java后端服务)
- MySQL数据库
- JWT认证

## 本地开发

### 前端开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问网站
# http://localhost:3000
```

### 后端开发 (Java)

```bash
# 进入后端目录
cd backend

# 使用Maven编译
mvn clean install

# 运行Spring Boot应用
mvn spring-boot:run
```

## 部署

### 前端部署 (Render)

1. 在 [Render Dashboard](https://dashboard.render.com/) 创建一个新的Web Service
2. 连接到您的Git仓库
3. 选择主分支
4. 指定以下设置:
   - 环境: `Node`
   - 构建命令: `npm install`
   - 启动命令: `npm start`
5. 点击"Create Web Service"

### 后端部署

后端服务可部署到支持Java/Spring Boot的云平台，如Heroku、AWS或Azure。

## 项目结构

- `/` - 前端页面和资源
  - `index.html` - 主页面
  - `about.html`, `founder.html`, etc. - 其他页面
  - `styles.css` - 全局样式
  - `script.js` - 主要JavaScript逻辑
  - `login.js` - 登录/注册相关功能
  - `games-module.js` - 游戏模块功能
  - `study-module.js` - 学习模块功能
  - `flame-assistant.js` - AI助手功能
- `/backend` - Java后端服务
  - `src/` - 源代码
  - `pom.xml` - Maven配置
- `/images` - 图片资源

## 实用脚本

```bash
# 压缩图片
npm run compress-images

# 清理项目
npm run cleanup

# 准备GitHub版本
npm run prepare-github
```

## 许可证

ISC