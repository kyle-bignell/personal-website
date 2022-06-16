const ejs = require('ejs');
const fse = require('fs-extra');
const path = require('path');

ejs.renderFile(__dirname + path.posix.resolve('/src/index.html')).then(data => {
    fse.outputFileSync(__dirname + path.posix.resolve('/dist/index.html'), data);
});