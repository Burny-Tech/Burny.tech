# Linux命令相关



## [限制用户使用命令](./sh/xianzhi.md)

##  [httpd-toos ab测试](./sh/httpd-tools.md)

systemctl启动失败查看

```shell
 journalctl -u rabbitmq-server

```

## 防火墙

```shell
firewall-cmd  --zone=public --permanent --add-port=21110/tcp
firewall-cmd  --zone=public --permanent --add-port=6379/tcp
firewall-cmd --reload
firewall-cmd  --zone=public --permanent --add-port=16379/tcp
firewall-cmd  --zone=public --permanent --add-port=9966/tcp
firewall-cmd --reload

```

