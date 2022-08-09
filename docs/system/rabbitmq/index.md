# RabbitMq
链接信息  

[** 官网 **](https://www.rabbitmq.com/download.html)

安装类似于mavensearch

https://packagecloud.io/rabbitmq/erlang/install#bash-rpm

[[toc]]


#### 总体流程
* 入门
* 核心
  * 工作模式
  *  发布订阅模式
  * 路由模式
  * 主题模式
  * 发布确认模式
 * 高级 
   * 私信对对
   * 延迟队列
   * 发布确认高级
   * 发布确认
   * 回退消息
   * 备份消息
   * 幂等性问题
   * 优先级队列
   * 惰性队列
* 集群部分
  *  搭建集群
  *  镜像队列
  *  haproxy+keepalive 实现集群
  *  federation exchange
  *  federation quenue
  *  shovel
#### RabbitMq 的作用
* 流量削峰
* 应用解耦
   传递给别人消息，不需要每个都发。将功能模块最小化。
* 异步处理  
   A传给B 后，不需要B立即返回，B可能执行很长时间，A不需要等待B的返回，等A处理完了，再将处理结果返回给A

#### MQ 分类  
* activeMq  较少丢失，，官方对维护较少，高吞吐量较少
* kafkaMq  为大数据而生，日志采集等。
* rocketMq 阿里巴巴 ，0丢失
* RabbitMq ErLang语言 

#### 四大核心关键词

* 生产者

* 消费者

* 交换机

* 队列

  基础模式 一个消费者对应一个队列，一个交换机对应多个队列

  ![基础模式](/images/system/rabbitmq/0001.png)

#### 六大模式   


#### RabbitMq 各个名词解释

![原理图](/images/system/rabbitmq/0002.png)

**上图右边是消费者！！！**

**Broker:** 接收和分发消息的应用，``RabbitMQ server`` 就是``Message Broker``

**Virtual host:**  出于多租户和安全因素设计的，把``AMQP``的基本组件划分到一个虚拟的分组中，类似于网络的``namespace``概念。当多个不同的用户使用同一个``RabbitMQ server`` 提供服务时，可以划分出多个``vhost`` ，每个用户在自己的``host``创建交换机、队列等

**Connection:** ``publish/consumer``和``broker``之间的``tcp ``连接。

**Channel：** 如果每一次访问``RabbitMQ ``都建立一个``connection`` ,在消息量大得时候建立``TCP connection``的开销时非常巨大的，效率也低``channel``是在``connection ``内部寄哪里的逻辑链接，如果应用程序支持多线程，通常每个线程穿件单独的``chnnel ``进行通讯，``AMQP method``包含了 ``channel id`` 帮助客户端和``message broker``识别``channel ``，所以``channel``之间是完全隔离的，``channel``作为轻量级的``connection``极大较少了操作系统上建立``TCP connection ``的时间和开销。相当于线程池之类，数据库连接的连接池之类的

**Exchange:** ``message``到达的第一站，根据分发规则，匹配查询表中的 ``routing key ``，分发消息到``queue中``，常用的类型有``direct(point-to point),topic(publish-subscibe) ``和``fanout(multicast)``模式。

#### 安装下载

官网（https://www.rabbitmq.com/download.html）

rabbit mq 版本：3.10.7 

提供多种下载方式，每种下载都需要安装erlang语言环境。

以下根据说明文档进行安装
说明文档
![说明文档](/images/system/rabbitmq/0004.png)
下载rabbitmq
![下载rabbitmq](/images/system/rabbitmq/0003.png) 
下载erlang
![说明文档](/images/system/rabbitmq/0005.png)

需要先下载erlang 再尔安装rabbitmq 

:::tip
笔者在安装的时候，老是报错误，container 无法安装之类的，把``docker ``给卸载之后就可以了
:::


```sh


# centos  安装
# 安装erlang 环境，下载release 并上传到服务器
yum install socat logrotate -y
rpm -ivh   erlang-25.0.3-1.el9.x86_64.rpm

rpm -ivh rabbitmq*.noarch.rpm


chkconfig rabbitmq-server on #开机启动

/sbin/service rabbitmq-server start

/sbin/service rabbitmq-server status

/sbin/service rabbitmq-server stop


# 启动失败 ，查看systemctl 的日志 
journalctl -u rabbitmq-server.service 

rabbitmq 【ERROR: epmd error for host "192":badarg (unknown POSIX error)】

#需要在host文件映射host 和主机名

# 第二种方法
vi /etc/rabbitmq/rabbitmq-env.conf
NODENAME=rabbit@localhost

# 安装插件
 rabbitmq-plugins enable rabbitmq_management

 ip:15672 即可访问web界面


```
#### 权限
```sh
rabbitmqctl add_user root root
rabbitmqctl set_user_tags root administrator

# 用户具有 /vhost这个virtual host 中得所有资源得配置 写 读 权限 
rabbitmqctl set_permissions -p  "/"root".*"".*"".*"
rabbitmqctl set_permissions -p  "/" root  ".*" ".*" ".*"
set_permissions [-p  <vhosts> ] <user> <conf> <write> <read>  

#列出当前用户
rabbitmqctl list_users

guest 缺少权限 

```
* ``/`` 代表 在 ``/`` 的虚拟host 下，在每个虚拟``host``中，交换机和队列都是不同的，有点类似于数据库的不同裤

![创建用户列表](/images/system/rabbitmq/0006.png)




