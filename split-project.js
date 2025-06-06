const fs = require('fs');
const path = require('path');

// 创建目录（如果不存在）
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 复制文件
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`复制: ${src} -> ${dest}`);
  } catch (err) {
    console.error(`复制文件失败 ${src}: ${err.message}`);
  }
}

// 定义每个部分包含的文件
const fileSets = {
  part1: [
    // 核心HTML文件
    'index.html',
    'about.html',
    'founder.html',
    'contact.html',
    'help.html',
    // 核心CSS和JS文件
    'styles.css',
    'script.js',
    'login.js',
    // 服务器和配置文件
    'server.js',
    'package.json',
    'package-lock.json',
    '.gitignore',
    'README.md',
    'README-GITHUB.md',
    'compress-images.js',
    'cleanup.js',
    'split-project.js',
    'check-files.js',
    // 添加次要HTML文件的副本到part1，以确保完整性
    'courses.html',
    'ai-teachers.html',
    'teacher-resources.html'
  ],
  part2: [
    // 次要HTML文件
    'courses.html',
    'ai-teachers.html',
    'teacher-resources.html'
    // 所有图片文件均放在part2/images目录下
  ],
  part3: [
    // 备份文件和测试文件
    'test.html',
    'script_1.js',
    'help.html.backup-20240401',
    'script.js.backup-20240401',
    'styles.css.backup-20240401',
    'about.html.backup-20240401',
    'founder.html.backup-20240401',
    'index.html.backup-20240401',
    'contact.html.backup-20240401'
  ]
};

// 创建一个README文件，解释如何组合这些部分
const readmeContent = `# 火花课堂项目 - 分割说明

本项目由于文件数量较多，已被分割为三个部分，以便于GitHub上传。

## 如何组合这些部分

1. 克隆或下载part1, part2和part3三个仓库
2. 将三个部分的内容合并到同一目录中
3. 安装依赖: \`npm install\`
4. 启动服务器: \`npm start\`

## 部分说明

- **part1**: 包含核心HTML、CSS、JS文件和项目配置
- **part2**: 包含次要HTML文件和所有图片资源
- **part3**: 包含备份文件和测试文件（可选）

## 各部分对应的GitHub仓库

- Part1: [https://github.com/用户名/火花课堂-part1](https://github.com/用户名/火花课堂-part1)
- Part2: [https://github.com/用户名/火花课堂-part2](https://github.com/用户名/火花课堂-part2)
- Part3: [https://github.com/用户名/火花课堂-part3](https://github.com/用户名/火花课堂-part3)

## 部署到Render

请参考part1中的README.md文件了解如何部署到Render平台。
`;

// 创建README文件
function createReadme(partPath, content) {
  fs.writeFileSync(path.join(partPath, 'SPLIT-README.md'), content);
  console.log(`创建: ${partPath}/SPLIT-README.md`);
}

// 执行分割
async function splitProject() {
  const rootDir = __dirname;
  
  // 确保目标目录存在
  ensureDir(path.join(rootDir, 'part1'));
  ensureDir(path.join(rootDir, 'part2'));
  ensureDir(path.join(rootDir, 'part3'));
  ensureDir(path.join(rootDir, 'part1/images'));
  ensureDir(path.join(rootDir, 'part2/images'));
  
  // 复制Part1文件
  console.log('\n=== 复制Part1文件 ===');
  for (const file of fileSets.part1) {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(rootDir, 'part1', file);
    
    if (fs.existsSync(srcPath)) {
      copyFile(srcPath, destPath);
    } else {
      console.log(`警告: 文件不存在 ${srcPath}`);
    }
  }
  
  // 复制Part2文件
  console.log('\n=== 复制Part2文件 ===');
  for (const file of fileSets.part2) {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(rootDir, 'part2', file);
    
    if (fs.existsSync(srcPath)) {
      copyFile(srcPath, destPath);
    } else {
      console.log(`警告: 文件不存在 ${srcPath}`);
    }
  }
  
  // 复制图片文件到part1和part2
  console.log('\n=== 复制图片文件 ===');
  const imagesDir = path.join(rootDir, 'images');
  if (fs.existsSync(imagesDir)) {
    // 获取所有图片文件
    const imageFiles = fs.readdirSync(imagesDir);
    console.log(`找到${imageFiles.length}个图片文件`);
    
    // 计算分割点
    const splitIndex = Math.ceil(imageFiles.length * 0.3);
    console.log(`将前${splitIndex}个图片放入part1，其余放入part2`);
    
    // 复制前30%的图片到part1
    for (let i = 0; i < splitIndex; i++) {
      const file = imageFiles[i];
      const srcPath = path.join(imagesDir, file);
      const destPath = path.join(rootDir, 'part1/images', file);
      
      if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
        copyFile(srcPath, destPath);
      }
    }
    
    // 复制剩余图片到part2
    for (let i = splitIndex; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const srcPath = path.join(imagesDir, file);
      const destPath = path.join(rootDir, 'part2/images', file);
      
      if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
        copyFile(srcPath, destPath);
      }
    }
  } else {
    console.log('警告: images目录不存在');
  }
  
  // 复制Part3文件
  console.log('\n=== 复制Part3文件 ===');
  for (const file of fileSets.part3) {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(rootDir, 'part3', file);
    
    if (fs.existsSync(srcPath)) {
      copyFile(srcPath, destPath);
    } else {
      console.log(`警告: 文件不存在 ${srcPath}`);
    }
  }
  
  // 为每个部分创建README
  createReadme(path.join(rootDir, 'part1'), readmeContent);
  createReadme(path.join(rootDir, 'part2'), readmeContent);
  createReadme(path.join(rootDir, 'part3'), readmeContent);
  
  // 创建part1中的.gitignore
  const gitignoreContent = `
# 忽略node_modules
node_modules/
# 忽略环境变量
.env
`;
  fs.writeFileSync(path.join(rootDir, 'part1', '.gitignore'), gitignoreContent);
  fs.writeFileSync(path.join(rootDir, 'part2', '.gitignore'), gitignoreContent);
  
  console.log('\n分割完成！');
  console.log('现在你可以分别上传part1、part2和part3到GitHub了');
  console.log('每个部分的文件数量应该都少于100个');
}

splitProject(); 