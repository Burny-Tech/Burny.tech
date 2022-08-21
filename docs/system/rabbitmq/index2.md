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

> 手动应答的方式可以减少网络拥堵

##### 消息应答的方法

```java
channel.basicAck(long deliveryTag, boolean multiple); //用户肯定确认 rabbitmq 已知道该消息并且成功的处理消息,可以将其丢弃了
channel.basicNack(long deliveryTag, boolean multiple, boolean requeue); //用户否定确认
channel.basicReject(long deliveryTag, boolean requeue); // 不处理该消息了,直接拒绝,可以让信道直接丢弃信息
```

#### multiple 

* true 代表批量应答channel上尚未应答的消息

  比如说channel 传送的tag 的消息 5 6 7 8 当前tag是8 ,那么其他都会被确认收到消息应答

* false  只会应答8 ,其他消息依然不会被确认收到消息应答

#### 消息自动重新入队



如果消费者由于某些原因失去链接,其通道已关闭,链接已关闭或TCP链接丢失,导致消息未发送ACK确认,mq将了解到消息未完全处理,并将其对重新怕对.如果此时其他消费者可以处理,它将很快重新分发给另一个消费者,这样,即使某个消费者偶尔死亡,也可以确保不会丢失任何消息.

##### 代码一:启动报错

```java
channel.queueDeclare(queue_name, true, true, false, null);
```

> 生产者端将queueDeclare  exclusive 即第三个参数改为true 启动报错.


::: details 点击查看代码
```java


20:46:34.857 [main] DEBUG com.rabbitmq.client.impl.ConsumerWorkService - Creating executor service with 4 thread(s) for consumer work service
Exception in thread "main" java.io.IOException
	at com.rabbitmq.client.impl.AMQChannel.wrap(AMQChannel.java:129)
	at com.rabbitmq.client.impl.AMQChannel.wrap(AMQChannel.java:125)
	at com.rabbitmq.client.impl.AMQChannel.exnWrappingRpc(AMQChannel.java:147)
	at com.rabbitmq.client.impl.ChannelN.queueDeclare(ChannelN.java:968)
	at com.rabbitmq.client.impl.recovery.AutorecoveringChannel.queueDeclare(AutorecoveringChannel.java:343)
	at com.burny.rabbitmq.two_work_queues.Producer.main(Producer.java:26)
Caused by: com.rabbitmq.client.ShutdownSignalException: channel error; protocol method: #method<channel.close>(reply-code=405, reply-text=RESOURCE_LOCKED - cannot obtain exclusive access to locked queue 'hello' in vhost '/'. It could be originally declared on another connection or the exclusive property value does not match that of the original declaration., class-id=50, method-id=10)
	at com.rabbitmq.utility.ValueOrException.getValue(ValueOrException.java:66)
	at com.rabbitmq.utility.BlockingValueOrException.uninterruptibleGetValue(BlockingValueOrException.java:36)
	at com.rabbitmq.client.impl.AMQChannel$BlockingRpcContinuation.getReply(AMQChannel.java:502)
	at com.rabbitmq.client.impl.AMQChannel.privateRpc(AMQChannel.java:293)
	at com.rabbitmq.client.impl.AMQChannel.exnWrappingRpc(AMQChannel.java:141)
	... 3 more
Caused by: com.rabbitmq.client.ShutdownSignalException: channel error; protocol method: #method<channel.close>(reply-code=405, reply-text=RESOURCE_LOCKED - cannot obtain exclusive access to locked queue 'hello' in vhost '/'. It could be originally declared on another connection or the exclusive property value does not match that of the original declaration., class-id=50, method-id=10)
	at com.rabbitmq.client.impl.ChannelN.asyncShutdown(ChannelN.java:517)
	at com.rabbitmq.client.impl.ChannelN.processAsync(ChannelN.java:341)
	at com.rabbitmq.client.impl.AMQChannel.handleCompleteInboundCommand(AMQChannel.java:182)
	at com.rabbitmq.client.impl.AMQChannel.handleFrame(AMQChannel.java:114)
	at com.rabbitmq.client.impl.AMQConnection.readFrame(AMQConnection.java:739)
	at com.rabbitmq.client.impl.AMQConnection.access$300(AMQConnection.java:47)
	at com.rabbitmq.client.impl.AMQConnection$MainLoop.run(AMQConnection.java:666)
	at java.lang.Thread.run(Thread.java:748)

```
:::

##### 代码二:同一个信道可以作为接收信道和发送信道

```java
//骚操作
public class Producer {

    //队列名称
    public static final String queue_name = "hello";

    public static final String content = "hello world";

    public static void main(String[] args) throws Exception {
        Channel channel = Info.getC();
        //exclusive:消息是否被共享
        channel.queueDeclare(queue_name, true, false, false, null);
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            log.info(Info.pre + new String(delivery.getBody()));
            long deliveryTag = delivery.getEnvelope().getDeliveryTag();
            log.info(String.valueOf(deliveryTag));
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(),false);
        };
        CancelCallback callback = (consumerTag) -> {
            log.info(Info.callback);
        };

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String next = scanner.next();
            for (int i = 0; i < 1000000; i++) {
                log.info("发送一次"+i);
                //同一个信道又发送又接收.发送还是
                channel.basicPublish("", queue_name, null, (next + i).getBytes("UTF-8"));
                channel.basicConsume(Info.queue_name, false, deliverCallback, callback);
                //byte[] body = channel.basicGet(queue_name, false).getBody();
                //log.info("pro"+new String(body));
            }
        }

    }

}

```

##### 代码三:正常的生产端和消费端

::: details 工具类
```java
package com.burny.rabbitmq.common;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
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

    public static final String queue_name = "hello";

    public static final String pre = "接收到消息: ";

    public static final String callback = "消费者取消消费的回调";


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

```
:::

:::: code-group
::: code-group-item 生产者
```java
package com.burny.rabbitmq.two_work_queues;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.CancelCallback;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import lombok.extern.slf4j.Slf4j;

import java.util.Scanner;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/17 23:46
 */

@Slf4j
public class Producer {

    public static void main(String[] args) throws Exception {
        Channel channel = Info.getC();
        //exclusive:消息是否被共享
        channel.queueDeclare(Info.queue_name, true, false, false, null);
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            String next = scanner.next();
            for (int i = 0; i < 1000000; i++) {
                log.info("发送一次"+i);
                channel.basicPublish("", Info.queue_name, null, (next + i).getBytes("UTF-8"));
            }
        }

    }

}


```
:::
::: code-group-item 消费者
```java
package com.burny.rabbitmq.two_work_queues;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.CancelCallback;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

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
        Channel channel = Info.getC();
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            log.info(Info.pre + new String(delivery.getBody()));
            long deliveryTag = delivery.getEnvelope().getDeliveryTag();
            log.info(String.valueOf(deliveryTag));
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(),false);
        };
        CancelCallback callback = (consumerTag) -> {
            log.info(Info.callback);
        };
        channel.basicConsume(Info.queue_name, false, deliverCallback, callback);

    }
}


```
:::
::::

##### 消息重新入队,(需要再研究一下)

如果已接收但未应答,并且宕机了.则消息会重新入队



### 持久化

#### 队列持久化

生产端绑定队列的时候的第二个参数

```java

 Queue.DeclareOk queueDeclare(String queue, boolean durable, boolean exclusive, boolean autoDelete,
                                 Map<String, Object> arguments) throws IOException;

channel.queueDeclare(Info.queue_name, true, false, false, null);

```

> 注意:如果原先的队列不是持久化的,则需要重新删除并新建.否则会报错.

即绑定的时候队列属性已经生成,不可更改.



#### 消息持久化

> 注意:只能说明生产者把消息到达队列后持久化.并**不能保证消息百分百不丢失!**!即生产者把消息发送到队列之前,磁盘未持久化就宕机了.

```java
//生产者 
channel.basicPublish("",Info.queue_name, MessageProperties.PERSISTENT_TEXT_PLAIN,(next).getBytes("UTF-8"));

```



### 不公平分发

之前的都是轮询分发.

**需要在消费之前的设置**

```java
//消费者
        //设置成不公平分发,即能者多劳
        channel.basicQos(1);
//默认公平分发, 即 
        channel.basicQos(0);

```

###  预取值(prefetch)

**经测试:此种情况下是在有些客户端未应答延迟很久,才会这样按比例执行**

如果是不存在客户端迟迟未应答,则是**公平分发原则**



即比例分发,例如有AB两个客户端,可以设置A 接收 总数据量的`30%` B 接收 总数据量的 `70%`

```java
//消费者
//表示能收到总数据量的 
//消费者A
        channel.basicQos(2);
//消费者B
   channel.basicQos(5);
//消费者C
 channel.basicQos(3);
```

综上所述, A 消费  `2/(2+5+3)` B 消费 `5/(2+5+3)`   C 消费 `3/(2+5+3)` 

但是消费的数量并不是绝对的正确,可能由于时间等原因,会有所偏差



## 发布确认模式(解决消息丢失)

> 前提:
>
> 确保队列持久化,
>
> 消息持久化



![](/images/system/rabbitmq/1104.png)

> 默认是不开启发布确认模式,

```java
//生产者
        channel.confirmSelect();
```



发布确认策略

* 单个确认发布
* 批量确认发布
* 异步确认发布

### 单个确认发布(同步)

```java
生产者        
channel.basicPublish("", Info.queue_name, MessageProperties.PERSISTENT_TEXT_PLAIN, (next).getBytes("UTF-8"));
//单个确认发布
  channel.waitForConfirms();
```



###  批量确认发布(同步)

缺点:如果在出现差错,无法确认具体是哪一条出错.只能说明是在哪一批次出现问题.

```java
//先声明批量确认的数量
private static  final Integer batch=100;
 for (int i = 0; i < 2000; i++) {
                if (i%batch==0){
                    channel.waitForConfirms();
                }
            }


```

### 异步确认

![](/images/system/rabbitmq/5129.png)

```java
//生产者

            //异步确认

            ConfirmListener confirmListener=new ConfirmListener() {
                @Override
                public void handleAck(long deliveryTag, boolean multiple) throws IOException {
                    //消息成功时处理
                    //参数说明:消息的标记,是否批量确认
                }

                @Override
                public void handleNack(long deliveryTag, boolean multiple) throws IOException {
                    //消息拒绝时处理 区别于接收但是没有发送成功与否回来.
                    //参数说明:消息的标记,是否批量确认

                }
            };
            channel.addConfirmListener(confirmListener);
//添加监听器需要在消息发送之前就监听
            channel.basicPublish("", Info.queue_name, MessageProperties.PERSISTENT_TEXT_PLAIN, (next).getBytes("UTF-8"));


```

#### 异步未确认消息

把未确认的消息放到一个基于内存的能被发布线程访问的队列,比如说ConcurrentLinkedQueue这个队列在confirm callbacks 与发布线程之间进行消息的传递.

确认收到,成功收到和拒绝接收都把concurrentlinked 中删除

```java
 ConcurrentSkipListMap<Long,String> outStandingConfirm=new ConcurrentSkipListMap<>();
            String content="消息内容";
//下次发送时候的key
            outStandingConfirm.put(channel.getNextPublishSeqNo(),content);
            ConfirmListener confirmListener1 = new ConfirmListener() {
                @Override
                public void handleAck(long deliveryTag, boolean multiple) throws IOException {
                    //消息成功时处理
                    //参数说明:消息的标记,是否批量确认
                    outStandingConfirm.headMap(deliveryTag);
                    if (multiple){
                        outStandingConfirm.headMap(deliveryTag);
                        outStandingConfirm.clear();
                    }else {
                        outStandingConfirm.remove(deliveryTag);
                    }
                }

                @Override
                public void handleNack(long deliveryTag, boolean multiple) throws IOException {
                    //消息拒绝时处理
                    //参数说明:消息的标记,是否批量确认
                    outStandingConfirm.headMap(deliveryTag);


                }
            };
```







### 性能,质量对比

异步 > 批量 > 单个

## 交换机

> 只需要用到队列的称为 工作模式,简单模式 

用到交换机有以下三种模式

* 路由模式

* 发布订阅模式

* 主题模式

### 类型

* 直接类型(direct)  即 路由模式

* 主题类型  topic

* 标题类型  headers 非常少用

* 扇出类型 fanout  即 发布订阅模式 广播模式 (待确定)

* 无名类型: 默认为 `""` 用空字符串表示

  

  ### 无名类型

  消息路由发送到队列中其实是有 `routingkey(bingdingkey )`绑定key指定的

  

  #### 临时队列

  不带有持久化的队列,每当链接到rabbit时,需要一个全新的空队列,为此我们可以创建一个具有随机名称的队列,其次,`一旦消费者断开链接,队列将自动删除.`

  ```java
              //穿建临时队列
              channel.queueDeclare().getQueue();
  ```

  #### 绑定

  交换机绑定队列名称

  ![](/images/system/rabbitmq/4312.png)

### Fanout

> 它是将接收到的所有消息广播到她知道的所有队列中.

**routingkey** 为空字符串即 **""**

::::  code-group

:::  code-group-item 生产者

```java
package com.burny.rabbitmq.five_exchange;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.ConfirmListener;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/21 0:17
 */
@Slf4j
public class Producer {
    private static final Integer batch = 100;

    @SneakyThrows
    public static void main(String[] args) {
        //如果发送前需要确保消费者已经处于监听状态,否则消息会丢失
        Channel channel = Info.getC();
        //channel.exchangeDeclare(Info.exchange_name, BuiltinExchangeType.FANOUT);
        channel.confirmSelect();
        channel.exchangeDeclare(Info.exchange_name, BuiltinExchangeType.FANOUT, true, false, null);
        //internal 参数:如果为true 则无法发第二遍
        Scanner scanner = new Scanner(System.in);


        ConfirmListener confirmListener1 = new ConfirmListener() {
            @Override
            public void handleAck(long deliveryTag, boolean multiple) throws IOException {
                System.out.println("消息已经被接收");
            }

            @Override
            public void handleNack(long deliveryTag, boolean multiple) throws IOException {
                System.out.println("消息已经被接拒收");


            }
        };

        while (scanner.hasNext()) {
            byte[] bytes = scanner.next().getBytes(StandardCharsets.UTF_8);
            for (int i = 0; i < 10; i++) {
                channel.addConfirmListener(confirmListener1);
                channel.basicPublish(Info.exchange_name, "", null, bytes);
                System.out.println("发送次数" + i + (new String(bytes)));
            }
        }


    }


}

```

::: 

:::  code-group-item 消费者01

```java
package com.burny.rabbitmq.five_exchange;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import com.rabbitmq.client.Delivery;
import lombok.SneakyThrows;

import java.io.IOException;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/21 15:35
 */

public class Consumer01 {
    @SneakyThrows
    public static void main(String[] args) {
        Channel channel = Info.getC();
        //声明交换机
        //channel.exchangeDeclare(Info.exchange_name, BuiltinExchangeType.FANOUT,true,false,true,null);
        //生成临时队列,队列名称是随机的,当消费者断开与队列的连接,则队列会自动删除.
        String queue = channel.queueDeclare().getQueue();
        //绑定交换机与队列
        channel.queueBind(queue,Info.exchange_name,"",null);

        channel.basicConsume(queue,false,((message,delivery)->{
            System.out.println(new String(delivery.getBody()));
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(),false);
        }),(consumerTag -> {
            System.out.println(new String(consumerTag));
        }));
    }
}

```

:::

:::  code-group-item 消费者02

```java
package com.burny.rabbitmq.five_exchange;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import lombok.SneakyThrows;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/21 15:35
 */

public class Consumer02 {
    @SneakyThrows
    public static void main(String[] args) {
        Channel channel = Info.getC();
        //生成临时队列,队列名称是随机的,当消费者断开与队列的连接,则队列会自动删除.
        String queue = channel.queueDeclare().getQueue();
        //绑定交换机与队列
        channel.queueBind(queue,Info.exchange_name,"",null);

        channel.basicConsume(queue,true,((consumerTag,message)->{
            System.out.println(new String(message.getBody()));
        }),(consumerTag -> {
            System.out.println(new String(consumerTag));
        }));
    }
}

```

::: 

::::  code-group



总结:

1. 如果先启动生产者,没有启动消费者,生产者发送后是会被消费.这样即订阅发布模式,只有订阅之后,才能接收到发布
2. **生产者设置的监听器,需要每次发送之前都监听.如果是将监听器添加一次,则监听会收到消费者回答的次数不确定**,见下代码
3. 广播模式中,生产者的`routingkey` 任意字符串,例如 "" 或者  "fds" 等,
4. 对第三的解释是:只要是绑定到广播模式的交换机,routingkey就不起作用
5. 生产者的`ConfirmListener`  ,如果n个客户端,则生产者每发送一条消息,则会收到n个回调消息(前提:每发送一次前都要添加监听器).

下述是第二点的代码以及结果

:::: code-group

::: code-group-item 生产者

```java
package com.burny.rabbitmq.five_exchange;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.ConfirmListener;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/21 0:17
 */
@Slf4j
public class Producer {
    private static final Integer batch = 100;

    @SneakyThrows
    public static void main(String[] args) {
        //如果发送前需要确保消费者已经处于监听状态,否则消息会丢失
        Channel channel = Info.getC();
        //channel.exchangeDeclare(Info.exchange_name, BuiltinExchangeType.FANOUT);
        channel.confirmSelect();
        channel.exchangeDeclare(Info.exchange_name, BuiltinExchangeType.FANOUT, true, false, null);
        //internal 参数:如果为true 则无法发第二遍
        Scanner scanner = new Scanner(System.in);



        ConfirmListener confirmListener1 = new ConfirmListener() {
            Integer a=0;
            @Override
            public void handleAck(long deliveryTag, boolean multiple) throws IOException {
                log.info("消息已别接收,deliveryTag:{},监听器收到的总次数:{}",deliveryTag,a);
                a++;
            }

            @Override
            public void handleNack(long deliveryTag, boolean multiple) throws IOException {
                System.out.println("消息已经被接拒收");


            }
        };
        channel.addConfirmListener(confirmListener1);

        while (scanner.hasNext()) {
            byte[] bytes = scanner.next().getBytes(StandardCharsets.UTF_8);
            String s = new String(bytes);
            for (int i = 0; i < 1000; i++) {
                channel.basicPublish(Info.exchange_name, "", null, (s+i).getBytes(StandardCharsets.UTF_8));
                System.out.println("发送次数" + i +";发送内容:"+ (new String(bytes))+";下一次发送的deliveryTag"+channel.getNextPublishSeqNo());
            }
        }


    }


}

```



:::

::: code-group-item 消费者

```java
package com.burny.rabbitmq.five_exchange;

import com.burny.rabbitmq.common.Info;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import com.rabbitmq.client.Delivery;
import lombok.SneakyThrows;

import java.io.IOException;

/**
 * @Note TODO
 * @Author cyx
 * @Date 2022/8/21 15:35
 */

public class Consumer01 {
    @SneakyThrows
    public static void main(String[] args) {
        Channel channel = Info.getC();
        //声明交换机
        //channel.exchangeDeclare(Info.exchange_name, BuiltinExchangeType.FANOUT,true,false,true,null);
        //生成临时队列,队列名称是随机的,当消费者断开与队列的连接,则队列会自动删除.
        String queue = channel.queueDeclare().getQueue();
        //绑定交换机与队列
        channel.queueBind(queue,Info.exchange_name,"",null);

        channel.basicConsume(queue,false,((message,delivery)->{
            System.out.println(new String(delivery.getBody()));
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(),false);
        }),(consumerTag -> {
            System.out.println(new String(consumerTag));
        }));
    }
}

```



:::

::::

:::details 结果

```java

这是发送的内容
发送次数0;发送内容:这是发送的内容;下一次发送的deliveryTag2
发送次数1;发送内容:这是发送的内容;下一次发送的deliveryTag3
发送次数2;发送内容:这是发送的内容;下一次发送的deliveryTag4
发送次数3;发送内容:这是发送的内容;下一次发送的deliveryTag5
发送次数4;发送内容:这是发送的内容;下一次发送的deliveryTag6
发送次数5;发送内容:这是发送的内容;下一次发送的deliveryTag7
发送次数6;发送内容:这是发送的内容;下一次发送的deliveryTag8
发送次数7;发送内容:这是发送的内容;下一次发送的deliveryTag9
发送次数8;发送内容:这是发送的内容;下一次发送的deliveryTag10
发送次数9;发送内容:这是发送的内容;下一次发送的deliveryTag11
发送次数10;发送内容:这是发送的内容;下一次发送的deliveryTag12
发送次数11;发送内容:这是发送的内容;下一次发送的deliveryTag13
发送次数12;发送内容:这是发送的内容;下一次发送的deliveryTag14
发送次数13;发送内容:这是发送的内容;下一次发送的deliveryTag15
发送次数14;发送内容:这是发送的内容;下一次发送的deliveryTag16
17:40:04.307 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:1,监听器收到的总次数:0
发送次数15;发送内容:这是发送的内容;下一次发送的deliveryTag17
发送次数16;发送内容:这是发送的内容;下一次发送的deliveryTag18
发送次数17;发送内容:这是发送的内容;下一次发送的deliveryTag19
发送次数18;发送内容:这是发送的内容;下一次发送的deliveryTag20
发送次数19;发送内容:这是发送的内容;下一次发送的deliveryTag21
发送次数20;发送内容:这是发送的内容;下一次发送的deliveryTag22
发送次数21;发送内容:这是发送的内容;下一次发送的deliveryTag23
发送次数22;发送内容:这是发送的内容;下一次发送的deliveryTag24
发送次数23;发送内容:这是发送的内容;下一次发送的deliveryTag25
发送次数24;发送内容:这是发送的内容;下一次发送的deliveryTag26
发送次数25;发送内容:这是发送的内容;下一次发送的deliveryTag27
发送次数26;发送内容:这是发送的内容;下一次发送的deliveryTag28
发送次数27;发送内容:这是发送的内容;下一次发送的deliveryTag29
发送次数28;发送内容:这是发送的内容;下一次发送的deliveryTag30
发送次数29;发送内容:这是发送的内容;下一次发送的deliveryTag31
发送次数30;发送内容:这是发送的内容;下一次发送的deliveryTag32
发送次数31;发送内容:这是发送的内容;下一次发送的deliveryTag33
发送次数32;发送内容:这是发送的内容;下一次发送的deliveryTag34
发送次数33;发送内容:这是发送的内容;下一次发送的deliveryTag35
发送次数34;发送内容:这是发送的内容;下一次发送的deliveryTag36
发送次数35;发送内容:这是发送的内容;下一次发送的deliveryTag37
发送次数36;发送内容:这是发送的内容;下一次发送的deliveryTag38
发送次数37;发送内容:这是发送的内容;下一次发送的deliveryTag39
发送次数38;发送内容:这是发送的内容;下一次发送的deliveryTag40
发送次数39;发送内容:这是发送的内容;下一次发送的deliveryTag41
发送次数40;发送内容:这是发送的内容;下一次发送的deliveryTag42
发送次数41;发送内容:这是发送的内容;下一次发送的deliveryTag43
发送次数42;发送内容:这是发送的内容;下一次发送的deliveryTag44
发送次数43;发送内容:这是发送的内容;下一次发送的deliveryTag45
发送次数44;发送内容:这是发送的内容;下一次发送的deliveryTag46
发送次数45;发送内容:这是发送的内容;下一次发送的deliveryTag47
发送次数46;发送内容:这是发送的内容;下一次发送的deliveryTag48
发送次数47;发送内容:这是发送的内容;下一次发送的deliveryTag49
发送次数48;发送内容:这是发送的内容;下一次发送的deliveryTag50
发送次数49;发送内容:这是发送的内容;下一次发送的deliveryTag51
发送次数50;发送内容:这是发送的内容;下一次发送的deliveryTag52
发送次数51;发送内容:这是发送的内容;下一次发送的deliveryTag53
发送次数52;发送内容:这是发送的内容;下一次发送的deliveryTag54
发送次数53;发送内容:这是发送的内容;下一次发送的deliveryTag55
发送次数54;发送内容:这是发送的内容;下一次发送的deliveryTag56
发送次数55;发送内容:这是发送的内容;下一次发送的deliveryTag57
发送次数56;发送内容:这是发送的内容;下一次发送的deliveryTag58
发送次数57;发送内容:这是发送的内容;下一次发送的deliveryTag59
发送次数58;发送内容:这是发送的内容;下一次发送的deliveryTag60
发送次数59;发送内容:这是发送的内容;下一次发送的deliveryTag61
发送次数60;发送内容:这是发送的内容;下一次发送的deliveryTag62
发送次数61;发送内容:这是发送的内容;下一次发送的deliveryTag63
发送次数62;发送内容:这是发送的内容;下一次发送的deliveryTag64
发送次数63;发送内容:这是发送的内容;下一次发送的deliveryTag65
发送次数64;发送内容:这是发送的内容;下一次发送的deliveryTag66
发送次数65;发送内容:这是发送的内容;下一次发送的deliveryTag67
17:40:04.318 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:8,监听器收到的总次数:1
发送次数66;发送内容:这是发送的内容;下一次发送的deliveryTag68
发送次数67;发送内容:这是发送的内容;下一次发送的deliveryTag69
发送次数68;发送内容:这是发送的内容;下一次发送的deliveryTag70
发送次数69;发送内容:这是发送的内容;下一次发送的deliveryTag71
发送次数70;发送内容:这是发送的内容;下一次发送的deliveryTag72
发送次数71;发送内容:这是发送的内容;下一次发送的deliveryTag73
发送次数72;发送内容:这是发送的内容;下一次发送的deliveryTag74
发送次数73;发送内容:这是发送的内容;下一次发送的deliveryTag75
发送次数74;发送内容:这是发送的内容;下一次发送的deliveryTag76
发送次数75;发送内容:这是发送的内容;下一次发送的deliveryTag77
发送次数76;发送内容:这是发送的内容;下一次发送的deliveryTag78
发送次数77;发送内容:这是发送的内容;下一次发送的deliveryTag79
发送次数78;发送内容:这是发送的内容;下一次发送的deliveryTag80
发送次数79;发送内容:这是发送的内容;下一次发送的deliveryTag81
发送次数80;发送内容:这是发送的内容;下一次发送的deliveryTag82
发送次数81;发送内容:这是发送的内容;下一次发送的deliveryTag83
发送次数82;发送内容:这是发送的内容;下一次发送的deliveryTag84
发送次数83;发送内容:这是发送的内容;下一次发送的deliveryTag85
发送次数84;发送内容:这是发送的内容;下一次发送的deliveryTag86
发送次数85;发送内容:这是发送的内容;下一次发送的deliveryTag87
发送次数86;发送内容:这是发送的内容;下一次发送的deliveryTag88
发送次数87;发送内容:这是发送的内容;下一次发送的deliveryTag89
发送次数88;发送内容:这是发送的内容;下一次发送的deliveryTag90
发送次数89;发送内容:这是发送的内容;下一次发送的deliveryTag91
发送次数90;发送内容:这是发送的内容;下一次发送的deliveryTag92
发送次数91;发送内容:这是发送的内容;下一次发送的deliveryTag93
发送次数92;发送内容:这是发送的内容;下一次发送的deliveryTag94
发送次数93;发送内容:这是发送的内容;下一次发送的deliveryTag95
发送次数94;发送内容:这是发送的内容;下一次发送的deliveryTag96
发送次数95;发送内容:这是发送的内容;下一次发送的deliveryTag97
发送次数96;发送内容:这是发送的内容;下一次发送的deliveryTag98
发送次数97;发送内容:这是发送的内容;下一次发送的deliveryTag99
发送次数98;发送内容:这是发送的内容;下一次发送的deliveryTag100
发送次数99;发送内容:这是发送的内容;下一次发送的deliveryTag101
发送次数100;发送内容:这是发送的内容;下一次发送的deliveryTag102
发送次数101;发送内容:这是发送的内容;下一次发送的deliveryTag103
发送次数102;发送内容:这是发送的内容;下一次发送的deliveryTag104
发送次数103;发送内容:这是发送的内容;下一次发送的deliveryTag105
发送次数104;发送内容:这是发送的内容;下一次发送的deliveryTag106
发送次数105;发送内容:这是发送的内容;下一次发送的deliveryTag107
发送次数106;发送内容:这是发送的内容;下一次发送的deliveryTag108
发送次数107;发送内容:这是发送的内容;下一次发送的deliveryTag109
发送次数108;发送内容:这是发送的内容;下一次发送的deliveryTag110
发送次数109;发送内容:这是发送的内容;下一次发送的deliveryTag111
发送次数110;发送内容:这是发送的内容;下一次发送的deliveryTag112
发送次数111;发送内容:这是发送的内容;下一次发送的deliveryTag113
发送次数112;发送内容:这是发送的内容;下一次发送的deliveryTag114
发送次数113;发送内容:这是发送的内容;下一次发送的deliveryTag115
发送次数114;发送内容:这是发送的内容;下一次发送的deliveryTag116
发送次数115;发送内容:这是发送的内容;下一次发送的deliveryTag117
发送次数116;发送内容:这是发送的内容;下一次发送的deliveryTag118
发送次数117;发送内容:这是发送的内容;下一次发送的deliveryTag119
发送次数118;发送内容:这是发送的内容;下一次发送的deliveryTag120
发送次数119;发送内容:这是发送的内容;下一次发送的deliveryTag121
发送次数120;发送内容:这是发送的内容;下一次发送的deliveryTag122
发送次数121;发送内容:这是发送的内容;下一次发送的deliveryTag123
发送次数122;发送内容:这是发送的内容;下一次发送的deliveryTag124
发送次数123;发送内容:这是发送的内容;下一次发送的deliveryTag125
发送次数124;发送内容:这是发送的内容;下一次发送的deliveryTag126
发送次数125;发送内容:这是发送的内容;下一次发送的deliveryTag127
发送次数126;发送内容:这是发送的内容;下一次发送的deliveryTag128
发送次数127;发送内容:这是发送的内容;下一次发送的deliveryTag129
发送次数128;发送内容:这是发送的内容;下一次发送的deliveryTag130
发送次数129;发送内容:这是发送的内容;下一次发送的deliveryTag131
发送次数130;发送内容:这是发送的内容;下一次发送的deliveryTag132
发送次数131;发送内容:这是发送的内容;下一次发送的deliveryTag133
发送次数132;发送内容:这是发送的内容;下一次发送的deliveryTag134
发送次数133;发送内容:这是发送的内容;下一次发送的deliveryTag135
发送次数134;发送内容:这是发送的内容;下一次发送的deliveryTag136
发送次数135;发送内容:这是发送的内容;下一次发送的deliveryTag137
发送次数136;发送内容:这是发送的内容;下一次发送的deliveryTag138
发送次数137;发送内容:这是发送的内容;下一次发送的deliveryTag139
发送次数138;发送内容:这是发送的内容;下一次发送的deliveryTag140
发送次数139;发送内容:这是发送的内容;下一次发送的deliveryTag141
发送次数140;发送内容:这是发送的内容;下一次发送的deliveryTag142
发送次数141;发送内容:这是发送的内容;下一次发送的deliveryTag143
发送次数142;发送内容:这是发送的内容;下一次发送的deliveryTag144
发送次数143;发送内容:这是发送的内容;下一次发送的deliveryTag145
发送次数144;发送内容:这是发送的内容;下一次发送的deliveryTag146
发送次数145;发送内容:这是发送的内容;下一次发送的deliveryTag147
发送次数146;发送内容:这是发送的内容;下一次发送的deliveryTag148
发送次数147;发送内容:这是发送的内容;下一次发送的deliveryTag149
发送次数148;发送内容:这是发送的内容;下一次发送的deliveryTag150
发送次数149;发送内容:这是发送的内容;下一次发送的deliveryTag151
17:40:04.334 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:12,监听器收到的总次数:2
发送次数150;发送内容:这是发送的内容;下一次发送的deliveryTag152
发送次数151;发送内容:这是发送的内容;下一次发送的deliveryTag153
发送次数152;发送内容:这是发送的内容;下一次发送的deliveryTag154
发送次数153;发送内容:这是发送的内容;下一次发送的deliveryTag155
发送次数154;发送内容:这是发送的内容;下一次发送的deliveryTag156
发送次数155;发送内容:这是发送的内容;下一次发送的deliveryTag157
发送次数156;发送内容:这是发送的内容;下一次发送的deliveryTag158
发送次数157;发送内容:这是发送的内容;下一次发送的deliveryTag159
发送次数158;发送内容:这是发送的内容;下一次发送的deliveryTag160
发送次数159;发送内容:这是发送的内容;下一次发送的deliveryTag161
发送次数160;发送内容:这是发送的内容;下一次发送的deliveryTag162
发送次数161;发送内容:这是发送的内容;下一次发送的deliveryTag163
发送次数162;发送内容:这是发送的内容;下一次发送的deliveryTag164
发送次数163;发送内容:这是发送的内容;下一次发送的deliveryTag165
发送次数164;发送内容:这是发送的内容;下一次发送的deliveryTag166
发送次数165;发送内容:这是发送的内容;下一次发送的deliveryTag167
发送次数166;发送内容:这是发送的内容;下一次发送的deliveryTag168
发送次数167;发送内容:这是发送的内容;下一次发送的deliveryTag169
发送次数168;发送内容:这是发送的内容;下一次发送的deliveryTag170
发送次数169;发送内容:这是发送的内容;下一次发送的deliveryTag171
发送次数170;发送内容:这是发送的内容;下一次发送的deliveryTag172
发送次数171;发送内容:这是发送的内容;下一次发送的deliveryTag173
发送次数172;发送内容:这是发送的内容;下一次发送的deliveryTag174
发送次数173;发送内容:这是发送的内容;下一次发送的deliveryTag175
发送次数174;发送内容:这是发送的内容;下一次发送的deliveryTag176
发送次数175;发送内容:这是发送的内容;下一次发送的deliveryTag177
发送次数176;发送内容:这是发送的内容;下一次发送的deliveryTag178
发送次数177;发送内容:这是发送的内容;下一次发送的deliveryTag179
发送次数178;发送内容:这是发送的内容;下一次发送的deliveryTag180
发送次数179;发送内容:这是发送的内容;下一次发送的deliveryTag181
发送次数180;发送内容:这是发送的内容;下一次发送的deliveryTag182
发送次数181;发送内容:这是发送的内容;下一次发送的deliveryTag183
发送次数182;发送内容:这是发送的内容;下一次发送的deliveryTag184
发送次数183;发送内容:这是发送的内容;下一次发送的deliveryTag185
发送次数184;发送内容:这是发送的内容;下一次发送的deliveryTag186
发送次数185;发送内容:这是发送的内容;下一次发送的deliveryTag187
发送次数186;发送内容:这是发送的内容;下一次发送的deliveryTag188
发送次数187;发送内容:这是发送的内容;下一次发送的deliveryTag189
发送次数188;发送内容:这是发送的内容;下一次发送的deliveryTag190
发送次数189;发送内容:这是发送的内容;下一次发送的deliveryTag191
发送次数190;发送内容:这是发送的内容;下一次发送的deliveryTag192
发送次数191;发送内容:这是发送的内容;下一次发送的deliveryTag193
发送次数192;发送内容:这是发送的内容;下一次发送的deliveryTag194
发送次数193;发送内容:这是发送的内容;下一次发送的deliveryTag195
发送次数194;发送内容:这是发送的内容;下一次发送的deliveryTag196
发送次数195;发送内容:这是发送的内容;下一次发送的deliveryTag197
发送次数196;发送内容:这是发送的内容;下一次发送的deliveryTag198
发送次数197;发送内容:这是发送的内容;下一次发送的deliveryTag199
发送次数198;发送内容:这是发送的内容;下一次发送的deliveryTag200
发送次数199;发送内容:这是发送的内容;下一次发送的deliveryTag201
发送次数200;发送内容:这是发送的内容;下一次发送的deliveryTag202
发送次数201;发送内容:这是发送的内容;下一次发送的deliveryTag203
发送次数202;发送内容:这是发送的内容;下一次发送的deliveryTag204
17:40:04.342 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:24,监听器收到的总次数:3
发送次数203;发送内容:这是发送的内容;下一次发送的deliveryTag205
发送次数204;发送内容:这是发送的内容;下一次发送的deliveryTag206
发送次数205;发送内容:这是发送的内容;下一次发送的deliveryTag207
发送次数206;发送内容:这是发送的内容;下一次发送的deliveryTag208
发送次数207;发送内容:这是发送的内容;下一次发送的deliveryTag209
发送次数208;发送内容:这是发送的内容;下一次发送的deliveryTag210
发送次数209;发送内容:这是发送的内容;下一次发送的deliveryTag211
发送次数210;发送内容:这是发送的内容;下一次发送的deliveryTag212
发送次数211;发送内容:这是发送的内容;下一次发送的deliveryTag213
发送次数212;发送内容:这是发送的内容;下一次发送的deliveryTag214
发送次数213;发送内容:这是发送的内容;下一次发送的deliveryTag215
发送次数214;发送内容:这是发送的内容;下一次发送的deliveryTag216
发送次数215;发送内容:这是发送的内容;下一次发送的deliveryTag217
发送次数216;发送内容:这是发送的内容;下一次发送的deliveryTag218
发送次数217;发送内容:这是发送的内容;下一次发送的deliveryTag219
发送次数218;发送内容:这是发送的内容;下一次发送的deliveryTag220
发送次数219;发送内容:这是发送的内容;下一次发送的deliveryTag221
发送次数220;发送内容:这是发送的内容;下一次发送的deliveryTag222
发送次数221;发送内容:这是发送的内容;下一次发送的deliveryTag223
发送次数222;发送内容:这是发送的内容;下一次发送的deliveryTag224
发送次数223;发送内容:这是发送的内容;下一次发送的deliveryTag225
发送次数224;发送内容:这是发送的内容;下一次发送的deliveryTag226
发送次数225;发送内容:这是发送的内容;下一次发送的deliveryTag227
发送次数226;发送内容:这是发送的内容;下一次发送的deliveryTag228
发送次数227;发送内容:这是发送的内容;下一次发送的deliveryTag229
发送次数228;发送内容:这是发送的内容;下一次发送的deliveryTag230
发送次数229;发送内容:这是发送的内容;下一次发送的deliveryTag231
发送次数230;发送内容:这是发送的内容;下一次发送的deliveryTag232
发送次数231;发送内容:这是发送的内容;下一次发送的deliveryTag233
发送次数232;发送内容:这是发送的内容;下一次发送的deliveryTag234
发送次数233;发送内容:这是发送的内容;下一次发送的deliveryTag235
发送次数234;发送内容:这是发送的内容;下一次发送的deliveryTag236
发送次数235;发送内容:这是发送的内容;下一次发送的deliveryTag237
发送次数236;发送内容:这是发送的内容;下一次发送的deliveryTag238
发送次数237;发送内容:这是发送的内容;下一次发送的deliveryTag239
发送次数238;发送内容:这是发送的内容;下一次发送的deliveryTag240
发送次数239;发送内容:这是发送的内容;下一次发送的deliveryTag241
发送次数240;发送内容:这是发送的内容;下一次发送的deliveryTag242
发送次数241;发送内容:这是发送的内容;下一次发送的deliveryTag243
发送次数242;发送内容:这是发送的内容;下一次发送的deliveryTag244
发送次数243;发送内容:这是发送的内容;下一次发送的deliveryTag245
发送次数244;发送内容:这是发送的内容;下一次发送的deliveryTag246
发送次数245;发送内容:这是发送的内容;下一次发送的deliveryTag247
发送次数246;发送内容:这是发送的内容;下一次发送的deliveryTag248
发送次数247;发送内容:这是发送的内容;下一次发送的deliveryTag249
发送次数248;发送内容:这是发送的内容;下一次发送的deliveryTag250
发送次数249;发送内容:这是发送的内容;下一次发送的deliveryTag251
发送次数250;发送内容:这是发送的内容;下一次发送的deliveryTag252
发送次数251;发送内容:这是发送的内容;下一次发送的deliveryTag253
发送次数252;发送内容:这是发送的内容;下一次发送的deliveryTag254
发送次数253;发送内容:这是发送的内容;下一次发送的deliveryTag255
发送次数254;发送内容:这是发送的内容;下一次发送的deliveryTag256
发送次数255;发送内容:这是发送的内容;下一次发送的deliveryTag257
发送次数256;发送内容:这是发送的内容;下一次发送的deliveryTag258
发送次数257;发送内容:这是发送的内容;下一次发送的deliveryTag259
发送次数258;发送内容:这是发送的内容;下一次发送的deliveryTag260
发送次数259;发送内容:这是发送的内容;下一次发送的deliveryTag261
发送次数260;发送内容:这是发送的内容;下一次发送的deliveryTag262
发送次数261;发送内容:这是发送的内容;下一次发送的deliveryTag263
发送次数262;发送内容:这是发送的内容;下一次发送的deliveryTag264
发送次数263;发送内容:这是发送的内容;下一次发送的deliveryTag265
发送次数264;发送内容:这是发送的内容;下一次发送的deliveryTag266
发送次数265;发送内容:这是发送的内容;下一次发送的deliveryTag267
发送次数266;发送内容:这是发送的内容;下一次发送的deliveryTag268
发送次数267;发送内容:这是发送的内容;下一次发送的deliveryTag269
发送次数268;发送内容:这是发送的内容;下一次发送的deliveryTag270
发送次数269;发送内容:这是发送的内容;下一次发送的deliveryTag271
发送次数270;发送内容:这是发送的内容;下一次发送的deliveryTag272
发送次数271;发送内容:这是发送的内容;下一次发送的deliveryTag273
发送次数272;发送内容:这是发送的内容;下一次发送的deliveryTag274
发送次数273;发送内容:这是发送的内容;下一次发送的deliveryTag275
发送次数274;发送内容:这是发送的内容;下一次发送的deliveryTag276
发送次数275;发送内容:这是发送的内容;下一次发送的deliveryTag277
发送次数276;发送内容:这是发送的内容;下一次发送的deliveryTag278
发送次数277;发送内容:这是发送的内容;下一次发送的deliveryTag279
发送次数278;发送内容:这是发送的内容;下一次发送的deliveryTag280
发送次数279;发送内容:这是发送的内容;下一次发送的deliveryTag281
发送次数280;发送内容:这是发送的内容;下一次发送的deliveryTag282
发送次数281;发送内容:这是发送的内容;下一次发送的deliveryTag283
发送次数282;发送内容:这是发送的内容;下一次发送的deliveryTag284
发送次数283;发送内容:这是发送的内容;下一次发送的deliveryTag285
发送次数284;发送内容:这是发送的内容;下一次发送的deliveryTag286
发送次数285;发送内容:这是发送的内容;下一次发送的deliveryTag287
发送次数286;发送内容:这是发送的内容;下一次发送的deliveryTag288
发送次数287;发送内容:这是发送的内容;下一次发送的deliveryTag289
发送次数288;发送内容:这是发送的内容;下一次发送的deliveryTag290
发送次数289;发送内容:这是发送的内容;下一次发送的deliveryTag291
发送次数290;发送内容:这是发送的内容;下一次发送的deliveryTag292
发送次数291;发送内容:这是发送的内容;下一次发送的deliveryTag293
发送次数292;发送内容:这是发送的内容;下一次发送的deliveryTag294
发送次数293;发送内容:这是发送的内容;下一次发送的deliveryTag295
发送次数294;发送内容:这是发送的内容;下一次发送的deliveryTag296
发送次数295;发送内容:这是发送的内容;下一次发送的deliveryTag297
发送次数296;发送内容:这是发送的内容;下一次发送的deliveryTag298
发送次数297;发送内容:这是发送的内容;下一次发送的deliveryTag299
发送次数298;发送内容:这是发送的内容;下一次发送的deliveryTag300
发送次数299;发送内容:这是发送的内容;下一次发送的deliveryTag301
发送次数300;发送内容:这是发送的内容;下一次发送的deliveryTag302
发送次数301;发送内容:这是发送的内容;下一次发送的deliveryTag303
发送次数302;发送内容:这是发送的内容;下一次发送的deliveryTag304
发送次数303;发送内容:这是发送的内容;下一次发送的deliveryTag305
发送次数304;发送内容:这是发送的内容;下一次发送的deliveryTag306
发送次数305;发送内容:这是发送的内容;下一次发送的deliveryTag307
发送次数306;发送内容:这是发送的内容;下一次发送的deliveryTag308
发送次数307;发送内容:这是发送的内容;下一次发送的deliveryTag309
发送次数308;发送内容:这是发送的内容;下一次发送的deliveryTag310
发送次数309;发送内容:这是发送的内容;下一次发送的deliveryTag311
发送次数310;发送内容:这是发送的内容;下一次发送的deliveryTag312
发送次数311;发送内容:这是发送的内容;下一次发送的deliveryTag313
发送次数312;发送内容:这是发送的内容;下一次发送的deliveryTag314
发送次数313;发送内容:这是发送的内容;下一次发送的deliveryTag315
发送次数314;发送内容:这是发送的内容;下一次发送的deliveryTag316
发送次数315;发送内容:这是发送的内容;下一次发送的deliveryTag317
发送次数316;发送内容:这是发送的内容;下一次发送的deliveryTag318
发送次数317;发送内容:这是发送的内容;下一次发送的deliveryTag319
发送次数318;发送内容:这是发送的内容;下一次发送的deliveryTag320
发送次数319;发送内容:这是发送的内容;下一次发送的deliveryTag321
发送次数320;发送内容:这是发送的内容;下一次发送的deliveryTag322
发送次数321;发送内容:这是发送的内容;下一次发送的deliveryTag323
发送次数322;发送内容:这是发送的内容;下一次发送的deliveryTag324
发送次数323;发送内容:这是发送的内容;下一次发送的deliveryTag325
发送次数324;发送内容:这是发送的内容;下一次发送的deliveryTag326
发送次数325;发送内容:这是发送的内容;下一次发送的deliveryTag327
发送次数326;发送内容:这是发送的内容;下一次发送的deliveryTag328
发送次数327;发送内容:这是发送的内容;下一次发送的deliveryTag329
发送次数328;发送内容:这是发送的内容;下一次发送的deliveryTag330
发送次数329;发送内容:这是发送的内容;下一次发送的deliveryTag331
发送次数330;发送内容:这是发送的内容;下一次发送的deliveryTag332
发送次数331;发送内容:这是发送的内容;下一次发送的deliveryTag333
发送次数332;发送内容:这是发送的内容;下一次发送的deliveryTag334
发送次数333;发送内容:这是发送的内容;下一次发送的deliveryTag335
发送次数334;发送内容:这是发送的内容;下一次发送的deliveryTag336
发送次数335;发送内容:这是发送的内容;下一次发送的deliveryTag337
发送次数336;发送内容:这是发送的内容;下一次发送的deliveryTag338
发送次数337;发送内容:这是发送的内容;下一次发送的deliveryTag339
发送次数338;发送内容:这是发送的内容;下一次发送的deliveryTag340
发送次数339;发送内容:这是发送的内容;下一次发送的deliveryTag341
发送次数340;发送内容:这是发送的内容;下一次发送的deliveryTag342
发送次数341;发送内容:这是发送的内容;下一次发送的deliveryTag343
发送次数342;发送内容:这是发送的内容;下一次发送的deliveryTag344
发送次数343;发送内容:这是发送的内容;下一次发送的deliveryTag345
发送次数344;发送内容:这是发送的内容;下一次发送的deliveryTag346
发送次数345;发送内容:这是发送的内容;下一次发送的deliveryTag347
发送次数346;发送内容:这是发送的内容;下一次发送的deliveryTag348
发送次数347;发送内容:这是发送的内容;下一次发送的deliveryTag349
发送次数348;发送内容:这是发送的内容;下一次发送的deliveryTag350
发送次数349;发送内容:这是发送的内容;下一次发送的deliveryTag351
发送次数350;发送内容:这是发送的内容;下一次发送的deliveryTag352
发送次数351;发送内容:这是发送的内容;下一次发送的deliveryTag353
发送次数352;发送内容:这是发送的内容;下一次发送的deliveryTag354
发送次数353;发送内容:这是发送的内容;下一次发送的deliveryTag355
发送次数354;发送内容:这是发送的内容;下一次发送的deliveryTag356
发送次数355;发送内容:这是发送的内容;下一次发送的deliveryTag357
发送次数356;发送内容:这是发送的内容;下一次发送的deliveryTag358
发送次数357;发送内容:这是发送的内容;下一次发送的deliveryTag359
发送次数358;发送内容:这是发送的内容;下一次发送的deliveryTag360
发送次数359;发送内容:这是发送的内容;下一次发送的deliveryTag361
发送次数360;发送内容:这是发送的内容;下一次发送的deliveryTag362
发送次数361;发送内容:这是发送的内容;下一次发送的deliveryTag363
发送次数362;发送内容:这是发送的内容;下一次发送的deliveryTag364
发送次数363;发送内容:这是发送的内容;下一次发送的deliveryTag365
发送次数364;发送内容:这是发送的内容;下一次发送的deliveryTag366
发送次数365;发送内容:这是发送的内容;下一次发送的deliveryTag367
发送次数366;发送内容:这是发送的内容;下一次发送的deliveryTag368
发送次数367;发送内容:这是发送的内容;下一次发送的deliveryTag369
发送次数368;发送内容:这是发送的内容;下一次发送的deliveryTag370
发送次数369;发送内容:这是发送的内容;下一次发送的deliveryTag371
发送次数370;发送内容:这是发送的内容;下一次发送的deliveryTag372
发送次数371;发送内容:这是发送的内容;下一次发送的deliveryTag373
发送次数372;发送内容:这是发送的内容;下一次发送的deliveryTag374
发送次数373;发送内容:这是发送的内容;下一次发送的deliveryTag375
发送次数374;发送内容:这是发送的内容;下一次发送的deliveryTag376
发送次数375;发送内容:这是发送的内容;下一次发送的deliveryTag377
发送次数376;发送内容:这是发送的内容;下一次发送的deliveryTag378
发送次数377;发送内容:这是发送的内容;下一次发送的deliveryTag379
发送次数378;发送内容:这是发送的内容;下一次发送的deliveryTag380
发送次数379;发送内容:这是发送的内容;下一次发送的deliveryTag381
发送次数380;发送内容:这是发送的内容;下一次发送的deliveryTag382
发送次数381;发送内容:这是发送的内容;下一次发送的deliveryTag383
发送次数382;发送内容:这是发送的内容;下一次发送的deliveryTag384
发送次数383;发送内容:这是发送的内容;下一次发送的deliveryTag385
发送次数384;发送内容:这是发送的内容;下一次发送的deliveryTag386
发送次数385;发送内容:这是发送的内容;下一次发送的deliveryTag387
发送次数386;发送内容:这是发送的内容;下一次发送的deliveryTag388
发送次数387;发送内容:这是发送的内容;下一次发送的deliveryTag389
发送次数388;发送内容:这是发送的内容;下一次发送的deliveryTag390
发送次数389;发送内容:这是发送的内容;下一次发送的deliveryTag391
发送次数390;发送内容:这是发送的内容;下一次发送的deliveryTag392
发送次数391;发送内容:这是发送的内容;下一次发送的deliveryTag393
发送次数392;发送内容:这是发送的内容;下一次发送的deliveryTag394
发送次数393;发送内容:这是发送的内容;下一次发送的deliveryTag395
发送次数394;发送内容:这是发送的内容;下一次发送的deliveryTag396
发送次数395;发送内容:这是发送的内容;下一次发送的deliveryTag397
发送次数396;发送内容:这是发送的内容;下一次发送的deliveryTag398
发送次数397;发送内容:这是发送的内容;下一次发送的deliveryTag399
发送次数398;发送内容:这是发送的内容;下一次发送的deliveryTag400
发送次数399;发送内容:这是发送的内容;下一次发送的deliveryTag401
发送次数400;发送内容:这是发送的内容;下一次发送的deliveryTag402
发送次数401;发送内容:这是发送的内容;下一次发送的deliveryTag403
发送次数402;发送内容:这是发送的内容;下一次发送的deliveryTag404
发送次数403;发送内容:这是发送的内容;下一次发送的deliveryTag405
发送次数404;发送内容:这是发送的内容;下一次发送的deliveryTag406
发送次数405;发送内容:这是发送的内容;下一次发送的deliveryTag407
发送次数406;发送内容:这是发送的内容;下一次发送的deliveryTag408
发送次数407;发送内容:这是发送的内容;下一次发送的deliveryTag409
发送次数408;发送内容:这是发送的内容;下一次发送的deliveryTag410
发送次数409;发送内容:这是发送的内容;下一次发送的deliveryTag411
发送次数410;发送内容:这是发送的内容;下一次发送的deliveryTag412
发送次数411;发送内容:这是发送的内容;下一次发送的deliveryTag413
发送次数412;发送内容:这是发送的内容;下一次发送的deliveryTag414
发送次数413;发送内容:这是发送的内容;下一次发送的deliveryTag415
发送次数414;发送内容:这是发送的内容;下一次发送的deliveryTag416
发送次数415;发送内容:这是发送的内容;下一次发送的deliveryTag417
发送次数416;发送内容:这是发送的内容;下一次发送的deliveryTag418
发送次数417;发送内容:这是发送的内容;下一次发送的deliveryTag419
发送次数418;发送内容:这是发送的内容;下一次发送的deliveryTag420
发送次数419;发送内容:这是发送的内容;下一次发送的deliveryTag421
发送次数420;发送内容:这是发送的内容;下一次发送的deliveryTag422
发送次数421;发送内容:这是发送的内容;下一次发送的deliveryTag423
发送次数422;发送内容:这是发送的内容;下一次发送的deliveryTag424
发送次数423;发送内容:这是发送的内容;下一次发送的deliveryTag425
发送次数424;发送内容:这是发送的内容;下一次发送的deliveryTag426
发送次数425;发送内容:这是发送的内容;下一次发送的deliveryTag427
发送次数426;发送内容:这是发送的内容;下一次发送的deliveryTag428
发送次数427;发送内容:这是发送的内容;下一次发送的deliveryTag429
发送次数428;发送内容:这是发送的内容;下一次发送的deliveryTag430
发送次数429;发送内容:这是发送的内容;下一次发送的deliveryTag431
发送次数430;发送内容:这是发送的内容;下一次发送的deliveryTag432
发送次数431;发送内容:这是发送的内容;下一次发送的deliveryTag433
发送次数432;发送内容:这是发送的内容;下一次发送的deliveryTag434
发送次数433;发送内容:这是发送的内容;下一次发送的deliveryTag435
发送次数434;发送内容:这是发送的内容;下一次发送的deliveryTag436
发送次数435;发送内容:这是发送的内容;下一次发送的deliveryTag437
发送次数436;发送内容:这是发送的内容;下一次发送的deliveryTag438
发送次数437;发送内容:这是发送的内容;下一次发送的deliveryTag439
发送次数438;发送内容:这是发送的内容;下一次发送的deliveryTag440
发送次数439;发送内容:这是发送的内容;下一次发送的deliveryTag441
发送次数440;发送内容:这是发送的内容;下一次发送的deliveryTag442
发送次数441;发送内容:这是发送的内容;下一次发送的deliveryTag443
发送次数442;发送内容:这是发送的内容;下一次发送的deliveryTag444
发送次数443;发送内容:这是发送的内容;下一次发送的deliveryTag445
发送次数444;发送内容:这是发送的内容;下一次发送的deliveryTag446
发送次数445;发送内容:这是发送的内容;下一次发送的deliveryTag447
发送次数446;发送内容:这是发送的内容;下一次发送的deliveryTag448
发送次数447;发送内容:这是发送的内容;下一次发送的deliveryTag449
发送次数448;发送内容:这是发送的内容;下一次发送的deliveryTag450
发送次数449;发送内容:这是发送的内容;下一次发送的deliveryTag451
发送次数450;发送内容:这是发送的内容;下一次发送的deliveryTag452
发送次数451;发送内容:这是发送的内容;下一次发送的deliveryTag453
发送次数452;发送内容:这是发送的内容;下一次发送的deliveryTag454
发送次数453;发送内容:这是发送的内容;下一次发送的deliveryTag455
发送次数454;发送内容:这是发送的内容;下一次发送的deliveryTag456
发送次数455;发送内容:这是发送的内容;下一次发送的deliveryTag457
发送次数456;发送内容:这是发送的内容;下一次发送的deliveryTag458
发送次数457;发送内容:这是发送的内容;下一次发送的deliveryTag459
发送次数458;发送内容:这是发送的内容;下一次发送的deliveryTag460
发送次数459;发送内容:这是发送的内容;下一次发送的deliveryTag461
发送次数460;发送内容:这是发送的内容;下一次发送的deliveryTag462
发送次数461;发送内容:这是发送的内容;下一次发送的deliveryTag463
发送次数462;发送内容:这是发送的内容;下一次发送的deliveryTag464
发送次数463;发送内容:这是发送的内容;下一次发送的deliveryTag465
发送次数464;发送内容:这是发送的内容;下一次发送的deliveryTag466
发送次数465;发送内容:这是发送的内容;下一次发送的deliveryTag467
发送次数466;发送内容:这是发送的内容;下一次发送的deliveryTag468
发送次数467;发送内容:这是发送的内容;下一次发送的deliveryTag469
发送次数468;发送内容:这是发送的内容;下一次发送的deliveryTag470
发送次数469;发送内容:这是发送的内容;下一次发送的deliveryTag471
发送次数470;发送内容:这是发送的内容;下一次发送的deliveryTag472
发送次数471;发送内容:这是发送的内容;下一次发送的deliveryTag473
发送次数472;发送内容:这是发送的内容;下一次发送的deliveryTag474
发送次数473;发送内容:这是发送的内容;下一次发送的deliveryTag475
发送次数474;发送内容:这是发送的内容;下一次发送的deliveryTag476
发送次数475;发送内容:这是发送的内容;下一次发送的deliveryTag477
发送次数476;发送内容:这是发送的内容;下一次发送的deliveryTag478
发送次数477;发送内容:这是发送的内容;下一次发送的deliveryTag479
发送次数478;发送内容:这是发送的内容;下一次发送的deliveryTag480
发送次数479;发送内容:这是发送的内容;下一次发送的deliveryTag481
发送次数480;发送内容:这是发送的内容;下一次发送的deliveryTag482
发送次数481;发送内容:这是发送的内容;下一次发送的deliveryTag483
发送次数482;发送内容:这是发送的内容;下一次发送的deliveryTag484
发送次数483;发送内容:这是发送的内容;下一次发送的deliveryTag485
发送次数484;发送内容:这是发送的内容;下一次发送的deliveryTag486
发送次数485;发送内容:这是发送的内容;下一次发送的deliveryTag487
发送次数486;发送内容:这是发送的内容;下一次发送的deliveryTag488
发送次数487;发送内容:这是发送的内容;下一次发送的deliveryTag489
发送次数488;发送内容:这是发送的内容;下一次发送的deliveryTag490
发送次数489;发送内容:这是发送的内容;下一次发送的deliveryTag491
发送次数490;发送内容:这是发送的内容;下一次发送的deliveryTag492
发送次数491;发送内容:这是发送的内容;下一次发送的deliveryTag493
发送次数492;发送内容:这是发送的内容;下一次发送的deliveryTag494
发送次数493;发送内容:这是发送的内容;下一次发送的deliveryTag495
发送次数494;发送内容:这是发送的内容;下一次发送的deliveryTag496
发送次数495;发送内容:这是发送的内容;下一次发送的deliveryTag497
发送次数496;发送内容:这是发送的内容;下一次发送的deliveryTag498
发送次数497;发送内容:这是发送的内容;下一次发送的deliveryTag499
发送次数498;发送内容:这是发送的内容;下一次发送的deliveryTag500
发送次数499;发送内容:这是发送的内容;下一次发送的deliveryTag501
发送次数500;发送内容:这是发送的内容;下一次发送的deliveryTag502
发送次数501;发送内容:这是发送的内容;下一次发送的deliveryTag503
发送次数502;发送内容:这是发送的内容;下一次发送的deliveryTag504
发送次数503;发送内容:这是发送的内容;下一次发送的deliveryTag505
发送次数504;发送内容:这是发送的内容;下一次发送的deliveryTag506
发送次数505;发送内容:这是发送的内容;下一次发送的deliveryTag507
发送次数506;发送内容:这是发送的内容;下一次发送的deliveryTag508
发送次数507;发送内容:这是发送的内容;下一次发送的deliveryTag509
发送次数508;发送内容:这是发送的内容;下一次发送的deliveryTag510
发送次数509;发送内容:这是发送的内容;下一次发送的deliveryTag511
发送次数510;发送内容:这是发送的内容;下一次发送的deliveryTag512
发送次数511;发送内容:这是发送的内容;下一次发送的deliveryTag513
发送次数512;发送内容:这是发送的内容;下一次发送的deliveryTag514
发送次数513;发送内容:这是发送的内容;下一次发送的deliveryTag515
发送次数514;发送内容:这是发送的内容;下一次发送的deliveryTag516
发送次数515;发送内容:这是发送的内容;下一次发送的deliveryTag517
发送次数516;发送内容:这是发送的内容;下一次发送的deliveryTag518
发送次数517;发送内容:这是发送的内容;下一次发送的deliveryTag519
发送次数518;发送内容:这是发送的内容;下一次发送的deliveryTag520
发送次数519;发送内容:这是发送的内容;下一次发送的deliveryTag521
发送次数520;发送内容:这是发送的内容;下一次发送的deliveryTag522
发送次数521;发送内容:这是发送的内容;下一次发送的deliveryTag523
发送次数522;发送内容:这是发送的内容;下一次发送的deliveryTag524
发送次数523;发送内容:这是发送的内容;下一次发送的deliveryTag525
发送次数524;发送内容:这是发送的内容;下一次发送的deliveryTag526
发送次数525;发送内容:这是发送的内容;下一次发送的deliveryTag527
发送次数526;发送内容:这是发送的内容;下一次发送的deliveryTag528
发送次数527;发送内容:这是发送的内容;下一次发送的deliveryTag529
发送次数528;发送内容:这是发送的内容;下一次发送的deliveryTag530
发送次数529;发送内容:这是发送的内容;下一次发送的deliveryTag531
发送次数530;发送内容:这是发送的内容;下一次发送的deliveryTag532
发送次数531;发送内容:这是发送的内容;下一次发送的deliveryTag533
发送次数532;发送内容:这是发送的内容;下一次发送的deliveryTag534
发送次数533;发送内容:这是发送的内容;下一次发送的deliveryTag535
发送次数534;发送内容:这是发送的内容;下一次发送的deliveryTag536
发送次数535;发送内容:这是发送的内容;下一次发送的deliveryTag537
发送次数536;发送内容:这是发送的内容;下一次发送的deliveryTag538
发送次数537;发送内容:这是发送的内容;下一次发送的deliveryTag539
发送次数538;发送内容:这是发送的内容;下一次发送的deliveryTag540
发送次数539;发送内容:这是发送的内容;下一次发送的deliveryTag541
发送次数540;发送内容:这是发送的内容;下一次发送的deliveryTag542
发送次数541;发送内容:这是发送的内容;下一次发送的deliveryTag543
发送次数542;发送内容:这是发送的内容;下一次发送的deliveryTag544
发送次数543;发送内容:这是发送的内容;下一次发送的deliveryTag545
发送次数544;发送内容:这是发送的内容;下一次发送的deliveryTag546
发送次数545;发送内容:这是发送的内容;下一次发送的deliveryTag547
发送次数546;发送内容:这是发送的内容;下一次发送的deliveryTag548
发送次数547;发送内容:这是发送的内容;下一次发送的deliveryTag549
发送次数548;发送内容:这是发送的内容;下一次发送的deliveryTag550
发送次数549;发送内容:这是发送的内容;下一次发送的deliveryTag551
发送次数550;发送内容:这是发送的内容;下一次发送的deliveryTag552
发送次数551;发送内容:这是发送的内容;下一次发送的deliveryTag553
发送次数552;发送内容:这是发送的内容;下一次发送的deliveryTag554
发送次数553;发送内容:这是发送的内容;下一次发送的deliveryTag555
发送次数554;发送内容:这是发送的内容;下一次发送的deliveryTag556
发送次数555;发送内容:这是发送的内容;下一次发送的deliveryTag557
发送次数556;发送内容:这是发送的内容;下一次发送的deliveryTag558
发送次数557;发送内容:这是发送的内容;下一次发送的deliveryTag559
发送次数558;发送内容:这是发送的内容;下一次发送的deliveryTag560
发送次数559;发送内容:这是发送的内容;下一次发送的deliveryTag561
发送次数560;发送内容:这是发送的内容;下一次发送的deliveryTag562
发送次数561;发送内容:这是发送的内容;下一次发送的deliveryTag563
发送次数562;发送内容:这是发送的内容;下一次发送的deliveryTag564
发送次数563;发送内容:这是发送的内容;下一次发送的deliveryTag565
发送次数564;发送内容:这是发送的内容;下一次发送的deliveryTag566
发送次数565;发送内容:这是发送的内容;下一次发送的deliveryTag567
发送次数566;发送内容:这是发送的内容;下一次发送的deliveryTag568
发送次数567;发送内容:这是发送的内容;下一次发送的deliveryTag569
发送次数568;发送内容:这是发送的内容;下一次发送的deliveryTag570
发送次数569;发送内容:这是发送的内容;下一次发送的deliveryTag571
发送次数570;发送内容:这是发送的内容;下一次发送的deliveryTag572
发送次数571;发送内容:这是发送的内容;下一次发送的deliveryTag573
发送次数572;发送内容:这是发送的内容;下一次发送的deliveryTag574
发送次数573;发送内容:这是发送的内容;下一次发送的deliveryTag575
发送次数574;发送内容:这是发送的内容;下一次发送的deliveryTag576
发送次数575;发送内容:这是发送的内容;下一次发送的deliveryTag577
发送次数576;发送内容:这是发送的内容;下一次发送的deliveryTag578
发送次数577;发送内容:这是发送的内容;下一次发送的deliveryTag579
发送次数578;发送内容:这是发送的内容;下一次发送的deliveryTag580
发送次数579;发送内容:这是发送的内容;下一次发送的deliveryTag581
发送次数580;发送内容:这是发送的内容;下一次发送的deliveryTag582
发送次数581;发送内容:这是发送的内容;下一次发送的deliveryTag583
发送次数582;发送内容:这是发送的内容;下一次发送的deliveryTag584
发送次数583;发送内容:这是发送的内容;下一次发送的deliveryTag585
发送次数584;发送内容:这是发送的内容;下一次发送的deliveryTag586
发送次数585;发送内容:这是发送的内容;下一次发送的deliveryTag587
发送次数586;发送内容:这是发送的内容;下一次发送的deliveryTag588
发送次数587;发送内容:这是发送的内容;下一次发送的deliveryTag589
发送次数588;发送内容:这是发送的内容;下一次发送的deliveryTag590
发送次数589;发送内容:这是发送的内容;下一次发送的deliveryTag591
发送次数590;发送内容:这是发送的内容;下一次发送的deliveryTag592
发送次数591;发送内容:这是发送的内容;下一次发送的deliveryTag593
发送次数592;发送内容:这是发送的内容;下一次发送的deliveryTag594
发送次数593;发送内容:这是发送的内容;下一次发送的deliveryTag595
发送次数594;发送内容:这是发送的内容;下一次发送的deliveryTag596
发送次数595;发送内容:这是发送的内容;下一次发送的deliveryTag597
发送次数596;发送内容:这是发送的内容;下一次发送的deliveryTag598
发送次数597;发送内容:这是发送的内容;下一次发送的deliveryTag599
发送次数598;发送内容:这是发送的内容;下一次发送的deliveryTag600
发送次数599;发送内容:这是发送的内容;下一次发送的deliveryTag601
发送次数600;发送内容:这是发送的内容;下一次发送的deliveryTag602
发送次数601;发送内容:这是发送的内容;下一次发送的deliveryTag603
发送次数602;发送内容:这是发送的内容;下一次发送的deliveryTag604
发送次数603;发送内容:这是发送的内容;下一次发送的deliveryTag605
发送次数604;发送内容:这是发送的内容;下一次发送的deliveryTag606
发送次数605;发送内容:这是发送的内容;下一次发送的deliveryTag607
发送次数606;发送内容:这是发送的内容;下一次发送的deliveryTag608
发送次数607;发送内容:这是发送的内容;下一次发送的deliveryTag609
发送次数608;发送内容:这是发送的内容;下一次发送的deliveryTag610
发送次数609;发送内容:这是发送的内容;下一次发送的deliveryTag611
发送次数610;发送内容:这是发送的内容;下一次发送的deliveryTag612
发送次数611;发送内容:这是发送的内容;下一次发送的deliveryTag613
发送次数612;发送内容:这是发送的内容;下一次发送的deliveryTag614
发送次数613;发送内容:这是发送的内容;下一次发送的deliveryTag615
发送次数614;发送内容:这是发送的内容;下一次发送的deliveryTag616
发送次数615;发送内容:这是发送的内容;下一次发送的deliveryTag617
发送次数616;发送内容:这是发送的内容;下一次发送的deliveryTag618
发送次数617;发送内容:这是发送的内容;下一次发送的deliveryTag619
发送次数618;发送内容:这是发送的内容;下一次发送的deliveryTag620
发送次数619;发送内容:这是发送的内容;下一次发送的deliveryTag621
发送次数620;发送内容:这是发送的内容;下一次发送的deliveryTag622
发送次数621;发送内容:这是发送的内容;下一次发送的deliveryTag623
发送次数622;发送内容:这是发送的内容;下一次发送的deliveryTag624
发送次数623;发送内容:这是发送的内容;下一次发送的deliveryTag625
发送次数624;发送内容:这是发送的内容;下一次发送的deliveryTag626
发送次数625;发送内容:这是发送的内容;下一次发送的deliveryTag627
发送次数626;发送内容:这是发送的内容;下一次发送的deliveryTag628
发送次数627;发送内容:这是发送的内容;下一次发送的deliveryTag629
发送次数628;发送内容:这是发送的内容;下一次发送的deliveryTag630
发送次数629;发送内容:这是发送的内容;下一次发送的deliveryTag631
发送次数630;发送内容:这是发送的内容;下一次发送的deliveryTag632
发送次数631;发送内容:这是发送的内容;下一次发送的deliveryTag633
发送次数632;发送内容:这是发送的内容;下一次发送的deliveryTag634
发送次数633;发送内容:这是发送的内容;下一次发送的deliveryTag635
发送次数634;发送内容:这是发送的内容;下一次发送的deliveryTag636
发送次数635;发送内容:这是发送的内容;下一次发送的deliveryTag637
发送次数636;发送内容:这是发送的内容;下一次发送的deliveryTag638
发送次数637;发送内容:这是发送的内容;下一次发送的deliveryTag639
发送次数638;发送内容:这是发送的内容;下一次发送的deliveryTag640
发送次数639;发送内容:这是发送的内容;下一次发送的deliveryTag641
发送次数640;发送内容:这是发送的内容;下一次发送的deliveryTag642
发送次数641;发送内容:这是发送的内容;下一次发送的deliveryTag643
发送次数642;发送内容:这是发送的内容;下一次发送的deliveryTag644
发送次数643;发送内容:这是发送的内容;下一次发送的deliveryTag645
发送次数644;发送内容:这是发送的内容;下一次发送的deliveryTag646
发送次数645;发送内容:这是发送的内容;下一次发送的deliveryTag647
发送次数646;发送内容:这是发送的内容;下一次发送的deliveryTag648
发送次数647;发送内容:这是发送的内容;下一次发送的deliveryTag649
发送次数648;发送内容:这是发送的内容;下一次发送的deliveryTag650
发送次数649;发送内容:这是发送的内容;下一次发送的deliveryTag651
发送次数650;发送内容:这是发送的内容;下一次发送的deliveryTag652
发送次数651;发送内容:这是发送的内容;下一次发送的deliveryTag653
发送次数652;发送内容:这是发送的内容;下一次发送的deliveryTag654
发送次数653;发送内容:这是发送的内容;下一次发送的deliveryTag655
发送次数654;发送内容:这是发送的内容;下一次发送的deliveryTag656
发送次数655;发送内容:这是发送的内容;下一次发送的deliveryTag657
发送次数656;发送内容:这是发送的内容;下一次发送的deliveryTag658
发送次数657;发送内容:这是发送的内容;下一次发送的deliveryTag659
发送次数658;发送内容:这是发送的内容;下一次发送的deliveryTag660
发送次数659;发送内容:这是发送的内容;下一次发送的deliveryTag661
发送次数660;发送内容:这是发送的内容;下一次发送的deliveryTag662
发送次数661;发送内容:这是发送的内容;下一次发送的deliveryTag663
发送次数662;发送内容:这是发送的内容;下一次发送的deliveryTag664
发送次数663;发送内容:这是发送的内容;下一次发送的deliveryTag665
发送次数664;发送内容:这是发送的内容;下一次发送的deliveryTag666
发送次数665;发送内容:这是发送的内容;下一次发送的deliveryTag667
发送次数666;发送内容:这是发送的内容;下一次发送的deliveryTag668
发送次数667;发送内容:这是发送的内容;下一次发送的deliveryTag669
发送次数668;发送内容:这是发送的内容;下一次发送的deliveryTag670
发送次数669;发送内容:这是发送的内容;下一次发送的deliveryTag671
发送次数670;发送内容:这是发送的内容;下一次发送的deliveryTag672
发送次数671;发送内容:这是发送的内容;下一次发送的deliveryTag673
发送次数672;发送内容:这是发送的内容;下一次发送的deliveryTag674
发送次数673;发送内容:这是发送的内容;下一次发送的deliveryTag675
发送次数674;发送内容:这是发送的内容;下一次发送的deliveryTag676
发送次数675;发送内容:这是发送的内容;下一次发送的deliveryTag677
发送次数676;发送内容:这是发送的内容;下一次发送的deliveryTag678
发送次数677;发送内容:这是发送的内容;下一次发送的deliveryTag679
发送次数678;发送内容:这是发送的内容;下一次发送的deliveryTag680
发送次数679;发送内容:这是发送的内容;下一次发送的deliveryTag681
发送次数680;发送内容:这是发送的内容;下一次发送的deliveryTag682
发送次数681;发送内容:这是发送的内容;下一次发送的deliveryTag683
发送次数682;发送内容:这是发送的内容;下一次发送的deliveryTag684
发送次数683;发送内容:这是发送的内容;下一次发送的deliveryTag685
发送次数684;发送内容:这是发送的内容;下一次发送的deliveryTag686
发送次数685;发送内容:这是发送的内容;下一次发送的deliveryTag687
发送次数686;发送内容:这是发送的内容;下一次发送的deliveryTag688
发送次数687;发送内容:这是发送的内容;下一次发送的deliveryTag689
发送次数688;发送内容:这是发送的内容;下一次发送的deliveryTag690
发送次数689;发送内容:这是发送的内容;下一次发送的deliveryTag691
发送次数690;发送内容:这是发送的内容;下一次发送的deliveryTag692
发送次数691;发送内容:这是发送的内容;下一次发送的deliveryTag693
发送次数692;发送内容:这是发送的内容;下一次发送的deliveryTag694
发送次数693;发送内容:这是发送的内容;下一次发送的deliveryTag695
发送次数694;发送内容:这是发送的内容;下一次发送的deliveryTag696
发送次数695;发送内容:这是发送的内容;下一次发送的deliveryTag697
发送次数696;发送内容:这是发送的内容;下一次发送的deliveryTag698
发送次数697;发送内容:这是发送的内容;下一次发送的deliveryTag699
发送次数698;发送内容:这是发送的内容;下一次发送的deliveryTag700
发送次数699;发送内容:这是发送的内容;下一次发送的deliveryTag701
发送次数700;发送内容:这是发送的内容;下一次发送的deliveryTag702
发送次数701;发送内容:这是发送的内容;下一次发送的deliveryTag703
发送次数702;发送内容:这是发送的内容;下一次发送的deliveryTag704
发送次数703;发送内容:这是发送的内容;下一次发送的deliveryTag705
发送次数704;发送内容:这是发送的内容;下一次发送的deliveryTag706
发送次数705;发送内容:这是发送的内容;下一次发送的deliveryTag707
发送次数706;发送内容:这是发送的内容;下一次发送的deliveryTag708
发送次数707;发送内容:这是发送的内容;下一次发送的deliveryTag709
发送次数708;发送内容:这是发送的内容;下一次发送的deliveryTag710
发送次数709;发送内容:这是发送的内容;下一次发送的deliveryTag711
发送次数710;发送内容:这是发送的内容;下一次发送的deliveryTag712
发送次数711;发送内容:这是发送的内容;下一次发送的deliveryTag713
发送次数712;发送内容:这是发送的内容;下一次发送的deliveryTag714
发送次数713;发送内容:这是发送的内容;下一次发送的deliveryTag715
发送次数714;发送内容:这是发送的内容;下一次发送的deliveryTag716
发送次数715;发送内容:这是发送的内容;下一次发送的deliveryTag717
发送次数716;发送内容:这是发送的内容;下一次发送的deliveryTag718
发送次数717;发送内容:这是发送的内容;下一次发送的deliveryTag719
发送次数718;发送内容:这是发送的内容;下一次发送的deliveryTag720
发送次数719;发送内容:这是发送的内容;下一次发送的deliveryTag721
发送次数720;发送内容:这是发送的内容;下一次发送的deliveryTag722
发送次数721;发送内容:这是发送的内容;下一次发送的deliveryTag723
发送次数722;发送内容:这是发送的内容;下一次发送的deliveryTag724
发送次数723;发送内容:这是发送的内容;下一次发送的deliveryTag725
发送次数724;发送内容:这是发送的内容;下一次发送的deliveryTag726
发送次数725;发送内容:这是发送的内容;下一次发送的deliveryTag727
发送次数726;发送内容:这是发送的内容;下一次发送的deliveryTag728
发送次数727;发送内容:这是发送的内容;下一次发送的deliveryTag729
发送次数728;发送内容:这是发送的内容;下一次发送的deliveryTag730
发送次数729;发送内容:这是发送的内容;下一次发送的deliveryTag731
发送次数730;发送内容:这是发送的内容;下一次发送的deliveryTag732
发送次数731;发送内容:这是发送的内容;下一次发送的deliveryTag733
发送次数732;发送内容:这是发送的内容;下一次发送的deliveryTag734
发送次数733;发送内容:这是发送的内容;下一次发送的deliveryTag735
发送次数734;发送内容:这是发送的内容;下一次发送的deliveryTag736
发送次数735;发送内容:这是发送的内容;下一次发送的deliveryTag737
发送次数736;发送内容:这是发送的内容;下一次发送的deliveryTag738
发送次数737;发送内容:这是发送的内容;下一次发送的deliveryTag739
发送次数738;发送内容:这是发送的内容;下一次发送的deliveryTag740
发送次数739;发送内容:这是发送的内容;下一次发送的deliveryTag741
发送次数740;发送内容:这是发送的内容;下一次发送的deliveryTag742
发送次数741;发送内容:这是发送的内容;下一次发送的deliveryTag743
发送次数742;发送内容:这是发送的内容;下一次发送的deliveryTag744
发送次数743;发送内容:这是发送的内容;下一次发送的deliveryTag745
发送次数744;发送内容:这是发送的内容;下一次发送的deliveryTag746
发送次数745;发送内容:这是发送的内容;下一次发送的deliveryTag747
发送次数746;发送内容:这是发送的内容;下一次发送的deliveryTag748
发送次数747;发送内容:这是发送的内容;下一次发送的deliveryTag749
发送次数748;发送内容:这是发送的内容;下一次发送的deliveryTag750
发送次数749;发送内容:这是发送的内容;下一次发送的deliveryTag751
发送次数750;发送内容:这是发送的内容;下一次发送的deliveryTag752
发送次数751;发送内容:这是发送的内容;下一次发送的deliveryTag753
发送次数752;发送内容:这是发送的内容;下一次发送的deliveryTag754
发送次数753;发送内容:这是发送的内容;下一次发送的deliveryTag755
发送次数754;发送内容:这是发送的内容;下一次发送的deliveryTag756
发送次数755;发送内容:这是发送的内容;下一次发送的deliveryTag757
发送次数756;发送内容:这是发送的内容;下一次发送的deliveryTag758
发送次数757;发送内容:这是发送的内容;下一次发送的deliveryTag759
发送次数758;发送内容:这是发送的内容;下一次发送的deliveryTag760
发送次数759;发送内容:这是发送的内容;下一次发送的deliveryTag761
发送次数760;发送内容:这是发送的内容;下一次发送的deliveryTag762
发送次数761;发送内容:这是发送的内容;下一次发送的deliveryTag763
发送次数762;发送内容:这是发送的内容;下一次发送的deliveryTag764
发送次数763;发送内容:这是发送的内容;下一次发送的deliveryTag765
发送次数764;发送内容:这是发送的内容;下一次发送的deliveryTag766
发送次数765;发送内容:这是发送的内容;下一次发送的deliveryTag767
发送次数766;发送内容:这是发送的内容;下一次发送的deliveryTag768
发送次数767;发送内容:这是发送的内容;下一次发送的deliveryTag769
发送次数768;发送内容:这是发送的内容;下一次发送的deliveryTag770
发送次数769;发送内容:这是发送的内容;下一次发送的deliveryTag771
发送次数770;发送内容:这是发送的内容;下一次发送的deliveryTag772
发送次数771;发送内容:这是发送的内容;下一次发送的deliveryTag773
发送次数772;发送内容:这是发送的内容;下一次发送的deliveryTag774
发送次数773;发送内容:这是发送的内容;下一次发送的deliveryTag775
发送次数774;发送内容:这是发送的内容;下一次发送的deliveryTag776
发送次数775;发送内容:这是发送的内容;下一次发送的deliveryTag777
发送次数776;发送内容:这是发送的内容;下一次发送的deliveryTag778
发送次数777;发送内容:这是发送的内容;下一次发送的deliveryTag779
发送次数778;发送内容:这是发送的内容;下一次发送的deliveryTag780
发送次数779;发送内容:这是发送的内容;下一次发送的deliveryTag781
发送次数780;发送内容:这是发送的内容;下一次发送的deliveryTag782
发送次数781;发送内容:这是发送的内容;下一次发送的deliveryTag783
发送次数782;发送内容:这是发送的内容;下一次发送的deliveryTag784
发送次数783;发送内容:这是发送的内容;下一次发送的deliveryTag785
发送次数784;发送内容:这是发送的内容;下一次发送的deliveryTag786
发送次数785;发送内容:这是发送的内容;下一次发送的deliveryTag787
发送次数786;发送内容:这是发送的内容;下一次发送的deliveryTag788
发送次数787;发送内容:这是发送的内容;下一次发送的deliveryTag789
发送次数788;发送内容:这是发送的内容;下一次发送的deliveryTag790
发送次数789;发送内容:这是发送的内容;下一次发送的deliveryTag791
发送次数790;发送内容:这是发送的内容;下一次发送的deliveryTag792
发送次数791;发送内容:这是发送的内容;下一次发送的deliveryTag793
发送次数792;发送内容:这是发送的内容;下一次发送的deliveryTag794
发送次数793;发送内容:这是发送的内容;下一次发送的deliveryTag795
发送次数794;发送内容:这是发送的内容;下一次发送的deliveryTag796
发送次数795;发送内容:这是发送的内容;下一次发送的deliveryTag797
发送次数796;发送内容:这是发送的内容;下一次发送的deliveryTag798
发送次数797;发送内容:这是发送的内容;下一次发送的deliveryTag799
发送次数798;发送内容:这是发送的内容;下一次发送的deliveryTag800
发送次数799;发送内容:这是发送的内容;下一次发送的deliveryTag801
发送次数800;发送内容:这是发送的内容;下一次发送的deliveryTag802
发送次数801;发送内容:这是发送的内容;下一次发送的deliveryTag803
发送次数802;发送内容:这是发送的内容;下一次发送的deliveryTag804
发送次数803;发送内容:这是发送的内容;下一次发送的deliveryTag805
发送次数804;发送内容:这是发送的内容;下一次发送的deliveryTag806
发送次数805;发送内容:这是发送的内容;下一次发送的deliveryTag807
发送次数806;发送内容:这是发送的内容;下一次发送的deliveryTag808
发送次数807;发送内容:这是发送的内容;下一次发送的deliveryTag809
发送次数808;发送内容:这是发送的内容;下一次发送的deliveryTag810
发送次数809;发送内容:这是发送的内容;下一次发送的deliveryTag811
发送次数810;发送内容:这是发送的内容;下一次发送的deliveryTag812
发送次数811;发送内容:这是发送的内容;下一次发送的deliveryTag813
发送次数812;发送内容:这是发送的内容;下一次发送的deliveryTag814
发送次数813;发送内容:这是发送的内容;下一次发送的deliveryTag815
发送次数814;发送内容:这是发送的内容;下一次发送的deliveryTag816
发送次数815;发送内容:这是发送的内容;下一次发送的deliveryTag817
发送次数816;发送内容:这是发送的内容;下一次发送的deliveryTag818
发送次数817;发送内容:这是发送的内容;下一次发送的deliveryTag819
发送次数818;发送内容:这是发送的内容;下一次发送的deliveryTag820
发送次数819;发送内容:这是发送的内容;下一次发送的deliveryTag821
发送次数820;发送内容:这是发送的内容;下一次发送的deliveryTag822
发送次数821;发送内容:这是发送的内容;下一次发送的deliveryTag823
发送次数822;发送内容:这是发送的内容;下一次发送的deliveryTag824
发送次数823;发送内容:这是发送的内容;下一次发送的deliveryTag825
发送次数824;发送内容:这是发送的内容;下一次发送的deliveryTag826
发送次数825;发送内容:这是发送的内容;下一次发送的deliveryTag827
发送次数826;发送内容:这是发送的内容;下一次发送的deliveryTag828
发送次数827;发送内容:这是发送的内容;下一次发送的deliveryTag829
发送次数828;发送内容:这是发送的内容;下一次发送的deliveryTag830
发送次数829;发送内容:这是发送的内容;下一次发送的deliveryTag831
发送次数830;发送内容:这是发送的内容;下一次发送的deliveryTag832
发送次数831;发送内容:这是发送的内容;下一次发送的deliveryTag833
发送次数832;发送内容:这是发送的内容;下一次发送的deliveryTag834
发送次数833;发送内容:这是发送的内容;下一次发送的deliveryTag835
发送次数834;发送内容:这是发送的内容;下一次发送的deliveryTag836
发送次数835;发送内容:这是发送的内容;下一次发送的deliveryTag837
发送次数836;发送内容:这是发送的内容;下一次发送的deliveryTag838
发送次数837;发送内容:这是发送的内容;下一次发送的deliveryTag839
发送次数838;发送内容:这是发送的内容;下一次发送的deliveryTag840
发送次数839;发送内容:这是发送的内容;下一次发送的deliveryTag841
发送次数840;发送内容:这是发送的内容;下一次发送的deliveryTag842
发送次数841;发送内容:这是发送的内容;下一次发送的deliveryTag843
发送次数842;发送内容:这是发送的内容;下一次发送的deliveryTag844
发送次数843;发送内容:这是发送的内容;下一次发送的deliveryTag845
发送次数844;发送内容:这是发送的内容;下一次发送的deliveryTag846
发送次数845;发送内容:这是发送的内容;下一次发送的deliveryTag847
发送次数846;发送内容:这是发送的内容;下一次发送的deliveryTag848
发送次数847;发送内容:这是发送的内容;下一次发送的deliveryTag849
发送次数848;发送内容:这是发送的内容;下一次发送的deliveryTag850
发送次数849;发送内容:这是发送的内容;下一次发送的deliveryTag851
发送次数850;发送内容:这是发送的内容;下一次发送的deliveryTag852
发送次数851;发送内容:这是发送的内容;下一次发送的deliveryTag853
发送次数852;发送内容:这是发送的内容;下一次发送的deliveryTag854
发送次数853;发送内容:这是发送的内容;下一次发送的deliveryTag855
发送次数854;发送内容:这是发送的内容;下一次发送的deliveryTag856
发送次数855;发送内容:这是发送的内容;下一次发送的deliveryTag857
发送次数856;发送内容:这是发送的内容;下一次发送的deliveryTag858
发送次数857;发送内容:这是发送的内容;下一次发送的deliveryTag859
发送次数858;发送内容:这是发送的内容;下一次发送的deliveryTag860
发送次数859;发送内容:这是发送的内容;下一次发送的deliveryTag861
发送次数860;发送内容:这是发送的内容;下一次发送的deliveryTag862
发送次数861;发送内容:这是发送的内容;下一次发送的deliveryTag863
发送次数862;发送内容:这是发送的内容;下一次发送的deliveryTag864
发送次数863;发送内容:这是发送的内容;下一次发送的deliveryTag865
发送次数864;发送内容:这是发送的内容;下一次发送的deliveryTag866
发送次数865;发送内容:这是发送的内容;下一次发送的deliveryTag867
发送次数866;发送内容:这是发送的内容;下一次发送的deliveryTag868
发送次数867;发送内容:这是发送的内容;下一次发送的deliveryTag869
发送次数868;发送内容:这是发送的内容;下一次发送的deliveryTag870
发送次数869;发送内容:这是发送的内容;下一次发送的deliveryTag871
发送次数870;发送内容:这是发送的内容;下一次发送的deliveryTag872
发送次数871;发送内容:这是发送的内容;下一次发送的deliveryTag873
发送次数872;发送内容:这是发送的内容;下一次发送的deliveryTag874
发送次数873;发送内容:这是发送的内容;下一次发送的deliveryTag875
发送次数874;发送内容:这是发送的内容;下一次发送的deliveryTag876
发送次数875;发送内容:这是发送的内容;下一次发送的deliveryTag877
发送次数876;发送内容:这是发送的内容;下一次发送的deliveryTag878
发送次数877;发送内容:这是发送的内容;下一次发送的deliveryTag879
发送次数878;发送内容:这是发送的内容;下一次发送的deliveryTag880
发送次数879;发送内容:这是发送的内容;下一次发送的deliveryTag881
发送次数880;发送内容:这是发送的内容;下一次发送的deliveryTag882
发送次数881;发送内容:这是发送的内容;下一次发送的deliveryTag883
发送次数882;发送内容:这是发送的内容;下一次发送的deliveryTag884
发送次数883;发送内容:这是发送的内容;下一次发送的deliveryTag885
发送次数884;发送内容:这是发送的内容;下一次发送的deliveryTag886
发送次数885;发送内容:这是发送的内容;下一次发送的deliveryTag887
发送次数886;发送内容:这是发送的内容;下一次发送的deliveryTag888
发送次数887;发送内容:这是发送的内容;下一次发送的deliveryTag889
发送次数888;发送内容:这是发送的内容;下一次发送的deliveryTag890
发送次数889;发送内容:这是发送的内容;下一次发送的deliveryTag891
发送次数890;发送内容:这是发送的内容;下一次发送的deliveryTag892
发送次数891;发送内容:这是发送的内容;下一次发送的deliveryTag893
发送次数892;发送内容:这是发送的内容;下一次发送的deliveryTag894
发送次数893;发送内容:这是发送的内容;下一次发送的deliveryTag895
发送次数894;发送内容:这是发送的内容;下一次发送的deliveryTag896
发送次数895;发送内容:这是发送的内容;下一次发送的deliveryTag897
发送次数896;发送内容:这是发送的内容;下一次发送的deliveryTag898
发送次数897;发送内容:这是发送的内容;下一次发送的deliveryTag899
发送次数898;发送内容:这是发送的内容;下一次发送的deliveryTag900
发送次数899;发送内容:这是发送的内容;下一次发送的deliveryTag901
发送次数900;发送内容:这是发送的内容;下一次发送的deliveryTag902
发送次数901;发送内容:这是发送的内容;下一次发送的deliveryTag903
发送次数902;发送内容:这是发送的内容;下一次发送的deliveryTag904
发送次数903;发送内容:这是发送的内容;下一次发送的deliveryTag905
发送次数904;发送内容:这是发送的内容;下一次发送的deliveryTag906
发送次数905;发送内容:这是发送的内容;下一次发送的deliveryTag907
发送次数906;发送内容:这是发送的内容;下一次发送的deliveryTag908
发送次数907;发送内容:这是发送的内容;下一次发送的deliveryTag909
发送次数908;发送内容:这是发送的内容;下一次发送的deliveryTag910
发送次数909;发送内容:这是发送的内容;下一次发送的deliveryTag911
发送次数910;发送内容:这是发送的内容;下一次发送的deliveryTag912
发送次数911;发送内容:这是发送的内容;下一次发送的deliveryTag913
发送次数912;发送内容:这是发送的内容;下一次发送的deliveryTag914
发送次数913;发送内容:这是发送的内容;下一次发送的deliveryTag915
发送次数914;发送内容:这是发送的内容;下一次发送的deliveryTag916
发送次数915;发送内容:这是发送的内容;下一次发送的deliveryTag917
发送次数916;发送内容:这是发送的内容;下一次发送的deliveryTag918
发送次数917;发送内容:这是发送的内容;下一次发送的deliveryTag919
发送次数918;发送内容:这是发送的内容;下一次发送的deliveryTag920
发送次数919;发送内容:这是发送的内容;下一次发送的deliveryTag921
发送次数920;发送内容:这是发送的内容;下一次发送的deliveryTag922
发送次数921;发送内容:这是发送的内容;下一次发送的deliveryTag923
发送次数922;发送内容:这是发送的内容;下一次发送的deliveryTag924
发送次数923;发送内容:这是发送的内容;下一次发送的deliveryTag925
发送次数924;发送内容:这是发送的内容;下一次发送的deliveryTag926
发送次数925;发送内容:这是发送的内容;下一次发送的deliveryTag927
发送次数926;发送内容:这是发送的内容;下一次发送的deliveryTag928
发送次数927;发送内容:这是发送的内容;下一次发送的deliveryTag929
发送次数928;发送内容:这是发送的内容;下一次发送的deliveryTag930
发送次数929;发送内容:这是发送的内容;下一次发送的deliveryTag931
发送次数930;发送内容:这是发送的内容;下一次发送的deliveryTag932
发送次数931;发送内容:这是发送的内容;下一次发送的deliveryTag933
发送次数932;发送内容:这是发送的内容;下一次发送的deliveryTag934
发送次数933;发送内容:这是发送的内容;下一次发送的deliveryTag935
发送次数934;发送内容:这是发送的内容;下一次发送的deliveryTag936
发送次数935;发送内容:这是发送的内容;下一次发送的deliveryTag937
发送次数936;发送内容:这是发送的内容;下一次发送的deliveryTag938
发送次数937;发送内容:这是发送的内容;下一次发送的deliveryTag939
发送次数938;发送内容:这是发送的内容;下一次发送的deliveryTag940
发送次数939;发送内容:这是发送的内容;下一次发送的deliveryTag941
发送次数940;发送内容:这是发送的内容;下一次发送的deliveryTag942
发送次数941;发送内容:这是发送的内容;下一次发送的deliveryTag943
发送次数942;发送内容:这是发送的内容;下一次发送的deliveryTag944
发送次数943;发送内容:这是发送的内容;下一次发送的deliveryTag945
发送次数944;发送内容:这是发送的内容;下一次发送的deliveryTag946
发送次数945;发送内容:这是发送的内容;下一次发送的deliveryTag947
发送次数946;发送内容:这是发送的内容;下一次发送的deliveryTag948
发送次数947;发送内容:这是发送的内容;下一次发送的deliveryTag949
发送次数948;发送内容:这是发送的内容;下一次发送的deliveryTag950
发送次数949;发送内容:这是发送的内容;下一次发送的deliveryTag951
发送次数950;发送内容:这是发送的内容;下一次发送的deliveryTag952
发送次数951;发送内容:这是发送的内容;下一次发送的deliveryTag953
发送次数952;发送内容:这是发送的内容;下一次发送的deliveryTag954
发送次数953;发送内容:这是发送的内容;下一次发送的deliveryTag955
发送次数954;发送内容:这是发送的内容;下一次发送的deliveryTag956
发送次数955;发送内容:这是发送的内容;下一次发送的deliveryTag957
发送次数956;发送内容:这是发送的内容;下一次发送的deliveryTag958
发送次数957;发送内容:这是发送的内容;下一次发送的deliveryTag959
发送次数958;发送内容:这是发送的内容;下一次发送的deliveryTag960
发送次数959;发送内容:这是发送的内容;下一次发送的deliveryTag961
发送次数960;发送内容:这是发送的内容;下一次发送的deliveryTag962
发送次数961;发送内容:这是发送的内容;下一次发送的deliveryTag963
发送次数962;发送内容:这是发送的内容;下一次发送的deliveryTag964
发送次数963;发送内容:这是发送的内容;下一次发送的deliveryTag965
发送次数964;发送内容:这是发送的内容;下一次发送的deliveryTag966
发送次数965;发送内容:这是发送的内容;下一次发送的deliveryTag967
发送次数966;发送内容:这是发送的内容;下一次发送的deliveryTag968
发送次数967;发送内容:这是发送的内容;下一次发送的deliveryTag969
发送次数968;发送内容:这是发送的内容;下一次发送的deliveryTag970
发送次数969;发送内容:这是发送的内容;下一次发送的deliveryTag971
发送次数970;发送内容:这是发送的内容;下一次发送的deliveryTag972
发送次数971;发送内容:这是发送的内容;下一次发送的deliveryTag973
发送次数972;发送内容:这是发送的内容;下一次发送的deliveryTag974
发送次数973;发送内容:这是发送的内容;下一次发送的deliveryTag975
发送次数974;发送内容:这是发送的内容;下一次发送的deliveryTag976
发送次数975;发送内容:这是发送的内容;下一次发送的deliveryTag977
发送次数976;发送内容:这是发送的内容;下一次发送的deliveryTag978
发送次数977;发送内容:这是发送的内容;下一次发送的deliveryTag979
发送次数978;发送内容:这是发送的内容;下一次发送的deliveryTag980
发送次数979;发送内容:这是发送的内容;下一次发送的deliveryTag981
发送次数980;发送内容:这是发送的内容;下一次发送的deliveryTag982
发送次数981;发送内容:这是发送的内容;下一次发送的deliveryTag983
发送次数982;发送内容:这是发送的内容;下一次发送的deliveryTag984
发送次数983;发送内容:这是发送的内容;下一次发送的deliveryTag985
发送次数984;发送内容:这是发送的内容;下一次发送的deliveryTag986
发送次数985;发送内容:这是发送的内容;下一次发送的deliveryTag987
发送次数986;发送内容:这是发送的内容;下一次发送的deliveryTag988
发送次数987;发送内容:这是发送的内容;下一次发送的deliveryTag989
发送次数988;发送内容:这是发送的内容;下一次发送的deliveryTag990
发送次数989;发送内容:这是发送的内容;下一次发送的deliveryTag991
发送次数990;发送内容:这是发送的内容;下一次发送的deliveryTag992
发送次数991;发送内容:这是发送的内容;下一次发送的deliveryTag993
发送次数992;发送内容:这是发送的内容;下一次发送的deliveryTag994
发送次数993;发送内容:这是发送的内容;下一次发送的deliveryTag995
发送次数994;发送内容:这是发送的内容;下一次发送的deliveryTag996
发送次数995;发送内容:这是发送的内容;下一次发送的deliveryTag997
发送次数996;发送内容:这是发送的内容;下一次发送的deliveryTag998
发送次数997;发送内容:这是发送的内容;下一次发送的deliveryTag999
发送次数998;发送内容:这是发送的内容;下一次发送的deliveryTag1000
发送次数999;发送内容:这是发送的内容;下一次发送的deliveryTag1001
17:40:04.480 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:34,监听器收到的总次数:4
17:40:04.484 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:42,监听器收到的总次数:5
17:40:04.487 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:45,监听器收到的总次数:6
17:40:04.497 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:50,监听器收到的总次数:7
17:40:04.497 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:53,监听器收到的总次数:8
17:40:04.501 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:58,监听器收到的总次数:9
17:40:04.505 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:73,监听器收到的总次数:10
17:40:04.506 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:77,监听器收到的总次数:11
17:40:04.517 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:82,监听器收到的总次数:12
17:40:04.521 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:93,监听器收到的总次数:13
17:40:04.524 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:97,监听器收到的总次数:14
17:40:04.532 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:106,监听器收到的总次数:15
17:40:04.536 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:119,监听器收到的总次数:16
17:40:04.537 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:124,监听器收到的总次数:17
17:40:04.543 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:130,监听器收到的总次数:18
17:40:04.551 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:135,监听器收到的总次数:19
17:40:04.553 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:140,监听器收到的总次数:20
17:40:04.569 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:153,监听器收到的总次数:21
17:40:04.570 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:166,监听器收到的总次数:22
17:40:04.571 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:179,监听器收到的总次数:23
17:40:04.579 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:182,监听器收到的总次数:24
17:40:04.593 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:189,监听器收到的总次数:25
17:40:04.616 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:198,监听器收到的总次数:26
17:40:04.620 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:205,监听器收到的总次数:27
17:40:04.620 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:206,监听器收到的总次数:28
17:40:04.621 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:212,监听器收到的总次数:29
17:40:04.633 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:215,监听器收到的总次数:30
17:40:04.635 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:216,监听器收到的总次数:31
17:40:04.635 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:229,监听器收到的总次数:32
17:40:04.637 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:237,监听器收到的总次数:33
17:40:04.642 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:243,监听器收到的总次数:34
17:40:04.644 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:254,监听器收到的总次数:35
17:40:04.644 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:258,监听器收到的总次数:36
17:40:04.648 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:265,监听器收到的总次数:37
17:40:04.649 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:269,监听器收到的总次数:38
17:40:04.653 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:275,监听器收到的总次数:39
17:40:04.655 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:280,监听器收到的总次数:40
17:40:04.659 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:286,监听器收到的总次数:41
17:40:04.662 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:300,监听器收到的总次数:42
17:40:04.667 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:307,监听器收到的总次数:43
17:40:04.670 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:312,监听器收到的总次数:44
17:40:04.674 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:316,监听器收到的总次数:45
17:40:04.676 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:329,监听器收到的总次数:46
17:40:04.677 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:333,监听器收到的总次数:47
17:40:04.681 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:346,监听器收到的总次数:48
17:40:04.685 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:349,监听器收到的总次数:49
17:40:04.687 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:362,监听器收到的总次数:50
17:40:04.690 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:372,监听器收到的总次数:51
17:40:04.691 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:376,监听器收到的总次数:52
17:40:04.694 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:382,监听器收到的总次数:53
17:40:04.696 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:388,监听器收到的总次数:54
17:40:04.702 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:396,监听器收到的总次数:55
17:40:04.705 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:404,监听器收到的总次数:56
17:40:04.705 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:405,监听器收到的总次数:57
17:40:04.707 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:410,监听器收到的总次数:58
17:40:04.710 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:414,监听器收到的总次数:59
17:40:04.711 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:420,监听器收到的总次数:60
17:40:04.715 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:422,监听器收到的总次数:61
17:40:04.716 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:436,监听器收到的总次数:62
17:40:04.717 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:438,监听器收到的总次数:63
17:40:04.720 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:448,监听器收到的总次数:64
17:40:04.723 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:459,监听器收到的总次数:65
17:40:04.724 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:462,监听器收到的总次数:66
17:40:04.727 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:473,监听器收到的总次数:67
17:40:04.729 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:485,监听器收到的总次数:68
17:40:04.732 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:489,监听器收到的总次数:69
17:40:04.735 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:502,监听器收到的总次数:70
17:40:04.736 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:505,监听器收到的总次数:71
17:40:04.739 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:512,监听器收到的总次数:72
17:40:04.742 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:515,监听器收到的总次数:73
17:40:04.744 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:528,监听器收到的总次数:74
17:40:04.747 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:539,监听器收到的总次数:75
17:40:04.751 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:543,监听器收到的总次数:76
17:40:04.753 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:549,监听器收到的总次数:77
17:40:04.757 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:556,监听器收到的总次数:78
17:40:04.758 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:570,监听器收到的总次数:79
17:40:04.759 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:582,监听器收到的总次数:80
17:40:04.762 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:586,监听器收到的总次数:81
17:40:04.763 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:592,监听器收到的总次数:82
17:40:04.765 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:597,监听器收到的总次数:83
17:40:04.793 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:602,监听器收到的总次数:84
17:40:04.793 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:604,监听器收到的总次数:85
17:40:04.798 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:610,监听器收到的总次数:86
17:40:04.799 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:624,监听器收到的总次数:87
17:40:04.801 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:633,监听器收到的总次数:88
17:40:04.803 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:638,监听器收到的总次数:89
17:40:04.807 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:644,监听器收到的总次数:90
17:40:04.811 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:649,监听器收到的总次数:91
17:40:04.815 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:654,监听器收到的总次数:92
17:40:04.820 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:663,监听器收到的总次数:93
17:40:04.821 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:676,监听器收到的总次数:94
17:40:04.824 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:681,监听器收到的总次数:95
17:40:04.826 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:687,监听器收到的总次数:96
17:40:04.829 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:699,监听器收到的总次数:97
17:40:04.830 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:708,监听器收到的总次数:98
17:40:04.832 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:713,监听器收到的总次数:99
17:40:04.834 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:719,监听器收到的总次数:100
17:40:04.835 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:724,监听器收到的总次数:101
17:40:04.836 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:730,监听器收到的总次数:102
17:40:04.839 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:742,监听器收到的总次数:103
17:40:04.842 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:743,监听器收到的总次数:104
17:40:04.844 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:752,监听器收到的总次数:105
17:40:04.846 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:765,监听器收到的总次数:106
17:40:04.846 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:773,监听器收到的总次数:107
17:40:04.848 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:778,监听器收到的总次数:108
17:40:04.851 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:789,监听器收到的总次数:109
17:40:04.854 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:793,监听器收到的总次数:110
17:40:04.856 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:800,监听器收到的总次数:111
17:40:04.861 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:802,监听器收到的总次数:112
17:40:04.861 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:814,监听器收到的总次数:113
17:40:04.863 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:827,监听器收到的总次数:114
17:40:04.865 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:837,监听器收到的总次数:115
17:40:04.867 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:842,监听器收到的总次数:116
17:40:04.869 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:847,监听器收到的总次数:117
17:40:04.872 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:848,监听器收到的总次数:118
17:40:04.873 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:862,监听器收到的总次数:119
17:40:04.874 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:874,监听器收到的总次数:120
17:40:04.876 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:879,监听器收到的总次数:121
17:40:04.880 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:893,监听器收到的总次数:122
17:40:04.882 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:895,监听器收到的总次数:123
17:40:04.896 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:896,监听器收到的总次数:124
17:40:04.899 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:907,监听器收到的总次数:125
17:40:04.899 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:921,监听器收到的总次数:126
17:40:04.900 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:934,监听器收到的总次数:127
17:40:04.902 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:945,监听器收到的总次数:128
17:40:04.903 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:949,监听器收到的总次数:129
17:40:04.904 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:956,监听器收到的总次数:130
17:40:04.906 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:960,监听器收到的总次数:131
17:40:04.907 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:966,监听器收到的总次数:132
17:40:04.919 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:971,监听器收到的总次数:133
17:40:04.922 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:977,监听器收到的总次数:134
17:40:04.926 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:991,监听器收到的总次数:135
17:40:04.927 [AMQP Connection 192.168.1.176:5672] INFO com.burny.rabbitmq.five_exchange.Producer - 消息已别接收,deliveryTag:1000,监听器收到的总次数:136

```



:::

