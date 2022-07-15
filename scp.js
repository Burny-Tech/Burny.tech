const scpClient = require('scp2')
const ora = require('ora')
const loading = ora('正在部署中');
const Client = require('ssh2').Client;
const service = {
  host: '8.129.19.51', // 服务器的地址
  port: 22, // 服务器端口， 一般为 22
  username: 'root', // 用户名
  password: 'CYXcentos8520.', //密码
  path: '/home/burny/' //服务器存放文件路径
}

  var conn = new Client();
  conn.on('ready', function() {
    // 删除上个版本的文件
    conn.exec('rm -rf /home/burny/', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        loading.start();
        scpClient.scp(
          './docs/.vuepress/dist', service,
          function(err) {
            loading.stop();
            if (err) {
              console.log('发布失败!');
              throw err;
            } else {
              console.log('成功发布!');
            }
          }
        );
        conn.end();
      }).on('data', function(data) {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', function(data) {
        console.log('STDERR: ' + data);
      });
    });
  }).connect(service);
