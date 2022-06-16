const fse = require('fs-extra');
const path = require('path');

fse.copySync(__dirname + path.posix.resolve('/assets/'), __dirname + path.posix.resolve('/dist/'));
