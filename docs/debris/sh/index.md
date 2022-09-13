# Linux命令相关



## [限制用户使用命令](./sh/xianzhi.md)

## systemctl启动失败查看

```shell
 journalctl -u rabbitmq-server

```

## 防火墙

```shell
firewall-cmd  --zone=public --permanent --add-port=21110/tcp
firewall-cmd --reload

```

