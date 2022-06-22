const client = require('ssh2-sftp-client');
const path = require('path');

const sftp = new client();
const host = process.argv[2];
const port = process.argv[3];
const username = process.argv[4];
const password = process.argv[5];

const srcDir = path.posix.resolve('dist/');
const targetDir = '/dev.kylebignell.co.uk/';

sftp.connect({
  host,
  port,
  username,
  password
}).then(() => {
  return sftp.uploadDir(srcDir, targetDir);
}).then(data => {
  console.log(data);
  sftp.end();
}).catch(err => {
  console.log(err);
  sftp.end();
});

