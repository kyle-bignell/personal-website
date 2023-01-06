const client = require('ssh2-sftp-client');
const path = require('path');

const sftp = new client();
const host = process.env.FTP_SERVER;
const port = process.env.FTP_PORT;
const username = process.env.FTP_USERNAME;
const password = process.env.FTP_PASSWORD;

const srcDir = path.posix.resolve('./dist/');
const targetDir = process.argv[2];

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

