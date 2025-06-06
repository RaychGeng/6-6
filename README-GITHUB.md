# 火花课堂 - GitHub上传指南

由于GitHub对单个仓库文件数量的限制（最多99个文件），我们需要按照以下步骤来准备项目上传：

## 准备上传前的操作

1. 安装依赖：

```bash
npm install
```

2. 压缩和清理项目：

```bash
npm run prepare-github
```

这个命令会完成以下工作：
- 压缩图片文件到images-compressed目录
- 删除备份文件(*.backup-20240401)
- 删除测试文件(test.html)
- 删除重复脚本文件(script_1.js)

3. 更新.gitignore文件：

确保.gitignore文件中包含以下内容，排除不必要的文件：
```
node_modules/
.env
*.backup-*
test.html
script_1.js
.idea/
.vscode/
backend/
```

4. 使用压缩后的图片：

上传到GitHub时，请使用`images-compressed`目录中的压缩图片替换`images`目录中的原始图片。

## 上传到GitHub

1. 初始化Git仓库（如果尚未初始化）：

```bash
git init
```

2. 添加文件：

```bash
git add .
```

3. 提交更改：

```bash
git commit -m "初始提交火花课堂项目"
```

4. 添加远程仓库（替换URL为你的GitHub仓库地址）：

```bash
git remote add origin https://github.com/用户名/仓库名.git
```

5. 推送到GitHub：

```bash
git push -u origin main
```

## 部署到Render

按照原README.md中的部署说明部署到Render平台。

## 常见问题

1. 如果遇到文件数量仍然超过限制，可以考虑：
   - 将CSS和JavaScript文件合并
   - 进一步压缩图片质量
   - 删除不常用的页面

2. 图片压缩后质量下降的问题：
   - 可以调整compress-images.js中的质量参数

3. Windows系统下无法运行rm命令：
   - 可以手动删除文件，或使用Windows兼容的命令替换 