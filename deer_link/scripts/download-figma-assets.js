#!/usr/bin/env node

/**
 * 批量下载 Figma SVG 资源到本地
 * 使用方法: node scripts/download-figma-assets.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 从组件文件中提取所有 FIGMA_IMAGES
const srcDir = path.join(__dirname, '../src');
const assetsDir = path.join(__dirname, '../src/assets/figma-icons');

// 确保目录存在
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 递归查找所有 .tsx 文件
function findTsxFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findTsxFiles(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });

  return results;
}

// 从文件内容中提取 FIGMA_IMAGES 对象
function extractFigmaImages(content) {
  const regex = /const\s+FIGMA_IMAGES\s*=\s*\{([^}]+)\}/gs;
  const matches = content.match(regex);

  if (!matches) return {};

  const images = {};
  matches.forEach(match => {
    // 提取键值对
    const keyValueRegex = /(\w+):\s*['"]([^'"]+)['"]/g;
    let kvMatch;
    while ((kvMatch = keyValueRegex.exec(match)) !== null) {
      const [, key, url] = kvMatch;
      if (url.endsWith('.svg')) {
        images[key] = url;
      }
    }
  });

  return images;
}

// 下载文件
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

// 主函数
async function main() {
  console.log('🔍 Scanning for FIGMA_IMAGES...\n');

  const tsxFiles = findTsxFiles(srcDir);
  const allImages = {};

  // 收集所有图片URL
  tsxFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const images = extractFigmaImages(content);
    Object.assign(allImages, images);
  });

  const svgImages = Object.entries(allImages).filter(([, url]) => url.endsWith('.svg'));

  console.log(`✅ Found ${svgImages.length} SVG images\n`);

  // 下载每个SVG
  let downloaded = 0;
  let failed = 0;

  for (const [key, url] of svgImages) {
    const fileName = `${key}.svg`;
    const outputPath = path.join(assetsDir, fileName);

    try {
      console.log(`📥 Downloading ${key}...`);
      await downloadFile(url, outputPath);
      downloaded++;
      console.log(`   ✅ Saved to ${fileName}`);
    } catch (error) {
      failed++;
      console.error(`   ❌ Failed: ${error.message}`);
    }
  }

  console.log(`\n🎉 Complete! ${downloaded} downloaded, ${failed} failed`);
  console.log(`📁 SVG files saved to: ${assetsDir}`);
}

main().catch(console.error);
