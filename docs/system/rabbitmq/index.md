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

**Broker:** 接收和分发消息的应用，RabbitMQ server 就是Message Broker

**Virtual host:**  出于多租户和安全因素设计的，把AMQP的基本组件划分到一个虚拟的分组中，类似于网络的namespace概念。当多个不同的用户使用同一个RabbitMQ server 提供服务时，可以划分出多个vhost ，每个用户在自己的host创建交换机、队列等

**Connection:** publish/consumer和broker之间的tcp 连接。

**Channel：** 如果每一次访问RabbitMQ 都建立一个connection ,在消息量大得时候建立TCP connection的开销时非常巨大的，效率也低channel是在connection 内部寄哪里的逻辑链接，如果应用程序支持多线程，通常每个线程穿件单独的chnnel 进行通讯，AMQP method包含了channel id 帮助客户端和message broker识别channel ，所以channel之间是完全隔离的，channel作为轻量级的connection极大较少了操作系统上建立TCP connection 的时间和开销。相当于线程池之类，数据库连接的连接池之类的

**Exchange:** message到达的第一站，根据分发规则，匹配查询表中的 routing key ，分发消息到queue中，常用的类型有direct(point-to point),topic(publish-subscibe) 和fanout(multicast)模式。

#### 安装下载

官网（https://www.rabbitmq.com/download.html）

rabbit mq 版本：3.10.7 

提供多种下载方式，每种下载都需要安装erlang语言环境。



```sh
# docker 环境安装

docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.10-management

# centos  安装
# 安装erlang 环境
https://github.com/rabbitmq/erlang-rpm/releases

rpm -ivh   erlang-25.0.3-1.el9.x86_64.rpm
yum install socat -y
rpm -ivh rabbitmq*.noarch.rpm

yum install rabbitmq-server-3.10.7-1.el8.noarch.rpm

```





