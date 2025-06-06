const fs = require('fs');
const path = require('path');

async function cleanup() {
  const root = __dirname;
  let deletedCount = 0;
  
  // 查找所有备份文件
  const files = fs.readdirSync(root);
  for (const file of files) {
    if (file.includes('.backup-') || file === 'test.html' || file === 'script_1.js') {
      try {
        const filePath = path.join(root, file);
        fs.unlinkSync(filePath);
        console.log(`已删除文件: ${file}`);
        deletedCount++;
      } catch (err) {
        console.error(`删除文件 ${file} 失败:`, err);
      }
    }
  }
  
  console.log(`清理完成，共删除 ${deletedCount} 个文件`);
}

cleanup(); 