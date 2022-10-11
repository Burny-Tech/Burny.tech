# Linux命令相关



## [限制用户使用命令](./sh/xianzhi.md)

##  [httpd-toos ab测试](./sh/httpd-tools.md)

## [Centos定时任务](./sh/crontabs.md)

## [jps命令无效](./sh/jps.md)

## [基础命令开机启动以及开机挂载上已经分区的磁盘](./sh/selfStart.md)

systemctl启动失败查看

```shell
 journalctl -u rabbitmq-server

```

## 防火墙

```shell
firewall-cmd  --zone=public --permanent --add-port=21110/tcp
firewall-cmd  --zone=public --permanent --add-port=6379/tcp
firewall-cmd --reload
firewall-cmd  --zone=public --permanent --add-port=3658/tcp
firewall-cmd  --zone=public --permanent --add-port=80/tcp
firewall-cmd --reload

```



```sh


\r‘: command not found 解决办法

当我们执行 shell 脚本的时候提示’\r’: command not found，但是检查了很多次并没有发现什么问题。
原因是 windows 下的换行符是\r\n，而 Linux 下的换行符是\n，所以只要执行下面的命令把\r 去掉就可以了。
解决方法：

#转化为unix格式
sed -i 's/\r$//' <filename> 
```

