const ejs = require('ejs');
const fse = require('fs-extra');

ejs.renderFile(__dirname + "\\..\\src\\index.html").then(data => {
    fse.outputFileSync(__dirname + "\\..\\dist\\index.html", data);
});