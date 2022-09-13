# Redis

hbase ,hilive，memcache

[学习视频来源](https://www.bilibili.com/video/BV1Rv41177Af?p=10&spm_id_from=pageDriver&vd_source=010173c6f35c758e74dd6593e5722af0)

## NoSQL数据库简介

* 不支持ACID 
* 适用高并发
* [官网](https://redis.io/)
* [下载页面](https://redis.io/download/)

## 概述和安装

### linux

* 需要gcc的环境

```shell
gcc --version

yum install gcc 
yum install lrzsz# 上传下载组件
 # 上传
 tar -zxvf redis**
 # 在redis下的 目录make 命令进行编译。
  make && make install
# 默认安装目录
/usr/local/bin

 
```

#### 安装目录

```shell
cd /usr/local/bin
redis-benchmark  性能测试工具，可以在自己本子运行，看看自己本子性能如何；
lrwxrwxrwx. 1 root root       12 9月  12 19:47 redis-check-aof -> redis-server 修复有问题的AOP文件
lrwxrwxrwx. 1 root root       12 9月  12 19:47 redis-check-rdb -> redis-server 修复有问题的rdb文件
-rwxr-xr-x. 1 root root  5411024 9月  12 19:47 redis-cli 客户端
lrwxrwxrwx. 1 root root       12 9月  12 19:47 redis-sentinel -> redis-server redis集群
-rwxr-xr-x. 1 root root 11390184 9月  12 19:47 redis-server   服务端

```

### 启动



#### 前台启动 

ctrl+c 即结束了

```shell
./redis-server
```

#### 后台启动

```shell

cp  /data/soft/redis/redis.conf  /etc/redis.conf
vim /etc/redis.conf
#后台设置daemonize 为 yes
#启动
./redis-server /etc/redis.conf
# 连接
redis-cli -h ip   -p password

#连接完之后停止掉
shutdown

```

### 相关知识简介

>  默认是有16个数据库，下标从0开始，初始默认是适用0号库

```shell
#选择哪个库
select 1 ;
select 2;
flushdb ; #清空当前库
    flushall #清空所有的库
```

> redis是采用单线程+多路复用IO技术
>
> 多路复用：是指适用一个线程来检查多个文件描述符（Socket） 的就绪状态，比如调用select 和poll函数，传入多个文件描述符，入股偶有一个文件描述符就绪，则返回，否则阻塞直到超市。得到就绪状态后进行真正的操作可以在同一个线程里成长性，也可以启动线程执行（比如适用线程池）





串行  VS ```多线程+锁``` VS``` 单线程+多路复用IO```

 多线程+锁 代表技术：```membercache```

和memcache  三点不同：redi支持多数据类型，支持持久化，多路复用IO技术

##  常用五大数据类型

以下表格都是通过redis中文网复制而来。感谢前人巨大的肩膀

[redis命令](https://www.redis.net.cn/order/)

### redis key 操作

```shell

dbsize:查看当前库的key的数量

# 查看当前库所有的key
keys * 
# 查看某个键存不存在 返回1 存在 0 不存在
exists key1
# 查看key的类型
 type key1
 # 删除指定key的数据
 del key
 # 根据key 选择进行非阻塞删除 仅仅在keys从namespace 元数据中删除，真正的删除在后续异步操作 ，最终结果都是删除key。但是删除的方式不同，一个是同步，一个是异步
 unlink key 
 #为key设置过期时间
 expire key 10  # 10秒后key过期
 # 查看剩余时间 -1 永远不过期 -2 已经过期
 ttl key1
 
 

```



| 命令                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Redis Type 命令](https://www.redis.net.cn/order/3543.html)  | 返回 key 所储存的值的类型。                                  |
| [Redis PEXPIREAT 命令](https://www.redis.net.cn/order/3533.html) | 设置 key 的过期时间亿以毫秒计。                              |
| [Redis PEXPIREAT 命令](https://www.redis.net.cn/order/3534.html) | 设置 key 过期时间的时间戳(unix timestamp) 以毫秒计           |
| [Redis Rename 命令](https://www.redis.net.cn/order/3541.html) | 修改 key 的名称                                              |
| [Redis PERSIST 命令](https://www.redis.net.cn/order/3537.html) | 移除 key 的过期时间，key 将持久保持。                        |
| [Redis Move 命令](https://www.redis.net.cn/order/3536.html)  | 将当前数据库的 key 移动到给定的数据库 db 当中。              |
| [Redis RANDOMKEY 命令](https://www.redis.net.cn/order/3540.html) | 从当前数据库中随机返回一个 key 。                            |
| [Redis Dump 命令](https://www.redis.net.cn/order/3529.html)  | 序列化给定 key ，并返回被序列化的值。                        |
| [Redis TTL 命令](https://www.redis.net.cn/order/3539.html)   | 以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)。 |
| [Redis Expire 命令](https://www.redis.net.cn/order/3531.html) | seconds 为给定 key 设置过期时间。                            |
| [Redis DEL 命令](https://www.redis.net.cn/order/3528.html)   | 该命令用于在 key 存在是删除 key。                            |
| [Redis Pttl 命令](https://www.redis.net.cn/order/3538.html)  | 以毫秒为单位返回 key 的剩余的过期时间。                      |
| [Redis Renamenx 命令](https://www.redis.net.cn/order/3542.html) | 仅当 newkey 不存在时，将 key 改名为 newkey 。                |
| [Redis EXISTS 命令](https://www.redis.net.cn/order/3530.html) | 检查给定 key 是否存在。                                      |
| [Redis Expireat 命令](https://www.redis.net.cn/order/3532.html) | EXPIREAT 的作用和 EXPIRE 类似，都用于为 key 设置过期时间。 不同在于 EXPIREAT 命令接受的时间参数是 UNIX 时间戳(unix timestamp)。 |
| [Redis Keys 命令](https://www.redis.net.cn/order/3535.html)  | 查找所有符合给定模式( pattern)的 key 。                      |

### 字符串

* 一个redis中字符串value最多是512M

#### 数据结构

> String 的数据结构为简单动态字符串 （Simple Dynamic String ,SDS） 。是可以修改的字符串，内部结构实现商务类似于JAVA的ArrayList,采用预分配冗余空间的方式来减少内存的频繁分配。 

> 内部为当前字符串实际分配的空间capacity ，一般要高于实际字符串长度len,当字符串长度小于1M时，扩容都是加倍现有的空间，如果超过1M ，扩容时一次只会扩容1M 的空间，需要注意的时字符串的最大长度为512M

| 命令                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Redis Setnx 命令](https://www.redis.net.cn/order/3552.html)（**SET** if **N**ot e**X**ists） | 只有在 key 不存在时设置 key 的值。                           |
| [Redis Getrange 命令](https://www.redis.net.cn/order/3546.html) | 返回 key 中字符串值的子字符                                  |
| [Redis Mset 命令](https://www.redis.net.cn/order/3555.html)  | 同时设置一个或多个 key-value 对。                            |
| [Redis Setex 命令](https://www.redis.net.cn/order/3551.html) | 将值 value 关联到 key ，并将 key 的过期时间设为 seconds (以秒为单位)。 ```  SETEX KEY_NAME TIMEOUT VALUE``` |
| [Redis SET 命令](https://www.redis.net.cn/order/3544.html)   | 设置指定 key 的值  **多次设置会覆盖掉上次的key**             |
| [Redis Get 命令](https://www.redis.net.cn/order/3545.html)   | 获取指定 key 的值。                                          |
| [Redis Getbit 命令](https://www.redis.net.cn/order/3548.html) | 对 key 所储存的字符串值，获取指定偏移量上的位(bit)。         |
| [Redis Setbit 命令](https://www.redis.net.cn/order/3550.html) | 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)。   |
| [Redis Decr 命令](https://www.redis.net.cn/order/3561.html)  | 将 key 中储存的数字值减一。  ```原子操作```                  |
| [Redis Decrby 命令](https://www.redis.net.cn/order/3562.html) | key 所储存的值减去给定的减量值（decrement） 。   ```原子操作``` |
| [Redis Strlen 命令](https://www.redis.net.cn/order/3554.html) | 返回 key 所储存的字符串值的长度。                            |
| [Redis Msetnx 命令](https://www.redis.net.cn/order/3556.html) | 同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在。 |
| [Redis Incrby 命令](https://www.redis.net.cn/order/3559.html) | 将 key 所储存的值加上给定的增量值（increment） 。  ```原子操作``` |
| [Redis Incrbyfloat 命令](https://www.redis.net.cn/order/3560.html) | 将 key 所储存的值加上给定的浮点增量值（increment） 。        |
| [Redis Setrange 命令](https://www.redis.net.cn/order/3553.html) | 用 value 参数覆写给定 key 所储存的字符串值，从偏移量 offset 开始。 |
| [Redis Psetex 命令](https://www.redis.net.cn/order/3557.html) | 这个命令和 SETEX 命令相似，但它以毫秒为单位设置 key 的生存时间，而不是像 SETEX 命令那样，以秒为单位。 |
| [Redis Append 命令](https://www.redis.net.cn/order/3563.html) | 如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。 |
| **[Redis Getset 命令](https://www.redis.net.cn/order/3547.html)** | 将给定 key 的值设为 value ，并返回 key 的旧值(old value)。<br /><br />GETSET KEY_NAME VALUE<br /><br />返回给定 key 的旧值。 当 key 没有旧值时，即 key 不存在时，返回 nil 。<br /><br />当 key 存在但不是字符串类型时，返回一个错误。 |
| [Redis Mget 命令](https://www.redis.net.cn/order/3549.html)  | 获取所有(一个或多个)给定 key 的值。                          |
| [Redis Incr 命令](https://www.redis.net.cn/order/3558.html)  | 将 key 中储存的数字值增一。 ```原子操作  如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCR 操作``` |



### 列表

#### 数据结构

双向链表，对两端的操作性很高，通过索引下标的操作中间的节点性能会比较差.

快速链表：

首先在列表元素较少的情况下会适用一块连续的内存存储，这个结构是ziplist 也就是压缩列。

它将所有的元素紧挨着一起存储，分配的是一块连续的内存。

当数据量表较多的的时候，才会改成快速链表。

因为普通的链表需要附加的指针空间太大，会比较浪费空间，即在双向链表中添加前指针和后指针，

redis将链表和ziplist结合起来组成快速链表，也就是将过个的ziplist 适用双向的指针穿起来适用。这样既满足了插入删除的性能，又不会出现太大的空间冗余。

![](/images/system/redis/213953.png)

总结：

不存在空列表的情况，值在键在，值没了键了没了

```shell
lpush /rpush key name1,name2,name3 # 每个value都是从左/从右放，lpush : name3,name2,name1, rpush:name1,name2,name3
lpop/rpop key # 从左边/右边取出一个值  不存在空列表的情况
rpoplpush  key1 key2 : 从key1 列表右边取出一个值，插入到key2 的左边
LRANGE KEY_NAME START END :某个list，从下标start (索引从0开始)  开始找到  end 为索引
# 特殊 0 -1   0 左边第一个 -1 右边第一个，表示 获取所有
lindex key1 index
lllen key1:获取列表的长度
linsert  key before/after value  new value  在某个key 的value 前或者后添加一个新的value
lrem key1   n value  :从左边开始删除n个value  例如： 某个班的成绩列表 key 为key1 value为 ：97 98 97 98 99  如果是执行lrem  key1 2 97 ,则会把第一个和第三个共两个的97 删除
lset key index value 将列表key 的下标 index 的value 设置为value 


```



| 命令                                                         | 描述                                                         |      |
| :----------------------------------------------------------- | :----------------------------------------------------------- | ---- |
| [Redis Lindex 命令](https://www.redis.net.cn/order/3580.html) | 通过索引获取列表中的元素                                     |      |
| [Redis Rpush 命令](https://www.redis.net.cn/order/3592.html) | 在列表中添加一个或多个值                                     |      |
| [Redis Lrange 命令](https://www.redis.net.cn/order/3586.html) | 获取列表指定范围内的元素                                     |      |
| [Redis Rpoplpush 命令](https://www.redis.net.cn/order/3591.html) | 移除列表的最后一个元素，并将该元素添加到另一个列表并返回     |      |
| [Redis Blpop 命令](https://www.redis.net.cn/order/3577.html) | 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |      |
| [Redis Brpop 命令](https://www.redis.net.cn/order/3578.html) | 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |      |
| [Redis Brpoplpush 命令](https://www.redis.net.cn/order/3579.html) | 从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它； 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |      |
| [Redis Lrem 命令](https://www.redis.net.cn/order/3587.html)  | 移除列表元素                                                 |      |
| [Redis Llen 命令](https://www.redis.net.cn/order/3582.html)  | 获取列表长度                                                 |      |
| [Redis Ltrim 命令](https://www.redis.net.cn/order/3589.html) | 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除。 |      |
| [Redis Lpop 命令](https://www.redis.net.cn/order/3583.html)  | 移出并获取列表的第一个元素                                   |      |
| [Redis Lpushx 命令](https://www.redis.net.cn/order/3585.html) | 将一个或多个值插入到已存在的列表头部                         |      |
| [Redis Linsert 命令](https://www.redis.net.cn/order/3581.html) | 在列表的元素前或者后插入元素                                 |      |
| [Redis Rpop 命令](https://www.redis.net.cn/order/3590.html)  | 移除并获取列表最后一个元素                                   |      |
| [Redis Lset 命令](https://www.redis.net.cn/order/3588.html)  | 通过索引设置列表元素的值                                     |      |
| [Redis Lpush 命令](https://www.redis.net.cn/order/3584.html) | 将一个或多个值插入到列表头部                                 |      |
| [Redis Rpushx 命令](https://www.redis.net.cn/order/3593.html) | 为已存在的列表添加值                                         |      |

### 集合



底层其实是一个value为null的hash标，所以添加删除查找的复杂度都是O(1).

数据结构都是字典，字典是用哈希表实现的

```shell

SADD KEY_NAME VALUE1..VALUEN 返回值 ： 被添加到集合中的新元素的数量，不包括被忽略的元素
```



| 命令                                                         | 描述                                                | 语法                                                         | 说明                                                         |
| :----------------------------------------------------------- | :-------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Redis Sunion 命令](https://www.redis.net.cn/order/3606.html) | 返回所有给定集合的并集                              | SUNION KEY KEY1..KEYN                                        |                                                              |
| [Redis Scard 命令](https://www.redis.net.cn/order/3595.html) | 获取集合的成员数                                    | SCARD KEY_NAME                                               |                                                              |
| [Redis Srandmember 命令](https://www.redis.net.cn/order/3604.html) | 返回集合中一个或多个随机数                          | SRANDMEMBER KEY [count]                                      | 如果 count 为正数，且小于集合基数，那么命令返回一个包含 count 个元素的数组，数组中的元素各不相同。如果 count 大于等于集合基数，那么返回整个集合。<br/>如果 count 为负数，那么命令返回一个数组，数组中的元素可能会重复出现多次，而数组的长度为 count 的绝对值。<br/>该操作和 SPOP 相似，但 SPOP 将随机元素从集合中移除并返回，而 Srandmember 则仅仅返回随机元素，而不对集合进行任何改动。<br />只提供集合 key 参数时，返回一个元素；如果集合为空，返回 nil 。 如果提供了 count 参数，那么返回一个数组；如果集合为空，返回空数组。 |
| [Redis Smembers 命令](https://www.redis.net.cn/order/3601.html) | 返回集合中的所有成员                                | SMEMBERS KEY VALUE                                           | Redis Smembers 命令返回集合中的所有的成员。 不存在的集合 key 被视为空集合 |
| [Redis Sinter 命令](https://www.redis.net.cn/order/3598.html) | 返回给定所有集合的交集                              | SINTER KEY KEY1..KEYN                                        | Redis Sinter 命令返回给定所有给定集合的交集。 不存在的集合 key 被视为空集。 当给定集合当中有一个空集时，结果也为空集(根据集合运算定律)。 |
| [Redis Srem 命令](https://www.redis.net.cn/order/3605.html)  | 移除集合中一个或多个成员                            | SREM KEY MEMBER1..MEMBERN                                    | Redis Srem 命令用于移除集合中的一个或多个成员元素，不存在的成员元素会被忽略。<br/><br/>当 key 不是集合类型，返回一个错误。 |
| [Redis Smove 命令](https://www.redis.net.cn/order/3602.html) | 将 member 元素从 source 集合移动到 destination 集合 | SMOVE SOURCE DESTINATION MEMBER                              | Redis Smove 命令将指定成员 member 元素从 source 集合移动到 destination 集合。<br/><br/>SMOVE 是原子性操作。<br/><br/>如果 source 集合不存在或不包含指定的 member 元素，则 SMOVE 命令不执行任何操作，仅返回 0 。否则， member 元素从 source 集合中被移除，并添加到 destination 集合中去。<br/><br/>当 destination 集合已经包含 member 元素时， SMOVE 命令只是简单地将 source 集合中的 member 元素删除。<br/><br/>当 source 或 destination 不是集合类型时，返回一个错误。 |
| [Redis Sadd 命令](https://www.redis.net.cn/order/3594.html)  | 向集合添加一个或多个成员                            | SADD KEY_NAME VALUE1..VALUEN                                 | Redis Sadd 命令将一个或多个成员元素加入到集合中，已经存在于集合的成员元素将被忽略。<br/><br/>假如集合 key 不存在，则创建一个只包含添加的元素作成员的集合。<br/><br/>当集合 key 不是集合类型时，返回一个错误。 |
| [Redis Sismember 命令](https://www.redis.net.cn/order/3600.html) | 判断 member 元素是否是集合 key 的成员               | SISMEMBER KEY VALUE                                          | Redis Sismember 命令判断成员元素是否是集合的成员。           |
| [Redis Sdiffstore 命令](https://www.redis.net.cn/order/3597.html) | 返回给定所有集合的差集并存储在 destination 中       | SDIFFSTORE DESTINATION_KEY KEY1..KEYN                        | Redis Sdiffstore 命令将给定集合之间的差集存储在指定的集合中。如果指定的集合 key 已存在，则会被覆盖。 |
| [Redis Sdiff 命令](https://www.redis.net.cn/order/3596.html) | 返回给定所有集合的差集                              | SDIFF FIRST_KEY OTHER_KEY1..OTHER_KEYN                       | Redis Sdiff 命令返回给定集合之间的差集。不存在的集合 key 将视为空集。 |
| [Redis Sscan 命令](https://www.redis.net.cn/order/3608.html) | 迭代集合中的元素                                    | SSCAN KEY [MATCH pattern] [COUNT count]<br />sscan myset1 0 match h* | Redis Sscan 命令用于迭代集合键中的元素                       |
| [Redis Sinterstore 命令](https://www.redis.net.cn/order/3599.html) | 返回给定所有集合的交集并存储在 destination 中       | SINTERSTORE DESTINATION_KEY KEY KEY1..KEYN                   | Redis Sinterstore 命令将给定集合之间的交集存储在指定的集合中。如果指定的集合已经存在，则将其覆盖。 |
| [Redis Sunionstore 命令](https://www.redis.net.cn/order/3607.html) | 所有给定集合的并集存储在 destination 集合中         | SUNIONSTORE DESTINATION KEY KEY1..KEYN                       | Redis Sunionstore 命令将给定集合的并集存储在指定的集合 destination 中 |
| [Redis Spop 命令](https://www.redis.net.cn/order/3603.html)  | 移除并返回集合中的一个随机元素                      | SPOP KEY                                                     | Redis Spop 命令用于移除并返回集合中的一个随机元素。          |

### 哈希



| 命令                                                         | 描述                                                     |
| :----------------------------------------------------------- | :------------------------------------------------------- |
| [Redis Hmset 命令](https://www.redis.net.cn/order/3573.html) | 同时将多个 field-value (域-值)对设置到哈希表 key 中。    |
| [Redis Hmget 命令](https://www.redis.net.cn/order/3572.html) | 获取所有给定字段的值                                     |
| [Redis Hset 命令](https://www.redis.net.cn/order/3574.html)  | 将哈希表 key 中的字段 field 的值设为 value 。            |
| [Redis Hgetall 命令](https://www.redis.net.cn/order/3567.html) | 获取在哈希表中指定 key 的所有字段和值                    |
| [Redis Hget 命令](https://www.redis.net.cn/order/3566.html)  | 获取存储在哈希表中指定字段的值/td>                       |
| [Redis Hexists 命令](https://www.redis.net.cn/order/3565.html) | 查看哈希表 key 中，指定的字段是否存在。                  |
| [Redis Hincrby 命令](https://www.redis.net.cn/order/3568.html) | 为哈希表 key 中的指定字段的整数值加上增量 increment 。   |
| [Redis Hlen 命令](https://www.redis.net.cn/order/3571.html)  | 获取哈希表中字段的数量                                   |
| [Redis Hdel 命令](https://www.redis.net.cn/order/3564.html)  | 删除一个或多个哈希表字段                                 |
| [Redis Hvals 命令](https://www.redis.net.cn/order/3576.html) | 获取哈希表中所有值                                       |
| [Redis Hincrbyfloat 命令](https://www.redis.net.cn/order/3569.html) | 为哈希表 key 中的指定字段的浮点数值加上增量 increment 。 |
| [Redis Hkeys 命令](https://www.redis.net.cn/order/3570.html) | 获取所有哈希表中的字段                                   |
| [Redis Hsetnx 命令](https://www.redis.net.cn/order/3575.html) | 只有在字段 field 不存在时，设置哈希表字段的值。          |

### 有序集合