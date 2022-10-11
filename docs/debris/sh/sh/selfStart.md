# 自启动 以及挂载磁盘



## Docker

```sh

systemctl enable docker
systemctl start docker

# 多个参数值选择
no	不自动重启容器. (默认值)
on-failure 	容器发生error而退出(容器退出状态不为0)重启容器,可以指定重启的最大次数，如：on-failure:10
unless-stopped 	在容器已经stop掉或Docker stoped/restarted的时候才重启容器
always 	在容器已经stop掉或Docker stoped/restarted的时候才重启容器，手动stop的不算

# 设置启动策略,容器未创建
docker run --restart always --name mynginx -d nginx

#如果容器已经被创建，
docker update --restart no mynginx
```



## 普通命令

```sh

vi /etc/rc.local
# 添加要启动的命令，注意全路径  不需要加sh 开头等
# 最后需要加上 &   代表后台启动

chmod -R 777 /etc/rc.local

```



```java
知道这个后，就容易了。直接挂载命令：mount  /dev/vdb1 /wwwroot。结果成功

接下来，要去设置重启自动挂载 vi /etc/fstab

1、首先查看逻辑分区uuid   blkid /dev/vdb1

2、去编辑fstab，照自动挂载的格式写上。（这里推荐用uuid，因为重启后逻辑分区号有改变的风险）

UUID=f221211d-a26c-4852-aece-5207177f97e7 /wwwroot  ext4 defaults 0 0
3、保存退出。

4、验证。执行mount -a 重加载配置文件，mount | grep /wwwroot。有回显，即配置成功。

另外，重新挂载不会影响数据。只要你不格式化，数据依然在。

```

