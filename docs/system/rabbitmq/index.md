# RabbitMq
链接信息  

[官网 ](https://www.rabbitmq.com/download.html)

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


#### 项目实战

客户端官网

``https://www.rabbitmq.com/java-client.html``





# 几种模式

## 简单模式

直接生产者  -> 消费者

生产者代码

```java
package com.burny.rabbitmq.one;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import lombok.extern.slf4j.Slf4j;


@Slf4j
public class Producer {

    public static final String ip = "192.168.1.176";
    public static final String port = "192.168.1.176";
    public static final String username = "root";
    public static final String password = "root";
    //队列名称
    public static final String queue_name = "hello";

    public static final String content = "hello world";

    public static void main(String[] args) throws Exception {
        //创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(ip);
        factory.setUsername(username);
        factory.setPassword(password);

        //创建连接
        Connection connection = factory.newConnection();

        //获取信道
        Channel channel = connection.createChannel();

        //实现信道绑定队列
        /**
         * String queue, boolean durable, boolean exclusive, boolean autoDelete,
         *                                  Map<String, Object> arguments
         *队列名称
         * 是否持久化, 默认不持久化,指的是队列持久化:
         * 该队列是否只供一个消费者消费，即排他，是否进行消息共享,一个消息只能被一个消费者消费
         * 是否自动删除
         * 最后一个消费者端开链接猴,该队列是否自动删除
         *
         */
        channel.queueDeclare(queue_name, true, false, false, null);


        //发送消息体
        /**
         *发送到哪个交换机,""为默认交换机
         * 路由的key值是哪个,本次是队列的名称
         * 其他参数
         * 发送消息的消息体
         */
        channel.basicPublish("", queue_name, null, content.getBytes());

        //在web界面找到 QUEUE 中的hello队列: ready :正在准备被消费者消费,总共有一个消息,
        //重启发现队列还在,但是消息不见了.即持久化队列，但是没有持久化消息


    }

}
```

消费者

```java
package com.burny.rabbitmq.one;

import com.rabbitmq.client.*;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/18 0:13
 */

public class Consumer {

    public static final String ip = "192.168.1.176";
    public static final String port = "192.168.1.176";
    public static final String username = "root";
    public static final String password = "root";
    //队列名称
    public static final String queue_name = "hello";

    public static final String content = "hello world";

    public static void main(String[] args) throws Exception {

        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(ip);
        factory.setUsername(username);
        factory.setPassword(password);

        //创建连接
        Connection connection = factory.newConnection();

        //获取信道
        Channel channel = connection.createChannel();

        //声明:
        DeliverCallback deliverCallback = (consumerTag, message) -> {
            System.out.println("成功接收消息");
            System.out.println(message.getBody());
        };
        CancelCallback cancelCallback = (consumerTag) -> {
            System.out.println("消费被中断");
        };
        //基础消费
        /**
         *绑定队列名称
         * 自动应答
         * 消费失败的回调
         * 消费成功的回调
         */
        channel.basicConsume(queue_name, true, deliverCallback, cancelCallback);

    }
}

```

## 工作队列模式(Work Queues)

> 工作队列 又称 任务队列.主要思想是避免立即整形资源密集型的任务,而不得不等待它完成.相反我们安排任务在之后执行.我们把任务封装为消息并将其发送到队列.在后台运行的工作进程将弹出任务并最终执行作业.当有多个工作线程时,这些工作线程将一起处理这些任务



### 轮询分发模式

[代码]()



![](/images/system/rabbitmq/5857.png)

工作线程==消费者

要点:`idea` 如何多例并行

![](/images/system/rabbitmq/3956.png)

```java
package com.burny.rabbitmq.common;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import jdk.internal.org.objectweb.asm.tree.FieldInsnNode;
import lombok.SneakyThrows;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/18 22:55
 */

public class Info {
    public static final String ip = "192.168.1.176";
    public static final String username = "root";
    public static final String password = "root";

    public static  final String queue_name="hello";

    public static final  String pre="接收到消息: ";

    public static  final String callback="消费者取消消费的回调";

    @SneakyThrows
    public static Channel getC() {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(ip);
        factory.setUsername(username);
        factory.setPassword(password);
        //创建连接
        Connection connection = factory.newConnection();
        //获取信道
        Channel channel = connection.createChannel();
        return channel;
    }


}

package com.burny.rabbitmq.two_work_queues;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.CancelCallback;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import java.util.Random;
import java.util.UUID;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/18 23:05
 */

@Slf4j
public class Worker01 {


    @SneakyThrows
    public static void main(String[] args) {
        log.info(UUID.randomUUID().toString());
        Channel channel = Info.getC();
        DeliverCallback deliverCallback=(consumerTag,message)->{
            log.info(Info.pre+new String(message.getBody()));
        };
        CancelCallback callback=(consumerTag)->{
            log.info(Info.callback);
        };
        channel.basicConsume(Info.queue_name,true,deliverCallback,callback);
    }
}

package com.burny.rabbitmq.two_work_queues;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import lombok.extern.slf4j.Slf4j;

import java.util.Scanner;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/17 23:46
 */

@Slf4j
public class Producer {

    //队列名称
    public static final String queue_name = "hello";

    public static final String content = "hello world";

    public static void main(String[] args) throws Exception {
        Channel channel = Info.getC();
        //exclusive:消息是否被共享,独占
        channel.queueDeclare(queue_name, true, false, false, null);
        Scanner scanner=new Scanner(System.in);
        while (scanner.hasNext()){
            String next = scanner.next();
            for (int i = 0; i < 100; i++) {
                channel.basicPublish("", queue_name, null, (next+i).getBytes());
            }
        }

    }

}

```



经验证:为轮询的工作队列



![轮询工作队列](/images/system/rabbitmq/4344.png)



### 消息应答

概念:

> 只要消费者不应答,队列中消息不会被删除.

####  自动应答

`接收到消息即自动应答,并不代表消息已经完成消费`

这种模式在高吞吐量和数据传输安全性房间做权衡.

这种模式适合仅仅适用于在消费者可以高效并以某种速率能够处理这些消息

可以允许少部分消息丢失

#### 手动应答

> s手动应答的方式可以减少网络拥堵

##### 消息应答的方法

```java
channel.basicAck(long deliveryTag, boolean multiple); //用户肯定确认 rabbitmq 已知道该消息并且成功的处理消息,可以将其丢弃了
channel.basicNack(long deliveryTag, boolean multiple, boolean requeue); //用户否定确认
channel.basicReject(long deliveryTag, boolean requeue); // 不处理该消息了,直接拒绝,可以让信道直接丢弃信息
```

#### multiple (待验证,无代码)

* true 代表批量应答channel上尚未应答的消息

  比如说channel 传送的tag 的消息 5 6 7 8 当前tag是8 ,那么其他都会被确认收到消息应答

* false  只会应答8 ,其他消息依然不会被确认收到消息应答

#### 消息自动重新入队(待验证,无代码)



如果消费者由于某些原因失去链接,其通道已关闭,链接已关闭或TCP链接丢失,导致消息未发送ACK确认,mq将了解到消息未完全处理,并将其对重新怕对.如果此时其他消费者可以处理,它将很快重新分发给另一个消费者,这样,即使某个消费者偶尔死亡,也可以确保不会丢失任何消息.





