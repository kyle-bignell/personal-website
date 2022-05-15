const fse = require('fs-extra');

fse.copySync(__dirname + '\\..\\assets\\', __dirname + '\\..\\dist\\');
