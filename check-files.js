const fs = require('fs');
const path = require('path');

function countFiles(directory) {
  let count = 0;
  let fileList = [];

  function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git') {
          traverseDir(fullPath);
        }
      } else {
        count++;
        fileList.push(fullPath.replace(directory, ''));
      }
    }
  }
  
  traverseDir(directory);
  return { count, fileList };
}

// 检查各个部分
function checkParts() {
  const rootDir = __dirname;
  
  // 检查part1
  const part1Dir = path.join(rootDir, 'part1');
  const part1Files = countFiles(part1Dir);
  console.log(`\nPart1文件数: ${part1Files.count}`);
  console.log('Part1文件列表:');
  part1Files.fileList.forEach(file => console.log(` - ${file}`));
  
  // 检查part2
  const part2Dir = path.join(rootDir, 'part2');
  const part2Files = countFiles(part2Dir);
  console.log(`\nPart2文件数: ${part2Files.count}`);
  console.log('Part2文件列表:');
  part2Files.fileList.forEach(file => console.log(` - ${file}`));
  
  // 检查part3
  const part3Dir = path.join(rootDir, 'part3');
  const part3Files = countFiles(part3Dir);
  console.log(`\nPart3文件数: ${part3Files.count}`);
  console.log('Part3文件列表:');
  part3Files.fileList.forEach(file => console.log(` - ${file}`));
  
  // 检查总文件数
  console.log(`\n总文件数: ${part1Files.count + part2Files.count + part3Files.count}`);
  
  // 检查是否所有部分都小于100个文件
  const allUnder100 = part1Files.count < 100 && part2Files.count < 100 && part3Files.count < 100;
  console.log(`\n所有部分都小于100个文件: ${allUnder100 ? '是' : '否'}`);
  
  if (!allUnder100) {
    console.log('警告: 有部分文件数量仍然超过100个，可能需要进一步分割。');
  }
}

checkParts(); 