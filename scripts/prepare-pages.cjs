const { copyFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const demoIndex = join(__dirname, '..', 'demo', 'index.html');

if (existsSync(demoIndex)) {
  copyFileSync(demoIndex, join(__dirname, '..', 'demo', '404.html'));
  copyFileSync(demoIndex, join(__dirname, '..', '404.html'));
}
