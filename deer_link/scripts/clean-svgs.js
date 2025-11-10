#!/usr/bin/env node
/**
 * Clean SVG files to remove features not supported by react-native-svg
 * - CSS variables: var(--name, fallback) → fallback
 * - style tags and attributes
 * - class attributes
 * - unsupported attributes
 */

const fs = require('fs');
const path = require('path');

function cleanSvgXml(xml) {
  let cleaned = xml;

  // 1. Replace CSS variables with fallback values: var(--name, value) → value
  cleaned = cleaned.replace(/var\([^,]+,\s*([^)]+)\)/g, '$1');

  // 2. Remove CSS variables without fallback: var(--name) → #000000
  cleaned = cleaned.replace(/var\([^)]+\)/g, '#000000');

  // 3. Remove <style> tags and their content
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 4. Remove all style attributes (e.g., style="display: block;")
  cleaned = cleaned.replace(/\s+style="[^"]*"/g, '');

  // 5. Remove class attributes (CSS classes don't work in RN)
  cleaned = cleaned.replace(/\s+class="[^"]*"/g, '');

  // 6. Remove preserveAspectRatio="none" (can cause issues)
  cleaned = cleaned.replace(/\s+preserveAspectRatio="none"/g, '');

  // 7. Remove overflow attribute
  cleaned = cleaned.replace(/\s+overflow="[^"]*"/g, '');

  // 8. Remove width="100%" height="100%" (SvgXml doesn't support percentages)
  cleaned = cleaned.replace(/\s+width="100%"/g, '');
  cleaned = cleaned.replace(/\s+height="100%"/g, '');

  // 9. Simplify transform attributes (remove matrix)
  cleaned = cleaned.replace(/transform="([^"]*)"/g, (match, content) => {
    let simplified = content
      .replace(/matrix\([^)]+\)/g, '') // Remove matrix transforms
      .trim();
    return simplified ? `transform="${simplified}"` : '';
  });

  // 10. Remove empty transform attributes
  cleaned = cleaned.replace(/\s+transform=""\s*/g, ' ');

  return cleaned;
}

function cleanSvgFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleaned = cleanSvgXml(content);

    if (content !== cleaned) {
      fs.writeFileSync(filePath, cleaned, 'utf8');
      console.log(`✅ Cleaned: ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`⏭️  Skipped: ${path.basename(filePath)} (no changes needed)`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Get SVG directory from command line or use default
const svgDir = process.argv[2] || path.join(__dirname, '../assets/svgs');

console.log(`\n🧹 Cleaning SVG files in: ${svgDir}\n`);

// Read all SVG files
const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

let cleanedCount = 0;
let skippedCount = 0;

files.forEach(file => {
  const filePath = path.join(svgDir, file);
  const wasCleaned = cleanSvgFile(filePath);
  if (wasCleaned) {
    cleanedCount++;
  } else {
    skippedCount++;
  }
});

console.log(`\n✨ Done! Cleaned ${cleanedCount} files, skipped ${skippedCount} files.\n`);
