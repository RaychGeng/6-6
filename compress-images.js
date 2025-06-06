const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 需要先安装sharp: npm install sharp

async function compressImages() {
  const imageDir = path.join(__dirname, 'images');
  const compressedDir = path.join(__dirname, 'images-compressed');
  
  // 确保输出目录存在
  if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir);
  }
  
  try {
    const files = fs.readdirSync(imageDir);
    
    for (const file of files) {
      const filePath = path.join(imageDir, file);
      const stat = fs.statSync(filePath);
      
      // 跳过文件夹
      if (!stat.isFile()) continue;
      
      const ext = path.extname(file).toLowerCase();
      const outPath = path.join(compressedDir, file);
      
      // 处理不同类型的图片
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        console.log(`压缩图片: ${file}`);
        
        const image = sharp(filePath);
        const metadata = await image.metadata();
        
        // 根据图片大小决定压缩比例
        let resizeOptions = {};
        if (metadata.width > 1000) {
          resizeOptions.width = 1000;
        }
        
        // JPEG和PNG使用不同的压缩设置
        if (ext === '.jpg' || ext === '.jpeg') {
          await image
            .resize(resizeOptions)
            .jpeg({ quality: 70 })
            .toFile(outPath);
        } else if (ext === '.png') {
          await image
            .resize(resizeOptions)
            .png({ compressionLevel: 8 })
            .toFile(outPath);
        } else if (ext === '.webp') {
          await image
            .resize(resizeOptions)
            .webp({ quality: 70 })
            .toFile(outPath);
        }
      } else {
        // 复制其他类型的文件
        fs.copyFileSync(filePath, outPath);
      }
    }
    
    console.log('所有图片压缩完成！');
  } catch (err) {
    console.error('压缩过程中出错:', err);
  }
}

compressImages(); 