const child_process = require('child_process');
const path = require('path');

child_process.execSync('tailwindcss -i ' + path.posix.resolve('src/css/input.css') + ' -o ' + path.posix.resolve('dist/output.css'));