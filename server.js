const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 提供静态文件服务
app.use(express.static(__dirname));

// 路由处理
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 其他路由处理
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/founder', (req, res) => {
  res.sendFile(path.join(__dirname, 'founder.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, 'help.html'));
});

app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, 'courses.html'));
});

app.get('/ai-teachers', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-teachers.html'));
});

app.get('/teacher-resources', (req, res) => {
  res.sendFile(path.join(__dirname, 'teacher-resources.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 