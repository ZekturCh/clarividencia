const { copyFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const indexPath = join(__dirname, '..', 'dist', 'index.html');
const notFoundPath = join(__dirname, '..', 'dist', '404.html');

if (existsSync(indexPath)) {
  copyFileSync(indexPath, notFoundPath);
}
