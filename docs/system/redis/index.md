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
 # 默认：/usr/local/bin/redis-server  ./redis.conf 
 
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

>  **以下表格都是通过redis中文网复制而来。感谢前人巨大的肩膀**

[redis中文网](https://www.redis.net.cn/order/)

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

>  表格是通过redis中文网复制而来。感谢前人巨大的肩膀

[redis中文网](https://www.redis.net.cn/order/)

| 命令                                                         | 描述                                                         | 语法                                                      | 返回值                                                       | 说明                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Redis Type 命令](https://www.redis.net.cn/order/3543.html)  | 命令用于返回 key 所储存的值的类型                            | TYPE KEY_NAME                                             | 返回 key 的数据类型，数据类型有：<br/><br/>none (key不存在)<br/>string (字符串)<br/>list (列表)<br/>set (集合)<br/>zset (有序集)<br/>hash (哈希表) |                                                              |
| [Redis PEXPIREAT 命令](https://www.redis.net.cn/order/3533.html) | Redis PEXPIREAT 命令用于设置 key 的过期时间，已毫秒技。key 过期后将不再可用。 | PEXPIREAT KEY_NAME TIME_IN_MILLISECONDS_IN_UNIX_TIMESTAMP | 设置成功返回 1 。 当 key 不存在或者不能为 key 设置过期时间时(比如在低于 2.1.3 版本的 Redis 中你尝试更新 key 的过期时间)返回 0 |                                                              |
| [Redis Rename 命令](https://www.redis.net.cn/order/3541.html) | 修改 key 的名称                                              | RENAME OLD_KEY_NAME NEW_KEY_NAME                          | 改名成功时提示 OK ，失败时候返回一个错误。<br/><br/>当 OLD_KEY_NAME 和 NEW_KEY_NAME 相同，或者 OLD_KEY_NAME 不存在时，返回一个错误。 当 NEW_KEY_NAME 已经存在时， RENAME 命令将覆盖旧值。 |                                                              |
| [Redis PERSIST 命令](https://www.redis.net.cn/order/3537.html) | 用于移除给定 key 的过期时间，使得 key 永不过期。             | PERSIST KEY_NAME                                          | 当过期时间移除成功时，返回 1 。 如果 key 不存在或 key 没有设置过期时间，返回 0 。 |                                                              |
| [Redis Move 命令](https://www.redis.net.cn/order/3536.html)  | 将当前数据库的 key 移动到给定的数据库 db 当中。              | MOVE KEY_NAME DESTINATION_DATABASE                        | 移动成功返回 1 ，失败则返回 0 <br />两个数据库有相同的 key，MOVE 失败 |                                                              |
| [Redis RANDOMKEY 命令](https://www.redis.net.cn/order/3540.html) | 从当前数据库中随机返回一个 key 。                            | RANDOMKEY                                                 | 当数据库不为空时，返回一个 key 。 当数据库为空时，返回 nil 。 |                                                              |
| [Redis Dump 命令](https://www.redis.net.cn/order/3529.html)  | 序列化给定 key ，并返回被序列化的值。                        | DUMP KEY_NAME                                             | 如果 key 不存在，那么返回 nil 。 否则，返回序列化之后的值。  | 实例： \x00\x15hello, dumping world!\x06\x00E\xa0Z\x82\xd8r\xc1\xde" |
| [Redis TTL 命令](https://www.redis.net.cn/order/3539.html)   | 以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)。 | TTL KEY_NAME                                              | 当 key 不存在时，返回 -2 。 当 key 存在但没有设置剩余生存时间时，返回 -1 。 否则，以毫秒为单位，返回 key 的剩余生存时间。 |                                                              |
| [Redis Expire 命令](https://www.redis.net.cn/order/3531.html) | seconds 为给定 key 设置过期时间。                            | Expire KEY_NAME TIME_IN_SECONDS                           | 设置成功返回 1 。 当 key 不存在或者不能为 key 设置过期时间时(比如在低于 2.1.3 版本的 Redis 中你尝试更新 key 的过期时间)返回 0 。 |                                                              |
| [Redis DEL 命令](https://www.redis.net.cn/order/3528.html)   | Redis DEL 命令用于删除已存在的键。不存在的 key 会被忽略。    | DEL KEY_NAME                                              | 被删除 key 的数量。                                          |                                                              |
| [Redis Pttl 命令](https://www.redis.net.cn/order/3538.html)  | 以毫秒为单位返回 key 的剩余的过期时间。                      | PTTL KEY_NAME                                             | 当 key 不存在时，返回 -2 。 当 key 存在但没有设置剩余生存时间时，返回 -1 。 否则，以毫秒为单位，返回 key 的剩余生存时间。 |                                                              |
| [Redis Renamenx 命令](https://www.redis.net.cn/order/3542.html) | 仅当 newkey 不存在时，将 key 改名为 newkey 。                | RENAMENX OLD_KEY_NAME NEW_KEY_NAME                        | 修改成功时，返回 1 。 如果 NEW_KEY_NAME 已经存在，返回 0 。  |                                                              |
| [Redis EXISTS 命令](https://www.redis.net.cn/order/3530.html) | 检查给定 key 是否存在。                                      | EXISTS KEY_NAME                                           | 若 key 存在返回 1 ，否则返回 0 。                            |                                                              |
| [Redis Expireat 命令](https://www.redis.net.cn/order/3532.html) | EXPIREAT 的作用和 EXPIRE 类似，都用于为 key 设置过期时间。 不同在于 EXPIREAT 命令接受的时间参数是 UNIX 时间戳(unix timestamp)。 | Expireat KEY_NAME TIME_IN_UNIX_TIMESTAMP                  | 设置成功返回 1 。 当 key 不存在或者不能为 key 设置过期时间时(比如在低于 2.1.3 版本的 Redis 中你尝试更新 key 的过期时间)返回 0 。 |                                                              |
| [Redis Keys 命令](https://www.redis.net.cn/order/3535.html)  | 查找所有符合给定模式( pattern)的 key 。                      | KEYS PATTERN                                              | 符合给定模式的 key 列表 (Array)。                            | pattern：正则表达式                                          |

### 字符串

* 一个redis中字符串value最多是512M

#### 数据结构

> String 的数据结构为简单动态字符串 （Simple Dynamic String ,SDS） 。是可以修改的字符串，内部结构实现商务类似于JAVA的ArrayList,采用预分配冗余空间的方式来减少内存的频繁分配。 

> 内部为当前字符串实际分配的空间capacity ，一般要高于实际字符串长度len,当字符串长度小于1M时，扩容都是加倍现有的空间，如果超过1M ，扩容时一次只会扩容1M 的空间，需要注意的时字符串的最大长度为512M

> 表格是通过redis中文网复制而来。感谢前人巨大的肩膀

[redis中文网](https://www.redis.net.cn/order/)

| 命令                                                         | 描述                                                         | 语法                                          | 返回值                                                       | 说明                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------ | :----------------------------------------------------------- |
| [Redis Setnx 命令](https://www.redis.net.cn/order/3552.html)（**SET** if **N**ot e**X**ists） | 只有在 key 不存在时设置 key 的值。                           | SETNX KEY_NAME VALUE                          | 设置成功，返回 1 。 设置失败，返回 0 。                      |                                                              |
| [Redis Getrange 命令](https://www.redis.net.cn/order/3546.html) | 返回 key 中字符串值的子字符                                  | GETRANGE KEY_NAME start end                   | 截取得到的子字符串。                                         | GETRANGE mykey 0 3<br />：索引从0开始。第三位结束，如果是全部则是0  -1 |
| [Redis Mset 命令](https://www.redis.net.cn/order/3555.html)  | 同时设置一个或多个 key-value 对。                            | MSET key1 value1 key2 value2 .. keyN valueN   | 总是返回 OK 。                                               |                                                              |
| [Redis Setex 命令](https://www.redis.net.cn/order/3551.html) | 将值 value 关联到 key ，并将 key 的过期时间设为 seconds (以秒为单位)。 ```  SETEX KEY_NAME TIMEOUT VALUE``` | SETEX KEY_NAME TIMEOUT VALUE                  | 设置成功时返回 OK 。                                         | 原子性                                                       |
| [Redis SET 命令](https://www.redis.net.cn/order/3544.html)   | 设置指定 key 的值  **多次设置会覆盖掉上次的key**             | SET KEY_NAME VALUE                            | ET 在设置操作成功完成时，才返回 OK 。                        |                                                              |
| [Redis Get 命令](https://www.redis.net.cn/order/3545.html)   | Redis Get 命令用于获取指定 key 的值。如果 key 不存在，返回 nil 。如果key 储存的值不是字符串类型，返回一个错误。 | GET KEY_NAME                                  | 返回 key 的值，如果 key 不存在时，返回 nil。 如果 key 不是字符串类型，那么返回一个错误。 |                                                              |
| [Redis Getbit 命令](https://www.redis.net.cn/order/3548.html) | 对 key 所储存的字符串值，获取指定偏移量上的位(bit)。         | GETBIT KEY_NAME OFFSET                        | 字符串值指定偏移量上的位(bit)。当偏移量 OFFSET 比字符串值的长度大，或者 key 不存在时，返回 0 。 | \# 对不存在的 key 或者不存在的 offset 进行 GETBIT， 返回 0  <br /> redis EXISTS bit (integer) 0<br />   redis GETBIT bit 10086 (integer) 0     \# 对已存在的 offset 进行 GETBIT   redis SETBIT bit 10086 1 (integer) 0   redis GETBIT bit 10086 (integer) 1 |
| [Redis Setbit 命令](https://www.redis.net.cn/order/3550.html) | 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)。   | Setbit KEY_NAME OFFSET                        | 指定偏移量原来储存的位。                                     | redis SETBIT bit 10086 1 (integer) 0   redis GETBIT bit 10086 (integer) 1   redis  GETBIT bit 100   # bit 默认被初始化为 0 (integer) 0 |
| [Redis Decr 命令](https://www.redis.net.cn/order/3561.html)  | Redis Decr 命令将 key 中储存的数字值减一。如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 DECR 操作。如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。本操作的值限制在 64 位(bit)有符号数字表示之内。<br />  ```原子操作``` | DECR KEY_NAME                                 | 执行命令之后 key 的值。                                      |                                                              |
| [Redis Decrby 命令](https://www.redis.net.cn/order/3562.html) | key 所储存的值减去给定的减量值（decrement） 。<br /><br />Redis Decrby 命令将 key 所储存的值减去指定的减量值。如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 DECRBY 操作。如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。本操作的值限制在 64 位(bit)有符号数字表示之内。<br /><br />   ```原子操作``` | DECRBY KEY_NAME DECREMENT_AMOUNT              | 减去指定减量值之后， key 的值。                              |                                                              |
| [Redis Strlen 命令](https://www.redis.net.cn/order/3554.html) | 返回 key 所储存的字符串值的长度。<br />Redis Strlen 命令用于获取指定 key 所储存的字符串值的长度。当 key 储存的不是字符串值时，返回一个错误。 | STRLEN KEY_NAME                               | 字符串值的长度。 当 key 不存在时，返回 0。                   |                                                              |
| [Redis Msetnx 命令](https://www.redis.net.cn/order/3556.html) | 同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在。 | MSETNX key1 value1 key2 value2 .. keyN valueN | 当所有 key 都成功设置，返回 1 。 如果所有给定 key 都设置失败(至少有一个 key 已经存在)，那么返回 0 。 |                                                              |
| [Redis Incrby 命令](https://www.redis.net.cn/order/3559.html) | 将 key 所储存的值加上给定的增量值（increment） 。  ```原子操作``` | 跟相减一样                                    |                                                              |                                                              |
| [Redis Incrbyfloat 命令](https://www.redis.net.cn/order/3560.html) | 将 key 所储存的值加上给定的浮点增量值（increment） 。        | INCRBYFLOAT KEY_NAME INCR_AMOUNT              | 执行命令之后 key 的值。                                      | 后跟的 0 会被移除<br />可以对整数类型执行<br />SET 设置的值小数部分可以是 0，但 INCRBYFLOAT 会将无用的 0 忽略掉，有需要的话，将浮点变为整数 |
| [Redis Setrange 命令](https://www.redis.net.cn/order/3553.html) | 用 value 参数覆写给定 key 所储存的字符串值，从偏移量 offset 开始。 | SETRANGE KEY_NAME OFFSET VALUE                | 被修改后的字符串长度。                                       |                                                              |
| [Redis Psetex 命令](https://www.redis.net.cn/order/3557.html) | 这个命令和 SETEX 命令相似，但它以毫秒为单位设置 key 的生存时间，而不是像 SETEX 命令那样，以秒为单位。 | PSETEX key1 EXPIRY_IN_MILLISECONDS value1     |                                                              |                                                              |
| [Redis Append 命令](https://www.redis.net.cn/order/3563.html) | 如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。 | APPEND KEY_NAME NEW_VALUE                     | 追加指定值之后， key 中字符串的长度。                        | Redis Append 命令用于为指定的 key 追加值。<br/><br/>如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。<br/><br/>如果 key 不存在， APPEND 就简单地将给定 key 设为 value ，就像执行 SET key value 一样。 |
| **[Redis Getset 命令](https://www.redis.net.cn/order/3547.html)** | 将给定 key 的值设为 value ，并返回 key 的旧值(old value)。<br /><br />GETSET KEY_NAME VALUE<br /><br />返回给定 key 的旧值。 当 key 没有旧值时，即 key 不存在时，返回 nil 。<br /><br />当 key 存在但不是字符串类型时，返回一个错误。 | GETSET KEY_NAME VALUE                         | 返回给定 key 的旧值。 当 key 没有旧值时，即 key 不存在时，返回 nil 。同时设置了key和value<br/><br/>当 key 存在但不是字符串类型时，返回一个错误。 |                                                              |
| [Redis Mget 命令](https://www.redis.net.cn/order/3549.html)  | 获取所有(一个或多个)给定 key 的值。                          | MGET KEY1 KEY2 .. KEYN                        | 一个包含所有给定 key 的值的列表。                            |                                                              |
| [Redis Incr 命令](https://www.redis.net.cn/order/3558.html)  | 将 key 中储存的数字值增一。 ```原子操作  如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCR 操作``` |                                               |                                                              |                                                              |



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

> 表格是通过redis中文网复制而来。感谢前人巨大的肩膀

[redis中文网](https://www.redis.net.cn/order/)

| 命令                                                         | 描述                                                         | 语法                                             | 返回值                                                       | 说明                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Redis Lindex 命令](https://www.redis.net.cn/order/3580.html) | 通过索引获取列表中的元素                                     | LINDEX KEY_NAME INDEX_POSITION                   | 列表中下标为指定索引值的元素。 如果指定索引值不在列表的区间范围内，返回 nil 。 | edis Lindex 命令用于通过索引获取列表中的元素。你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。 |
| [Redis Rpush 命令](https://www.redis.net.cn/order/3592.html) | Redis Rpush 命令用于将一个或多个值插入到列表的尾部(最右边)。<br/><br/>如果列表不存在，一个空列表会被创建并执行 RPUSH 操作。 当列表存在但不是列表类型时，返回一个错误。 | RPUSH KEY_NAME VALUE1..VALUEN                    |                                                              | 每一个元素都是从右push进去的。而不是整一批 （value1...value）从右push进去的， |
| [Redis Lrange 命令](https://www.redis.net.cn/order/3586.html) | Redis Lrange 返回列表中指定区间内的元素，区间以偏移量 START 和 END 指定。 其中 0 表示列表的第一个元素， 1 表示列表的第二个元素，以此类推。 你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。 | LRANGE KEY_NAME START END                        | 一个列表，包含指定区间内的元素                               |                                                              |
| [Redis Rpoplpush 命令](https://www.redis.net.cn/order/3591.html) | 用于移除列表的最后一个元素，并将该元素添加到另一个列表并返回。 | RPOPLPUSH SOURCE_KEY_NAME DESTINATION_KEY_NAME   | 被弹出的元素。                                               |                                                              |
| [Redis Blpop 命令](https://www.redis.net.cn/order/3577.html) | 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 | BLPOP LIST1 LIST2 .. LISTN TIMEOUT               | 如果列表为空，返回一个 nil 。 否则，返回一个含有两个元素的列表，第一个元素是被弹出元素所属的 key ，第二个元素是被弹出元素的值。 | BLPOP list1 100<br /><br />在以上实例中，操作会被阻塞，如果指定的列表 key list1 存在数据则会返回第一个元素，否则在等待100秒后会返回 nil 。<br /><br />  (nil) (100.06s) |
| [Redis Brpop 命令](https://www.redis.net.cn/order/3578.html) | 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 | BRPOP LIST1 LIST2 .. LISTN TIMEOUT               |                                                              |                                                              |
| [Redis Brpoplpush 命令](https://www.redis.net.cn/order/3579.html) | 从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它； 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 | BRPOPLPUSH LIST1 ANOTHER_LIST TIMEOUT            | 假如在指定时间内没有任何元素被弹出，则返回一个 nil 和等待时长。 反之，返回一个含有两个元素的列表，第一个元素是被弹出元素的值，第二个元素是等待时长 |                                                              |
| [Redis Lrem 命令](https://www.redis.net.cn/order/3587.html)  | Redis Lrem 根据参数 COUNT 的值，移除列表中与参数 VALUE 相等的元素。<br/><br/>COUNT 的值可以是以下几种：<br/><br/>count > 0 : 从表头开始向表尾搜索，移除与 VALUE 相等的元素，数量为 COUNT 。<br/>count < 0 : 从表尾开始向表头搜索，移除与 VALUE 相等的元素，数量为 COUNT 的绝对值。<br/>count = 0 : 移除表中所有与 VALUE 相等的值。 | LREM KEY_NAME COUNT VALUE                        | 被移除元素的数量。 列表不存在时返回 0 。                     |                                                              |
| [Redis Llen 命令](https://www.redis.net.cn/order/3582.html)  | Redis Llen 命令用于返回列表的长度。 如果列表 key 不存在，则 key 被解释为一个空列表，返回 0 。 如果 key 不是列表类型，返回一个错误。 | LLEN KEY_NAME                                    | 列表的长度。                                                 |                                                              |
| [Redis Ltrim 命令](https://www.redis.net.cn/order/3589.html) | 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除。 | LTRIM KEY_NAME START STOP                        | 命令执行成功时，返回 ok 。                                   | Redis Ltrim 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除。<br/><br/>下标 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。 你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。 |
| [Redis Lpop 命令](https://www.redis.net.cn/order/3583.html)  | 移出并获取列表的第一个元素                                   | LPOP KEY_NAME                                    |                                                              | 此处官网的语法右误                                           |
| [Redis Lpushx 命令](https://www.redis.net.cn/order/3585.html) | 将一个或多个值插入到已存在的列表头部<br />Redis Lpushx 将一个或多个值插入到已存在的列表头部，列表不存在时操作无效。 | LPUSHX KEY_NAME VALUE1.. VALUEN                  | LPUSHX 命令执行之后，列表的长度。                            |                                                              |
| [Redis Linsert 命令](https://www.redis.net.cn/order/3581.html) | 在列表的元素前或者后插入元素<br />Redis Linsert 命令用于在列表的元素前或者后插入元素。 当指定元素不存在于列表中时，不执行任何操作。 当列表不存在时，被视为空列表，不执行任何操作。 如果 key 不是列表类型，返回一个错误。 | LINSERT KEY_NAME BEFORE EXISTING_VALUE NEW_VALUE | 如果命令执行成功，返回插入操作完成之后，列表的长度。 如果没有找到指定元素 ，返回 -1 。 如果 key 不存在或为空列表，返回 0 。 |                                                              |
| [Redis Rpop 命令](https://www.redis.net.cn/order/3590.html)  | 移除并获取列表最后一个元素                                   |                                                  | 列表的最后一个元素。 当列表不存在时，返回 nil 。             |                                                              |
| [Redis Lset 命令](https://www.redis.net.cn/order/3588.html)  | 通过索引设置列表元素的值                                     | :6379> LSET KEY_NAME INDEX VALUE                 |                                                              | Redis Lset 通过索引来设置元素的值。<br/><br/>当索引参数超出范围，或对一个空列表进行 LSET 时，返回一个错误。<br/><br/>关于列表下标的更多信息，请参考 LINDEX 命令。 |
| [Redis Lpush 命令](https://www.redis.net.cn/order/3584.html) | Redis Lpush 命令将一个或多个值插入到列表头部。 如果 key 不存在，一个空列表会被创建并执行 LPUSH 操作。 当 key 存在但不是列表类型时，返回一个错误。 | LPUSH KEY_NAME VALUE1.. VALUEN                   | 执行 LPUSH 命令后，列表的长度。                              |                                                              |
| [Redis Rpushx 命令](https://www.redis.net.cn/order/3593.html) | 为已存在的列表添加值<br />Redis Rpushx 命令用于将一个或多个值插入到已存在的列表尾部(最右边)。如果列表不存在，操作无效。 | RPUSHX KEY_NAME VALUE1..VALUEN                   | 执行 Rpushx 操作后，列表的长度。                             |                                                              |

### 集合(set)



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

### 哈希(hash)

> 表格是通过redis中文网复制而来。感谢前人巨大的肩膀

[redis中文网](https://www.redis.net.cn/order/)

#### 数据结构

hash类型对应的数据结构是两种：ziplist 压缩列表 hashtable 哈希表  。当key-value 长度较短且个数较少时候，适用ziplist ,否则适用hashtable

| 命令                                                         | 描述                                                         | 语法                                                   | 返回值                                                       | 实例                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Redis Hmset 命令](https://www.redis.net.cn/order/3573.html) | Redis Hmset 命令用于同时将多个 field-value (字段-值)对设置到哈希表中。<br/><br/>此命令会覆盖哈希表中已存在的字段。<br/><br/>如果哈希表不存在，会创建一个空哈希表，并执行 HMSET 操作。 | HMSET KEY_NAME FIELD1 VALUE1 ...FIELDN VALUEN          | 如果命令执行成功，返回 OK 。                                 | redis 127.0.0.1:6379> HSET myhash field1 "foo" field2 "bar"<br/>OK<br/>redis 127.0.0.1:6379> HGET myhash field1<br/>"foo"<br/>redis 127.0.0.1:6379> HMGET myhash field2<br/>"bar" |
| [Redis Hmget 命令](https://www.redis.net.cn/order/3572.html) | Redis Hmget 命令用于返回哈希表中，一个或多个给定字段的值。<br/><br/>如果指定的字段不存在于哈希表，那么返回一个 nil 值。 | HMGET KEY_NAME FIELD1...FIELDN                         | 一个包含多个给定字段关联值的表，表值的排列顺序和指定字段的请求顺序一样。 | redis 127.0.0.1:6379> HSET myhash field1 "foo"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HSET myhash field2 "bar"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HMGET myhash field1 field2 nofield<br/>1) "foo"<br/>2) "bar"<br/>3) (nil) |
| [Redis Hset 命令](https://www.redis.net.cn/order/3574.html)  | Redis Hset 命令用于为哈希表中的字段赋值 。<br/><br/>如果哈希表不存在，一个新的哈希表被创建并进行 HSET 操作。<br/><br/>如果字段已经存在于哈希表中，旧值将被覆盖。 | HSET KEY_NAME FIELD VALUE                              | 如果字段是哈希表中的一个新建字段，并且值设置成功，返回 1 。 如果哈希表中域字段已经存在且旧值已被新值覆盖，返回 0 。 | redis 127.0.0.1:6379> HSET myhash field1 "foo" OK redis 127.0.0.1:6379> HGET myhash field1 "foo"   redis 127.0.0.1:6379> HSET website google "www.g.cn"       # 设置一个新域 (integer) 1   redis 127.0.0.1:6379>HSET website google "www.google.com" # 覆盖一个旧域 (integer) 0 |
| [Redis Hgetall 命令](https://www.redis.net.cn/order/3567.html) | Redis Hgetall 命令用于返回哈希表中，所有的字段和值。<br/><br/>在返回值里，紧跟每个字段名(field name)之后是字段的值(value)，所以返回值的长度是哈希表大小的两倍。 | HGETALL KEY_NAME                                       | 以列表形式返回哈希表的字段及字段值。 若 key 不存在，返回空列表。 | redis 127.0.0.1:6379> HSET myhash field1 "foo"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HSET myhash field2 "bar"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HGETALL myhash<br/>1) "field1"<br/>2) "Hello"<br/>3) "field2"<br/>4) "World" |
| [Redis Hget 命令](https://www.redis.net.cn/order/3566.html)  | 获取存储在哈希表中指定字段的值/td>                           | HGET KEY_NAME FIELD_NAME                               | 返回给定字段的值。如果给定的字段或 key 不存在时，返回 nil 。 | # 字段存在<br/> <br/>redis HSET site redis redis.com<br/>(integer) 1<br/> <br/>redis  HGET site redis<br/>"redis.com"<br/> <br/> <br/># 字段不存在<br/> <br/>redis HGET site mysql<br/>(nil) |
| [Redis Hexists 命令](https://www.redis.net.cn/order/3565.html) | 查看哈希表 key 中，指定的字段是否存在。                      | HEXISTS KEY_NAME FIELD_NAME                            | 如果哈希表含有给定字段，返回 1 。 如果哈希表不含有给定字段，或 key 不存在，返回 0 。 |                                                              |
| [Redis Hincrby 命令](https://www.redis.net.cn/order/3568.html) | 为哈希表 key 中的指定字段的整数值加上增量 increment 。       | HINCRBY KEY_NAME FIELD_NAME INCR_BY_NUMBER             | Redis Hincrby 命令用于为哈希表中的字段值加上指定增量值。<br/><br/>增量也可以为负数，相当于对指定字段进行减法操作。<br/><br/>如果哈希表的 key 不存在，一个新的哈希表被创建并执行 HINCRBY 命令。<br/><br/>如果指定的字段不存在，那么在执行命令前，字段的值被初始化为 0 。<br/><br/>对一个储存字符串值的字段执行 HINCRBY 命令将造成一个错误。<br/><br/>本操作的值被限制在 64 位(bit)有符号数字表示之内。 |                                                              |
| [Redis Hlen 命令](https://www.redis.net.cn/order/3571.html)  | 获取哈希表中字段的数量                                       | HLEN KEY_NAME                                          | 哈希表中字段的数量。 当 key 不存在时，返回 0 。              |                                                              |
| [Redis Hdel 命令](https://www.redis.net.cn/order/3564.html)  | 删除一个或多个哈希表字段                                     | HDEL KEY_NAME FIELD1.. FIELDN                          | 被成功删除字段的数量，不包括被忽略的字段。                   |                                                              |
| [Redis Hvals 命令](https://www.redis.net.cn/order/3576.html) | 获取哈希表中所有值                                           | HVALS KEY_NAME （此处官网有误）                        | 一个包含哈希表中所有值的表。 当 key 不存在时，返回一个空表。 | redis 127.0.0.1:6379> HSET myhash field1 "foo"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HSET myhash field2 "bar"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HVALS myhash<br/>1) "foo"<br/>2) "bar"<br/> <br/># 空哈希表/不存在的key<br/> <br/>redis 127.0.0.1:6379> EXISTS not_exists<br/>(integer) 0<br/> <br/>redis 127.0.0.1:6379> HVALS not_exists<br/>(empty list or set) |
| [Redis Hincrbyfloat 命令](https://www.redis.net.cn/order/3569.html) | Redis Hincrbyfloat 命令用于为哈希表中的字段值加上指定浮点数增量值。<br/><br/>如果指定的字段不存在，那么在执行命令前，字段的值被初始化为 0 。 | HINCRBYFLOAT KEY_NAME FIELD_NAME INCR_BY_NUMBER <br /> | 执行 Hincrbyfloat 命令之后，哈希表中字段的值。               |                                                              |
| [Redis Hkeys 命令](https://www.redis.net.cn/order/3570.html) | 获取所有哈希表中的字段                                       | HKEYS KEY_NAME （此处官网有误）                        | 包含哈希表中所有字段的列表。 当 key 不存在时，返回一个空列表。 |                                                              |
| [Redis Hsetnx 命令](https://www.redis.net.cn/order/3575.html) | Redis Hsetnx 命令用于为哈希表中不存在的的字段赋值 。<br/><br/>如果哈希表不存在，一个新的哈希表被创建并进行 HSET 操作。<br/><br/>如果字段已经存在于哈希表中，操作无效。<br/><br/>如果 key 不存在，一个新哈希表被创建并执行 HSETNX 命令。 | HSETNX KEY_NAME FIELD VALUE                            | 设置成功，返回 1 。 如果给定字段已经存在且没有操作被执行，返回 0 。 |                                                              |

### 有序集合（Hzet）

> 表格是通过redis中文网复制而来。感谢前人巨大的肩膀

[redis中文网](https://www.redis.net.cn/order/)

| 命令                                                         | 描述                                                         | 语法                                                         | 返回值                                                       | 说明                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Redis Zrevrank 命令](https://www.redis.net.cn/order/3625.html) | Redis Zrevrank 命令返回有序集中成员的排名。其中有序集成员按分数值递减(从大到小)排序。<br/><br/>排名以 0 为底，也就是说， 分数值最大的成员排名为 0 。<br/><br/>使用 ZRANK 命令可以获得成员按分数值递增(从小到大)排列的排名。 | ZREVRANK key member                                          | 如果成员是有序集 key 的成员，返回成员的排名。 如果成员不是有序集 key 的成员，返回 nil 。 | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES     # 测试数据<br/>1) "jack"<br/>2) "2000"<br/>3) "peter"<br/>4) "3500"<br/>5) "tom"<br/>6) "5000"<br/> <br/>redis 127.0.0.1:6379> ZREVRANK salary peter     # peter 的工资排第二<br/>(integer) 1<br/> <br/>redis 127.0.0.1:6379> ZREVRANK salary tom       # tom 的工资最高<br/>(integer) 0 |
| [Redis Zlexcount 命令](https://www.redis.net.cn/order/3614.html) | Redis Zlexcount 命令在计算有序集合中指定字典区间内成员数量。 | redis 127.0.0.1:6379> ZLEXCOUNT KEY MIN MAX                  | 指定区间内的成员数量。                                       | redis 127.0.0.1:6379> ZADD myzset 0 a 0 b 0 c 0 d 0 e<br/>(integer) 5<br/>redis 127.0.0.1:6379> ZADD myzset 0 f 0 g<br/>(integer) 2<br/>redis 127.0.0.1:6379> ZLEXCOUNT myzset - +<br/>(integer) 7<br/>redis 127.0.0.1:6379> ZLEXCOUNT myzset [b [f<br/>(integer) 5 |
| [Redis Zunionstore 命令](https://www.redis.net.cn/order/3627.html)<br />不是很明白 | Redis Zunionstore 命令计算给定的一个或多个有序集的并集，其中给定 key 的数量必须以 numkeys 参数指定，并将该并集(结果集)储存到 destination 。<br/><br/>默认情况下，结果集中某个成员的分数值是所有给定集下该成员分数值之和 。 | redis 127.0.0.1:6379> ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM\|MIN\|MAX] | 保存到 destination 的结果集的成员数量。                      | redis 127.0.0.1:6379> ZRANGE programmer 0 -1 WITHSCORES<br/>1) "peter"<br/>2) "2000"<br/>3) "jack"<br/>4) "3500"<br/>5) "tom"<br/>6) "5000"<br/> <br/>redis 127.0.0.1:6379> ZRANGE manager 0 -1 WITHSCORES<br/>1) "herry"<br/>2) "2000"<br/>3) "mary"<br/>4) "3500"<br/>5) "bob"<br/>6) "4000"<br/> <br/>redis 127.0.0.1:6379> ZUNIONSTORE salary 2 programmer manager WEIGHTS 1 3   # 公司决定加薪。。。除了程序员。。。<br/>(integer) 6<br/> <br/>redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES<br/>1) "peter"<br/>2) "2000"<br/>3) "jack"<br/>4) "3500"<br/>5) "tom"<br/>6) "5000"<br/>7) "herry"<br/>8) "6000"<br/>9) "mary"<br/>10) "10500"<br/>11) "bob"<br/>12) "12000" |
| [Redis Zremrangebyrank 命令](https://www.redis.net.cn/order/3621.html) | 移除有序集合中给定的排名区间的所有成员                       | ZREMRANGEBYRANK key start stop                               | 被移除成员的数量。                                           |                                                              |
| [Redis Zcard 命令](https://www.redis.net.cn/order/3610.html) | 获取有序集合的成员数                                         | ZCARD KEY_NAME                                               | 当 key 存在且是有序集类型时，返回有序集的基数。 当 key 不存在时，返回 0 。 |                                                              |
| [Redis Zrem 命令](https://www.redis.net.cn/order/3619.html)  | Redis Zrem 命令用于移除有序集中的一个或多个成员，不存在的成员将被忽略。<br/><br/>当 key 存在但不是有序集类型时，返回一个错误。 | redis 127.0.0.1:6379> ZRANK key member                       | 被成功移除的成员的数量，不包括被忽略的成员                   |                                                              |
| [Redis Zinterstore 命令](https://www.redis.net.cn/order/3613.html)（不是很懂，需加查看） | Redis Zinterstore 命令计算给定的一个或多个有序集的交集，其中给定 key 的数量必须以 numkeys 参数指定，并将该交集(结果集)储存到 destination 。<br/><br/>默认情况下，结果集中某个成员的分数值是所有给定集下该成员分数值之和。 | redis 127.0.0.1:6379> ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM\|MIN\|MAX] | 保存到目标结果集的的成员数量。                               | # 有序集 mid_test<br/>redis 127.0.0.1:6379> ZADD mid_test 70 "Li Lei"<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD mid_test 70 "Han Meimei"<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD mid_test 99.5 "Tom"<br/>(integer) 1<br/> <br/># 另一个有序集 fin_test<br/>redis 127.0.0.1:6379> ZADD fin_test 88 "Li Lei"<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD fin_test 75 "Han Meimei"<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD fin_test 99.5 "Tom"<br/>(integer) 1<br/> <br/># 交集<br/>redis 127.0.0.1:6379> ZINTERSTORE sum_point 2 mid_test fin_test<br/>(integer) 3<br/> <br/># 显示有序集内所有成员及其分数值<br/>redis 127.0.0.1:6379> ZRANGE sum_point 0 -1 WITHSCORES     <br/>1) "Han Meimei"<br/>2) "145"<br/>3) "Li Lei"<br/>4) "158"<br/>5) "Tom"<br/>6) "199" |
| [Redis Zrank 命令](https://www.redis.net.cn/order/3618.html) | Redis Zrank 返回有序集中指定成员的排名。其中有序集成员按分数值递增(从小到大)顺序排列。 | ZRANK key member                                             | 如果成员是有序集 key 的成员，返回 member 的排名。 如果成员不是有序集 key 的成员，返回 nil 。 |                                                              |
| [Redis Zincrby 命令](https://www.redis.net.cn/order/3612.html) | Redis Zincrby 命令对有序集合中指定成员的分数加上增量 increment<br/><br/>可以通过传递一个负数值 increment ，让分数减去相应的值，比如 ZINCRBY key -5 member ，就是让 member 的 score 值减去 5 。<br/><br/>当 key 不存在，或分数不是 key 的成员时， ZINCRBY key increment member 等同于 ZADD key increment member 。<br/><br/>当 key 不是有序集类型时，返回一个错误。<br/><br/>分数值可以是整数值或双精度浮点数。 | redis 127.0.0.1:6379> ZINCRBY key increment member           | member 成员的新分数值，以字符串形式表示。                    |                                                              |
| [Redis Zrangebyscore 命令](https://www.redis.net.cn/order/3617.html) | Redis Zrangebyscore 返回有序集合中指定分数区间的成员列表。有序集成员按分数值递增(从小到大)次序排列。<br/><br/>具有相同分数值的成员按字典序来排列(该属性是有序集提供的，不需要额外的计算)。<br/><br/>默认情况下，区间的取值使用闭区间 (小于等于或大于等于)，你也可以通过给参数前增加 ( 符号来使用可选的开区间 (小于或大于)。<br/><br/>举个例子：<br/><br/>ZRANGEBYSCORE zset (1 5<br/>返回所有符合条件 1 < score <= 5 的成员，而<br/><br/>ZRANGEBYSCORE zset (5 (10<br/>则返回所有符合条件 5 < score < 10 的成员。 | ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]  | 指定区间内，带有分数值(可选)的有序集成员的列表。             |                                                              |
| [Redis Zrangebylex 命令](https://www.redis.net.cn/order/3616.html) | 通过字典区间返回有序集合的成员                               | ZRANGEBYLEX key min max [LIMIT offset count]                 | 指定区间内的元素列表。                                       | redis 127.0.0.1:6379> ZADD myzset 0 a 0 b 0 c 0 d 0 e 0 f 0 g<br/>(integer) 7<br/>redis 127.0.0.1:6379> ZRANGEBYLEX myzset - [c<br/>1) "a"<br/>2) "b"<br/>3) "c"<br/>redis 127.0.0.1:6379> ZRANGEBYLEX myzset - (c<br/>1) "a"<br/>2) "b"<br/>redis 127.0.0.1:6379> ZRANGEBYLEX myzset [aaa (g<br/>1) "b"<br/>2) "c"<br/>3) "d"<br/>4) "e"<br/>5) "f"<br/>redis |
| [Redis Zscore 命令](https://www.redis.net.cn/order/3626.html) | redis Zscore 命令返回有序集中，成员的分数值。 如果成员元素不是有序集 key 的成员，或 key 不存在，返回 nil 。 | ZSCORE key member                                            | 成员的分数值，以字符串形式表示。                             | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES    # 测试数据<br/>1) "tom"<br/>2) "2000"<br/>3) "peter"<br/>4) "3500"<br/>5) "jack"<br/>6) "5000"<br/> <br/>redis 127.0.0.1:6379> ZSCORE salary peter              # 注意返回值是字符串<br/>"3500" |
| [Redis Zremrangebyscore 命令](https://www.redis.net.cn/order/3622.html) | 移除有序集合中给定的分数区间的所有成员                       | ZREMRANGEBYSCORE key min max                                 | 被移除成员的数量。                                           | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES          # 显示有序集内所有成员及其 score 值<br/>1) "tom"<br/>2) "2000"<br/>3) "peter"<br/>4) "3500"<br/>5) "jack"<br/>6) "5000"<br/> <br/>redis 127.0.0.1:6379> ZREMRANGEBYSCORE salary 1500 3500      # 移除所有薪水在 1500 到 3500 内的员工<br/>(integer) 2<br/> <br/>redis ZRANGE salary 0 -1 WITHSCORES          # 剩下的有序集成员<br/>1) "jack"<br/>2) "5000" |
| [Redis Zscan 命令](https://www.redis.net.cn/order/3628.html) | 迭代有序集合中的元素（包括元素成员和元素分值）               | redis 127.0.0.1:6379> redis 127.0.0.1:6379> ZSCAN key cursor [MATCH pattern] [COUNT count] | 返回的每个元素都是一个有序集合元素，一个有序集合元素由一个成员（member）和一个分值（score）组成。 |                                                              |
| [Redis Zrevrangebyscore 命令](https://www.redis.net.cn/order/3624.html)(不是很懂，需加查看) | Redis Zrevrangebyscore 返回有序集中指定分数区间内的所有的成员。有序集成员按分数值递减(从大到小)的次序排列。<br/><br/>具有相同分数值的成员按字典序的逆序(reverse lexicographical order )排列。<br/><br/>除了成员按分数值递减的次序排列这一点外， ZREVRANGEBYSCORE 命令的其他方面和 ZRANGEBYSCORE 命令一样。 | ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count] | 指定区间内，带有分数值(可选)的有序集成员的列表。             | redis 127.0.0.1:6379> ZADD salary 10086 jack<br/>(integer) 1<br/>redis  ZADD salary 5000 tom<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD salary 7500 peter<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD salary 3500 joe<br/>(integer) 1<br/> <br/>redis 127.0.0.1:6379> ZREVRANGEBYSCORE salary +inf -inf   # 逆序排列所有成员<br/>1) "jack"<br/>2) "peter"<br/>3) "tom"<br/>4) "joe"<br/> <br/>redis 127.0.0.1:6379> ZREVRANGEBYSCORE salary 10000 2000  # 逆序排列薪水介于 10000 和 2000 之间的成员<br/>1) "peter"<br/>2) "tom"<br/>3) "joe" |
| [Redis Zremrangebylex 命令](https://www.redis.net.cn/order/3620.html) | 移除有序集合中给定的字典区间的所有成员                       | ZREMRANGEBYLEX key min max                                   | 被成功移除的成员的数量，不包括被忽略的成员。                 | redis 127.0.0.1:6379> ZADD myzset 0 aaaa 0 b 0 c 0 d 0 e<br/>(integer) 5<br/>redis 127.0.0.1:6379> ZADD myzset 0 foo 0 zap 0 zip 0 ALPHA 0 alpha<br/>(integer) 5<br/>redis 127.0.0.1:6379> ZRANGE myzset 0 -1<br/>1) "ALPHA"<br/> 2) "aaaa"<br/> 3) "alpha"<br/> 4) "b"<br/> 5) "c"<br/> 6) "d"<br/> 7) "e"<br/> 8) "foo"<br/> 9) "zap"<br/>10) "zip"<br/>redis 127.0.0.1:6379> ZREMRANGEBYLEX myzset [alpha [omega<br/>(integer) 6<br/>redis 127.0.0.1:6379> ZRANGE myzset 0 -1<br/>1) "ALPHA"<br/>2) "aaaa"<br/>3) "zap"<br/>4) "zip"<br/>redis |
| [Redis Zrevrange 命令](https://www.redis.net.cn/order/3623.html) | redis Zrevrange 命令返回有序集中，指定区间内的成员。<br/><br/>其中成员的位置按分数值递减(从大到小)来排列。<br/><br/>具有相同分数值的成员按字典序的逆序(reverse lexicographical order)排列。<br/><br/>除了成员按分数值递减的次序排列这一点外， ZREVRANGE 命令的其他方面和 ZRANGE 命令一样。 | redis 127.0.0.1:6379> ZREVRANGE key start stop [WITHSCORES]  | 指定区间内，带有分数值(可选)的有序集成员的列表。             | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES        # 递增排列<br/>1) "peter"<br/>2) "3500"<br/>3) "tom"<br/>4) "4000"<br/>5) "jack"<br/>6) "5000"<br/> <br/>redis 127.0.0.1:6379> ZREVRANGE salary 0 -1 WITHSCORES     # 递减排列<br/>1) "jack"<br/>2) "5000"<br/>3) "tom"<br/>4) "4000"<br/>5) "peter"<br/>6) "3500" |
| [Redis Zrange 命令](https://www.redis.net.cn/order/3615.html) | Redis Zrange 返回有序集中，指定区间内的成员。<br/><br/>其中成员的位置按分数值递增(从小到大)来排序。<br/><br/>具有相同分数值的成员按字典序(lexicographical order )来排列。<br/><br/>如果你需要成员按<br/><br/>值递减(从大到小)来排列，请使用 ZREVRANGE 命令。<br/><br/>下标参数 start 和 stop 都以 0 为底，也就是说，以 0 表示有序集第一个成员，以 1 表示有序集第二个成员，以此类推。<br/><br/>你也可以使用负数下标，以 -1 表示最后一个成员， -2 表示倒数第二个成员，以此类推。 | ZRANGE key start stop [WITHSCORES]                           | 指定区间内，带有分数值(可选)的有序集成员的列表。             | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES             # 显示整个有序集成员<br/>1) "jack"<br/>2) "3500"<br/>3) "tom"<br/>4) "5000"<br/>5) "boss"<br/>6) "10086"<br/> <br/>redis 127.0.0.1:6379> ZRANGE salary 1 2 WITHSCORES              # 显示有序集下标区间 1 至 2 的成员<br/>1) "tom"<br/>2) "5000"<br/>3) "boss"<br/>4) "10086"<br/> <br/>redis 127.0.0.1:6379> ZRANGE salary 0 200000 WITHSCORES         # 测试 end 下标超出最大下标时的情况<br/>1) "jack"<br/>2) "3500"<br/>3) "tom"<br/>4) "5000"<br/>5) "boss"<br/>6) "10086"<br/> <br/>redis  ZRANGE salary 200000 3000000 WITHSCORES                  # 测试当给定区间不存在于有序集时的情况<br/>(empty list or set) |
| [Redis Zcount 命令](https://www.redis.net.cn/order/3611.html) | 计算在有序集合中指定区间分数的成员数                         | ZCOUNT key min max                                           | 分数值在 min 和 max 之间的成员的数量。                       | redis 127.0.0.1:6379> ZADD myzset 1 "hello"<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD myzset 1 "foo"<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD myzset 2 "world" 3 "bar"<br/>(integer) 2<br/>redis 127.0.0.1:6379> ZCOUNT myzset 1 3<br/>(integer) 4 |
| [Redis Zadd 命令](https://www.redis.net.cn/order/3609.html)  | Redis Zadd 命令用于将一个或多个成员元素及其分数值加入到有序集当中。<br/><br/>如果某个成员已经是有序集的成员，那么更新这个成员的分数值，并通过重新插入这个成员元素，来保证该成员在正确的位置上。<br/><br/>分数值可以是整数值或双精度浮点数。<br/><br/>如果有序集合 key 不存在，则创建一个空的有序集并执行 ZADD 操作。<br/><br/>当 key 存在但不是有序集类型时，返回一个错误。 | ZADD KEY_NAME SCORE1 VALUE1.. SCOREN VALUEN<br/>可用版本     | 被成功添加的新成员的数量，不包括那些被更新的、已经存在的成员 |                                                              |

#### 数据结构

zset底层使用了两个数据结构

* hash ，hash的作用就是关联元素value和权重score ,保障元素的value的唯一性，可以通过元素的value找到相应的score值
* 跳跃表，跳跃表在于给元素value排序，根据score的范围获取元素列表

#### 跳跃表（重点）

> 效率比红黑树，简单

空间换时间



## 配置文件略解

>  通过查找 cyx 快速定位解释

默认配置

```bash
# Redis configuration file example.
#
# Note that in order to read the configuration file, Redis must be
# started with the file path as first argument:
#
# ./redis-server /path/to/redis.conf

# Note on units: when memory size is needed, it is possible to specify
# it in the usual form of 1k 5GB 4M and so forth:
# cyx 配置大小单位，只支持bytes ,不支持bit 不区分大小小
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
#
# units are case insensitive so 1GB 1Gb 1gB are all the same.
# cyx 可以包含其他文件的配置
################################## INCLUDES ###################################

# Include one or more other config files here.  This is useful if you
# have a standard template that goes to all Redis servers but also need
# to customize a few per-server settings.  Include files can include
# other files, so use this wisely.
#
# Note that option "include" won't be rewritten by command "CONFIG REWRITE"
# from admin or Redis Sentinel. Since Redis always uses the last processed
# line as value of a configuration directive, you'd better put includes
# at the beginning of this file to avoid overwriting config change at runtime.
#
# If instead you are interested in using includes to override configuration
# options, it is better to use include as the last line.
#
# Included paths may contain wildcards. All files matching the wildcards will
# be included in alphabetical order.
# Note that if an include path contains a wildcards but no files match it when
# the server is started, the include statement will be ignored and no error will
# be emitted.  It is safe, therefore, to include wildcard files from empty
# directories.
#
# include /path/to/local.conf
# include /path/to/other.conf
# include /path/to/fragments/*.conf
#
# cyx 第三部分没讲  
################################## MODULES #####################################

# Load modules at startup. If the server is not able to load modules
# it will abort. It is possible to use multiple loadmodule directives.
#
# loadmodule /path/to/my_module.so
# loadmodule /path/to/other_module.so

# cyx 第四部分没讲  
################################## NETWORK #####################################

# By default, if no "bind" configuration directive is specified, Redis listens
# for connections from all available network interfaces on the host machine.
# It is possible to listen to just one or multiple selected interfaces using
# the "bind" configuration directive, followed by one or more IP addresses.
# Each address can be prefixed by "-", which means that redis will not fail to
# start if the address is not available. Being not available only refers to
# addresses that does not correspond to any network interface. Addresses that
# are already in use will always fail, and unsupported protocols will always BE
# silently skipped.
#
# Examples:
#
# bind 192.168.1.100 10.0.0.1     # listens on two specific IPv4 addresses
# bind 127.0.0.1 ::1              # listens on loopback IPv4 and IPv6 访问只能本地访问
# bind * -::*                     # like the default, all available interfaces
#
# ~~~ WARNING ~~~ If the computer running Redis is directly exposed to the
# internet, binding to all the interfaces is dangerous and will expose the
# instance to everybody on the internet. So by default we uncomment the
# following bind directive, that will force Redis to listen only on the
# IPv4 and IPv6 (if available) loopback interface addresses (this means Redis
# will only be able to accept client connections from the same host that it is
# running on).
#
# IF YOU ARE SURE YOU WANT YOUR INSTANCE TO LISTEN TO ALL THE INTERFACES
# COMMENT OUT THE FOLLOWING LINE.
#
# You will also need to set a password unless you explicitly disable protected
# mode.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bind 127.0.0.1 -::1

# By default, outgoing connections (from replica to master, from Sentinel to
# instances, cluster bus, etc.) are not bound to a specific local address. In
# most cases, this means the operating system will handle that based on routing
# and the interface through which the connection goes out.
#
# Using bind-source-addr it is possible to configure a specific address to bind
# to, which may also affect how the connection gets routed.
#
# Example:
#
# bind-source-addr 10.0.0.1

# Protected mode is a layer of security protection, in order to avoid that
# Redis instances left open on the internet are accessed and exploited.
#
# When protected mode is on and the default user has no password, the server
# only accepts local connections from the IPv4 address (127.0.0.1), IPv6 address
# (::1) or Unix domain sockets.
#
# By default protected mode is enabled. You should disable it only if
# you are sure you want clients from other hosts to connect to Redis
# even if no authentication is configured.
# cyx 关闭保护模式，支持远程访问模式
protected-mode yes

# Redis uses default hardened security configuration directives to reduce the
# attack surface on innocent users. Therefore, several sensitive configuration
# directives are immutable, and some potentially-dangerous commands are blocked.
#
# Configuration directives that control files that Redis writes to (e.g., 'dir'
# and 'dbfilename') and that aren't usually modified during runtime
# are protected by making them immutable.
#
# Commands that can increase the attack surface of Redis and that aren't usually
# called by users are blocked by default.
#
# These can be exposed to either all connections or just local ones by setting
# each of the configs listed below to either of these values:
#
# no    - Block for any connection (remain immutable)
# yes   - Allow for any connection (no protection)
# local - Allow only for local connections. Ones originating from the
#         IPv4 address (127.0.0.1), IPv6 address (::1) or Unix domain sockets.
#
# enable-protected-configs no
# enable-debug-command no
# enable-module-command no

# Accept connections on the specified port, default is 6379 (IANA #815344).
# If port 0 is specified Redis will not listen on a TCP socket.
# cyx 端口号
port 6379

# TCP listen() backlog.
#
# In high requests-per-second environments you need a high backlog in order
# to avoid slow clients connection issues. Note that the Linux kernel
# will silently truncate it to the value of /proc/sys/net/core/somaxconn so
# make sure to raise both the value of somaxconn and tcp_max_syn_backlog
# in order to get the desired effect.
# cyx  设置tcp的backlog,backlog其实是一个连接队列， backlog队列总和=未完成三次握手+已经完成三次握手的队列
# 在高并发环境下，需要设置一个高的backlog的值来避免慢客户端连接问题
# Linux 内核会将这个值减小到 /proc/sys/net/core/somaxconn 的值 128 ，所以需要确认增大  /proc/sys/net/core/somaxconn 和 、proc/sys/net/ipv4/ipv4/tcp_max_syn_backlog  (128 )来达到想要的效果
tcp-backlog 511

# Unix socket.
#
# Specify the path for the Unix socket that will be used to listen for
# incoming connections. There is no default, so Redis will not listen
# on a unix socket when not specified.
#
# unixsocket /run/redis.sock
# unixsocketperm 700

# cyx 永不超时  1 不操作1秒就会断开连接
# Close the connection after a client is idle for N seconds (0 to disable)
timeout 0

# TCP keepalive.
#
# If non-zero, use SO_KEEPALIVE to send TCP ACKs to clients in absence
# of communication. This is useful for two reasons:
#
# 1) Detect dead peers.
# 2) Force network equipment in the middle to consider the connection to be
#    alive.
#
# On Linux, the specified value (in seconds) is the period used to send ACKs.
# Note that to close the connection the double of the time is needed.
# On other kernels the period depends on the kernel configuration.
#
# A reasonable value for this option is 300 seconds, which is the new
# Redis default starting with Redis 3.2.1.
# cyx 检测心跳时间 ，如果超过300s就结束连接  与上述有所区别的是： 上面是外部连接redis,心跳是redis向外部说明服务是否还在
tcp-keepalive 300

# Apply OS-specific mechanism to mark the listening socket with the specified
# ID, to support advanced routing and filtering capabilities.
#
# On Linux, the ID represents a connection mark.
# On FreeBSD, the ID represents a socket cookie ID.
# On OpenBSD, the ID represents a route table ID.
#
# The default value is 0, which implies no marking is required.
# socket-mark-id 0

################################# TLS/SSL #####################################

# By default, TLS/SSL is disabled. To enable it, the "tls-port" configuration
# directive can be used to define TLS-listening ports. To enable TLS on the
# default port, use:
#
# port 0
# tls-port 6379

# Configure a X.509 certificate and private key to use for authenticating the
# server to connected clients, masters or cluster peers.  These files should be
# PEM formatted.
#
# tls-cert-file redis.crt
# tls-key-file redis.key
#
# If the key file is encrypted using a passphrase, it can be included here
# as well.
#
# tls-key-file-pass secret

# Normally Redis uses the same certificate for both server functions (accepting
# connections) and client functions (replicating from a master, establishing
# cluster bus connections, etc.).
#
# Sometimes certificates are issued with attributes that designate them as
# client-only or server-only certificates. In that case it may be desired to use
# different certificates for incoming (server) and outgoing (client)
# connections. To do that, use the following directives:
#
# tls-client-cert-file client.crt
# tls-client-key-file client.key
#
# If the key file is encrypted using a passphrase, it can be included here
# as well.
#
# tls-client-key-file-pass secret

# Configure a DH parameters file to enable Diffie-Hellman (DH) key exchange,
# required by older versions of OpenSSL (<3.0). Newer versions do not require
# this configuration and recommend against it.
#
# tls-dh-params-file redis.dh

# Configure a CA certificate(s) bundle or directory to authenticate TLS/SSL
# clients and peers.  Redis requires an explicit configuration of at least one
# of these, and will not implicitly use the system wide configuration.
#
# tls-ca-cert-file ca.crt
# tls-ca-cert-dir /etc/ssl/certs

# By default, clients (including replica servers) on a TLS port are required
# to authenticate using valid client side certificates.
#
# If "no" is specified, client certificates are not required and not accepted.
# If "optional" is specified, client certificates are accepted and must be
# valid if provided, but are not required.
#
# tls-auth-clients no
# tls-auth-clients optional

# By default, a Redis replica does not attempt to establish a TLS connection
# with its master.
#
# Use the following directive to enable TLS on replication links.
#
# tls-replication yes

# By default, the Redis Cluster bus uses a plain TCP connection. To enable
# TLS for the bus protocol, use the following directive:
#
# tls-cluster yes

# By default, only TLSv1.2 and TLSv1.3 are enabled and it is highly recommended
# that older formally deprecated versions are kept disabled to reduce the attack surface.
# You can explicitly specify TLS versions to support.
# Allowed values are case insensitive and include "TLSv1", "TLSv1.1", "TLSv1.2",
# "TLSv1.3" (OpenSSL >= 1.1.1) or any combination.
# To enable only TLSv1.2 and TLSv1.3, use:
#
# tls-protocols "TLSv1.2 TLSv1.3"

# Configure allowed ciphers.  See the ciphers(1ssl) manpage for more information
# about the syntax of this string.
#
# Note: this configuration applies only to <= TLSv1.2.
#
# tls-ciphers DEFAULT:!MEDIUM

# Configure allowed TLSv1.3 ciphersuites.  See the ciphers(1ssl) manpage for more
# information about the syntax of this string, and specifically for TLSv1.3
# ciphersuites.
#
# tls-ciphersuites TLS_CHACHA20_POLY1305_SHA256

# When choosing a cipher, use the server's preference instead of the client
# preference. By default, the server follows the client's preference.
#
# tls-prefer-server-ciphers yes

# By default, TLS session caching is enabled to allow faster and less expensive
# reconnections by clients that support it. Use the following directive to disable
# caching.
#
# tls-session-caching no

# Change the default number of TLS sessions cached. A zero value sets the cache
# to unlimited size. The default size is 20480.
#
# tls-session-cache-size 5000

# Change the default timeout of cached TLS sessions. The default timeout is 300
# seconds.
#
# tls-session-cache-timeout 60

################################# GENERAL #####################################

# By default Redis does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.
# When Redis is supervised by upstart or systemd, this parameter has no impact.
# cyx 是否启用后台启动，常用为yes
daemonize no

# If you run Redis from upstart or systemd, Redis can interact with your
# supervision tree. Options:
#   supervised no      - no supervision interaction
#   supervised upstart - signal upstart by putting Redis into SIGSTOP mode
#                        requires "expect stop" in your upstart job config
#   supervised systemd - signal systemd by writing READY=1 to $NOTIFY_SOCKET
#                        on startup, and updating Redis status on a regular
#                        basis.
#   supervised auto    - detect upstart or systemd method based on
#                        UPSTART_JOB or NOTIFY_SOCKET environment variables
# Note: these supervision methods only signal "process is ready."
#       They do not enable continuous pings back to your supervisor.
#
# The default is "no". To run under upstart/systemd, you can simply uncomment
# the line below:
#
# supervised auto

# If a pid file is specified, Redis writes it where specified at startup
# and removes it at exit.
#
# When the server runs non daemonized, no pid file is created if none is
# specified in the configuration. When the server is daemonized, the pid file
# is used even if not specified, defaulting to "/var/run/redis.pid".
#
# Creating a pid file is best effort: if Redis is not able to create it
# nothing bad happens, the server will start and run normally.
#
# Note that on modern Linux systems "/run/redis.pid" is more conforming
# and should be used instead.
# cyx 保存进程号
pidfile /var/run/redis_6379.pid

# Specify the server verbosity level.
# This can be one of:
# debug (a lot of information, useful for development/testing)
# verbose (many rarely useful info, but not a mess like the debug level) 类似于info
# notice (moderately verbose, what you want in production probably)
# warning (only very important / critical messages are logged)
# cyx 日志级别  debug  verbose notic warning 
loglevel notice

# Specify the log file name. Also the empty string can be used to force
# Redis to log on the standard output. Note that if you use standard
# output for logging but daemonize, logs will be sent to /dev/null
#cyx 日志文件所在文件
logfile ""

# To enable logging to the system logger, just set 'syslog-enabled' to yes,
# and optionally update the other syslog parameters to suit your needs.
# syslog-enabled no

# Specify the syslog identity.
# syslog-ident redis

# Specify the syslog facility. Must be USER or between LOCAL0-LOCAL7.
# syslog-facility local0

# To disable the built in crash log, which will possibly produce cleaner core
# dumps when they are needed, uncomment the following:
#
# crash-log-enabled no

# To disable the fast memory check that's run as part of the crash log, which
# will possibly let redis terminate sooner, uncomment the following:
#
# crash-memcheck-enabled no

# Set the number of databases. The default database is DB 0, you can select
# a different one on a per-connection basis using SELECT <dbid> where
# dbid is a number between 0 and 'databases'-1
# cyx 设置有多少个数据库，默认是16个
databases 16

# By default Redis shows an ASCII art logo only when started to log to the
# standard output and if the standard output is a TTY and syslog logging is
# disabled. Basically this means that normally a logo is displayed only in
# interactive sessions.
#
# However it is possible to force the pre-4.0 behavior and always show a
# ASCII art logo in startup logs by setting the following option to yes.
always-show-logo no

# By default, Redis modifies the process title (as seen in 'top' and 'ps') to
# provide some runtime information. It is possible to disable this and leave
# the process name as executed by setting the following to no.
set-proc-title yes

# When changing the process title, Redis uses the following template to construct
# the modified title.
#
# Template variables are specified in curly brackets. The following variables are
# supported:
#
# {title}           Name of process as executed if parent, or type of child process.
# {listen-addr}     Bind address or '*' followed by TCP or TLS port listening on, or
#                   Unix socket if only that's available.
# {server-mode}     Special mode, i.e. "[sentinel]" or "[cluster]".
# {port}            TCP port listening on, or 0.
# {tls-port}        TLS port listening on, or 0.
# {unixsocket}      Unix domain socket listening on, or "".
# {config-file}     Name of configuration file used.
#
proc-title-template "{title} {listen-addr} {server-mode}"

################################ SNAPSHOTTING  ################################

# Save the DB to disk.
#
# save <seconds> <changes> [<seconds> <changes> ...]
#
# Redis will save the DB if the given number of seconds elapsed and it
# surpassed the given number of write operations against the DB.
#
# Snapshotting can be completely disabled with a single empty string argument
# as in following example:
#
# save ""
#
# Unless specified otherwise, by default Redis will save the DB:
#   * After 3600 seconds (an hour) if at least 1 change was performed
#   * After 300 seconds (5 minutes) if at least 100 changes were performed
#   * After 60 seconds if at least 10000 changes were performed
#
# You can set these explicitly by uncommenting the following line.
#
# save 3600 1 300 100 60 10000

# By default Redis will stop accepting writes if RDB snapshots are enabled
# (at least one save point) and the latest background save failed.
# This will make the user aware (in a hard way) that data is not persisting
# on disk properly, otherwise chances are that no one will notice and some
# disaster will happen.
#
# If the background saving process will start working again Redis will
# automatically allow writes again.
#
# However if you have setup your proper monitoring of the Redis server
# and persistence, you may want to disable this feature so that Redis will
# continue to work as usual even if there are problems with disk,
# permissions, and so forth.
stop-writes-on-bgsave-error yes

# Compress string objects using LZF when dump .rdb databases?
# By default compression is enabled as it's almost always a win.
# If you want to save some CPU in the saving child set it to 'no' but
# the dataset will likely be bigger if you have compressible values or keys.
rdbcompression yes

# Since version 5 of RDB a CRC64 checksum is placed at the end of the file.
# This makes the format more resistant to corruption but there is a performance
# hit to pay (around 10%) when saving and loading RDB files, so you can disable it
# for maximum performances.
#
# RDB files created with checksum disabled have a checksum of zero that will
# tell the loading code to skip the check.
rdbchecksum yes

# Enables or disables full sanitization checks for ziplist and listpack etc when
# loading an RDB or RESTORE payload. This reduces the chances of a assertion or
# crash later on while processing commands.
# Options:
#   no         - Never perform full sanitization
#   yes        - Always perform full sanitization
#   clients    - Perform full sanitization only for user connections.
#                Excludes: RDB files, RESTORE commands received from the master
#                connection, and client connections which have the
#                skip-sanitize-payload ACL flag.
# The default should be 'clients' but since it currently affects cluster
# resharding via MIGRATE, it is temporarily set to 'no' by default.
#
# sanitize-dump-payload no

# The filename where to dump the DB
dbfilename dump.rdb

# Remove RDB files used by replication in instances without persistence
# enabled. By default this option is disabled, however there are environments
# where for regulations or other security concerns, RDB files persisted on
# disk by masters in order to feed replicas, or stored on disk by replicas
# in order to load them for the initial synchronization, should be deleted
# ASAP. Note that this option ONLY WORKS in instances that have both AOF
# and RDB persistence disabled, otherwise is completely ignored.
#
# An alternative (and sometimes better) way to obtain the same effect is
# to use diskless replication on both master and replicas instances. However
# in the case of replicas, diskless is not always an option.
rdb-del-sync-files no

# The working directory.
#
# The DB will be written inside this directory, with the filename specified
# above using the 'dbfilename' configuration directive.
#
# The Append Only File will also be created inside this directory.
#
# Note that you must specify a directory here, not a file name.
dir ./

################################# REPLICATION #################################

# Master-Replica replication. Use replicaof to make a Redis instance a copy of
# another Redis server. A few things to understand ASAP about Redis replication.
#
#   +------------------+      +---------------+
#   |      Master      | ---> |    Replica    |
#   | (receive writes) |      |  (exact copy) |
#   +------------------+      +---------------+
#
# 1) Redis replication is asynchronous, but you can configure a master to
#    stop accepting writes if it appears to be not connected with at least
#    a given number of replicas.
# 2) Redis replicas are able to perform a partial resynchronization with the
#    master if the replication link is lost for a relatively small amount of
#    time. You may want to configure the replication backlog size (see the next
#    sections of this file) with a sensible value depending on your needs.
# 3) Replication is automatic and does not need user intervention. After a
#    network partition replicas automatically try to reconnect to masters
#    and resynchronize with them.
#
# replicaof <masterip> <masterport>

# If the master is password protected (using the "requirepass" configuration
# directive below) it is possible to tell the replica to authenticate before
# starting the replication synchronization process, otherwise the master will
# refuse the replica request.
#
# masterauth <master-password>
#
# However this is not enough if you are using Redis ACLs (for Redis version
# 6 or greater), and the default user is not capable of running the PSYNC
# command and/or other commands needed for replication. In this case it's
# better to configure a special user to use with replication, and specify the
# masteruser configuration as such:
#
# masteruser <username>
#
# When masteruser is specified, the replica will authenticate against its
# master using the new AUTH form: AUTH <username> <password>.

# When a replica loses its connection with the master, or when the replication
# is still in progress, the replica can act in two different ways:
#
# 1) if replica-serve-stale-data is set to 'yes' (the default) the replica will
#    still reply to client requests, possibly with out of date data, or the
#    data set may just be empty if this is the first synchronization.
#
# 2) If replica-serve-stale-data is set to 'no' the replica will reply with error
#    "MASTERDOWN Link with MASTER is down and replica-serve-stale-data is set to 'no'"
#    to all data access commands, excluding commands such as:
#    INFO, REPLICAOF, AUTH, SHUTDOWN, REPLCONF, ROLE, CONFIG, SUBSCRIBE,
#    UNSUBSCRIBE, PSUBSCRIBE, PUNSUBSCRIBE, PUBLISH, PUBSUB, COMMAND, POST,
#    HOST and LATENCY.
#
replica-serve-stale-data yes

# You can configure a replica instance to accept writes or not. Writing against
# a replica instance may be useful to store some ephemeral data (because data
# written on a replica will be easily deleted after resync with the master) but
# may also cause problems if clients are writing to it because of a
# misconfiguration.
#
# Since Redis 2.6 by default replicas are read-only.
#
# Note: read only replicas are not designed to be exposed to untrusted clients
# on the internet. It's just a protection layer against misuse of the instance.
# Still a read only replica exports by default all the administrative commands
# such as CONFIG, DEBUG, and so forth. To a limited extent you can improve
# security of read only replicas using 'rename-command' to shadow all the
# administrative / dangerous commands.
replica-read-only yes

# Replication SYNC strategy: disk or socket.
#
# New replicas and reconnecting replicas that are not able to continue the
# replication process just receiving differences, need to do what is called a
# "full synchronization". An RDB file is transmitted from the master to the
# replicas.
#
# The transmission can happen in two different ways:
#
# 1) Disk-backed: The Redis master creates a new process that writes the RDB
#                 file on disk. Later the file is transferred by the parent
#                 process to the replicas incrementally.
# 2) Diskless: The Redis master creates a new process that directly writes the
#              RDB file to replica sockets, without touching the disk at all.
#
# With disk-backed replication, while the RDB file is generated, more replicas
# can be queued and served with the RDB file as soon as the current child
# producing the RDB file finishes its work. With diskless replication instead
# once the transfer starts, new replicas arriving will be queued and a new
# transfer will start when the current one terminates.
#
# When diskless replication is used, the master waits a configurable amount of
# time (in seconds) before starting the transfer in the hope that multiple
# replicas will arrive and the transfer can be parallelized.
#
# With slow disks and fast (large bandwidth) networks, diskless replication
# works better.
repl-diskless-sync yes

# When diskless replication is enabled, it is possible to configure the delay
# the server waits in order to spawn the child that transfers the RDB via socket
# to the replicas.
#
# This is important since once the transfer starts, it is not possible to serve
# new replicas arriving, that will be queued for the next RDB transfer, so the
# server waits a delay in order to let more replicas arrive.
#
# The delay is specified in seconds, and by default is 5 seconds. To disable
# it entirely just set it to 0 seconds and the transfer will start ASAP.
repl-diskless-sync-delay 5

# When diskless replication is enabled with a delay, it is possible to let
# the replication start before the maximum delay is reached if the maximum
# number of replicas expected have connected. Default of 0 means that the
# maximum is not defined and Redis will wait the full delay.
repl-diskless-sync-max-replicas 0

# -----------------------------------------------------------------------------
# WARNING: RDB diskless load is experimental. Since in this setup the replica
# does not immediately store an RDB on disk, it may cause data loss during
# failovers. RDB diskless load + Redis modules not handling I/O reads may also
# cause Redis to abort in case of I/O errors during the initial synchronization
# stage with the master. Use only if you know what you are doing.
# -----------------------------------------------------------------------------
#
# Replica can load the RDB it reads from the replication link directly from the
# socket, or store the RDB to a file and read that file after it was completely
# received from the master.
#
# In many cases the disk is slower than the network, and storing and loading
# the RDB file may increase replication time (and even increase the master's
# Copy on Write memory and replica buffers).
# However, parsing the RDB file directly from the socket may mean that we have
# to flush the contents of the current database before the full rdb was
# received. For this reason we have the following options:
#
# "disabled"    - Don't use diskless load (store the rdb file to the disk first)
# "on-empty-db" - Use diskless load only when it is completely safe.
# "swapdb"      - Keep current db contents in RAM while parsing the data directly
#                 from the socket. Replicas in this mode can keep serving current
#                 data set while replication is in progress, except for cases where
#                 they can't recognize master as having a data set from same
#                 replication history.
#                 Note that this requires sufficient memory, if you don't have it,
#                 you risk an OOM kill.
repl-diskless-load disabled

# Master send PINGs to its replicas in a predefined interval. It's possible to
# change this interval with the repl_ping_replica_period option. The default
# value is 10 seconds.
#
# repl-ping-replica-period 10

# The following option sets the replication timeout for:
#
# 1) Bulk transfer I/O during SYNC, from the point of view of replica.
# 2) Master timeout from the point of view of replicas (data, pings).
# 3) Replica timeout from the point of view of masters (REPLCONF ACK pings).
#
# It is important to make sure that this value is greater than the value
# specified for repl-ping-replica-period otherwise a timeout will be detected
# every time there is low traffic between the master and the replica. The default
# value is 60 seconds.
#
# repl-timeout 60

# Disable TCP_NODELAY on the replica socket after SYNC?
#
# If you select "yes" Redis will use a smaller number of TCP packets and
# less bandwidth to send data to replicas. But this can add a delay for
# the data to appear on the replica side, up to 40 milliseconds with
# Linux kernels using a default configuration.
#
# If you select "no" the delay for data to appear on the replica side will
# be reduced but more bandwidth will be used for replication.
#
# By default we optimize for low latency, but in very high traffic conditions
# or when the master and replicas are many hops away, turning this to "yes" may
# be a good idea.
repl-disable-tcp-nodelay no

# Set the replication backlog size. The backlog is a buffer that accumulates
# replica data when replicas are disconnected for some time, so that when a
# replica wants to reconnect again, often a full resync is not needed, but a
# partial resync is enough, just passing the portion of data the replica
# missed while disconnected.
#
# The bigger the replication backlog, the longer the replica can endure the
# disconnect and later be able to perform a partial resynchronization.
#
# The backlog is only allocated if there is at least one replica connected.
#
# repl-backlog-size 1mb

# After a master has no connected replicas for some time, the backlog will be
# freed. The following option configures the amount of seconds that need to
# elapse, starting from the time the last replica disconnected, for the backlog
# buffer to be freed.
#
# Note that replicas never free the backlog for timeout, since they may be
# promoted to masters later, and should be able to correctly "partially
# resynchronize" with other replicas: hence they should always accumulate backlog.
#
# A value of 0 means to never release the backlog.
#
# repl-backlog-ttl 3600

# The replica priority is an integer number published by Redis in the INFO
# output. It is used by Redis Sentinel in order to select a replica to promote
# into a master if the master is no longer working correctly.
#
# A replica with a low priority number is considered better for promotion, so
# for instance if there are three replicas with priority 10, 100, 25 Sentinel
# will pick the one with priority 10, that is the lowest.
#
# However a special priority of 0 marks the replica as not able to perform the
# role of master, so a replica with priority of 0 will never be selected by
# Redis Sentinel for promotion.
#
# By default the priority is 100.
replica-priority 100

# The propagation error behavior controls how Redis will behave when it is
# unable to handle a command being processed in the replication stream from a master
# or processed while reading from an AOF file. Errors that occur during propagation
# are unexpected, and can cause data inconsistency. However, there are edge cases
# in earlier versions of Redis where it was possible for the server to replicate or persist
# commands that would fail on future versions. For this reason the default behavior
# is to ignore such errors and continue processing commands.
#
# If an application wants to ensure there is no data divergence, this configuration
# should be set to 'panic' instead. The value can also be set to 'panic-on-replicas'
# to only panic when a replica encounters an error on the replication stream. One of
# these two panic values will become the default value in the future once there are
# sufficient safety mechanisms in place to prevent false positive crashes.
#
# propagation-error-behavior ignore

# Replica ignore disk write errors controls the behavior of a replica when it is
# unable to persist a write command received from its master to disk. By default,
# this configuration is set to 'no' and will crash the replica in this condition.
# It is not recommended to change this default, however in order to be compatible
# with older versions of Redis this config can be toggled to 'yes' which will just
# log a warning and execute the write command it got from the master.
#
# replica-ignore-disk-write-errors no

# -----------------------------------------------------------------------------
# By default, Redis Sentinel includes all replicas in its reports. A replica
# can be excluded from Redis Sentinel's announcements. An unannounced replica
# will be ignored by the 'sentinel replicas <master>' command and won't be
# exposed to Redis Sentinel's clients.
#
# This option does not change the behavior of replica-priority. Even with
# replica-announced set to 'no', the replica can be promoted to master. To
# prevent this behavior, set replica-priority to 0.
#
# replica-announced yes

# It is possible for a master to stop accepting writes if there are less than
# N replicas connected, having a lag less or equal than M seconds.
#
# The N replicas need to be in "online" state.
#
# The lag in seconds, that must be <= the specified value, is calculated from
# the last ping received from the replica, that is usually sent every second.
#
# This option does not GUARANTEE that N replicas will accept the write, but
# will limit the window of exposure for lost writes in case not enough replicas
# are available, to the specified number of seconds.
#
# For example to require at least 3 replicas with a lag <= 10 seconds use:
#
# min-replicas-to-write 3
# min-replicas-max-lag 10
#
# Setting one or the other to 0 disables the feature.
#
# By default min-replicas-to-write is set to 0 (feature disabled) and
# min-replicas-max-lag is set to 10.

# A Redis master is able to list the address and port of the attached
# replicas in different ways. For example the "INFO replication" section
# offers this information, which is used, among other tools, by
# Redis Sentinel in order to discover replica instances.
# Another place where this info is available is in the output of the
# "ROLE" command of a master.
#
# The listed IP address and port normally reported by a replica is
# obtained in the following way:
#
#   IP: The address is auto detected by checking the peer address
#   of the socket used by the replica to connect with the master.
#
#   Port: The port is communicated by the replica during the replication
#   handshake, and is normally the port that the replica is using to
#   listen for connections.
#
# However when port forwarding or Network Address Translation (NAT) is
# used, the replica may actually be reachable via different IP and port
# pairs. The following two options can be used by a replica in order to
# report to its master a specific set of IP and port, so that both INFO
# and ROLE will report those values.
#
# There is no need to use both the options if you need to override just
# the port or the IP address.
#
# replica-announce-ip 5.5.5.5
# replica-announce-port 1234

############################### KEYS TRACKING #################################

# Redis implements server assisted support for client side caching of values.
# This is implemented using an invalidation table that remembers, using
# a radix key indexed by key name, what clients have which keys. In turn
# this is used in order to send invalidation messages to clients. Please
# check this page to understand more about the feature:
#
#   https://redis.io/topics/client-side-caching
#
# When tracking is enabled for a client, all the read only queries are assumed
# to be cached: this will force Redis to store information in the invalidation
# table. When keys are modified, such information is flushed away, and
# invalidation messages are sent to the clients. However if the workload is
# heavily dominated by reads, Redis could use more and more memory in order
# to track the keys fetched by many clients.
#
# For this reason it is possible to configure a maximum fill value for the
# invalidation table. By default it is set to 1M of keys, and once this limit
# is reached, Redis will start to evict keys in the invalidation table
# even if they were not modified, just to reclaim memory: this will in turn
# force the clients to invalidate the cached values. Basically the table
# maximum size is a trade off between the memory you want to spend server
# side to track information about who cached what, and the ability of clients
# to retain cached objects in memory.
#
# If you set the value to 0, it means there are no limits, and Redis will
# retain as many keys as needed in the invalidation table.
# In the "stats" INFO section, you can find information about the number of
# keys in the invalidation table at every given moment.
#
# Note: when key tracking is used in broadcasting mode, no memory is used
# in the server side so this setting is useless.
#
# tracking-table-max-keys 1000000

################################## SECURITY ###################################

# Warning: since Redis is pretty fast, an outside user can try up to
# 1 million passwords per second against a modern box. This means that you
# should use very strong passwords, otherwise they will be very easy to break.
# Note that because the password is really a shared secret between the client
# and the server, and should not be memorized by any human, the password
# can be easily a long string from /dev/urandom or whatever, so by using a
# long and unguessable password no brute force attack will be possible.

# Redis ACL users are defined in the following format:
#
#   user <username> ... acl rules ...
#
# For example:
#
#   user worker +@list +@connection ~jobs:* on >ffa9203c493aa99
#
# The special username "default" is used for new connections. If this user
# has the "nopass" rule, then new connections will be immediately authenticated
# as the "default" user without the need of any password provided via the
# AUTH command. Otherwise if the "default" user is not flagged with "nopass"
# the connections will start in not authenticated state, and will require
# AUTH (or the HELLO command AUTH option) in order to be authenticated and
# start to work.
#
# The ACL rules that describe what a user can do are the following:
#
#  on           Enable the user: it is possible to authenticate as this user.
#  off          Disable the user: it's no longer possible to authenticate
#               with this user, however the already authenticated connections
#               will still work.
#  skip-sanitize-payload    RESTORE dump-payload sanitization is skipped.
#  sanitize-payload         RESTORE dump-payload is sanitized (default).
#  +<command>   Allow the execution of that command.
#               May be used with `|` for allowing subcommands (e.g "+config|get")
#  -<command>   Disallow the execution of that command.
#               May be used with `|` for blocking subcommands (e.g "-config|set")
#  +@<category> Allow the execution of all the commands in such category
#               with valid categories are like @admin, @set, @sortedset, ...
#               and so forth, see the full list in the server.c file where
#               the Redis command table is described and defined.
#               The special category @all means all the commands, but currently
#               present in the server, and that will be loaded in the future
#               via modules.
#  +<command>|first-arg  Allow a specific first argument of an otherwise
#                        disabled command. It is only supported on commands with
#                        no sub-commands, and is not allowed as negative form
#                        like -SELECT|1, only additive starting with "+". This
#                        feature is deprecated and may be removed in the future.
#  allcommands  Alias for +@all. Note that it implies the ability to execute
#               all the future commands loaded via the modules system.
#  nocommands   Alias for -@all.
#  ~<pattern>   Add a pattern of keys that can be mentioned as part of
#               commands. For instance ~* allows all the keys. The pattern
#               is a glob-style pattern like the one of KEYS.
#               It is possible to specify multiple patterns.
# %R~<pattern>  Add key read pattern that specifies which keys can be read 
#               from.
# %W~<pattern>  Add key write pattern that specifies which keys can be
#               written to. 
#  allkeys      Alias for ~*
#  resetkeys    Flush the list of allowed keys patterns.
#  &<pattern>   Add a glob-style pattern of Pub/Sub channels that can be
#               accessed by the user. It is possible to specify multiple channel
#               patterns.
#  allchannels  Alias for &*
#  resetchannels            Flush the list of allowed channel patterns.
#  ><password>  Add this password to the list of valid password for the user.
#               For example >mypass will add "mypass" to the list.
#               This directive clears the "nopass" flag (see later).
#  <<password>  Remove this password from the list of valid passwords.
#  nopass       All the set passwords of the user are removed, and the user
#               is flagged as requiring no password: it means that every
#               password will work against this user. If this directive is
#               used for the default user, every new connection will be
#               immediately authenticated with the default user without
#               any explicit AUTH command required. Note that the "resetpass"
#               directive will clear this condition.
#  resetpass    Flush the list of allowed passwords. Moreover removes the
#               "nopass" status. After "resetpass" the user has no associated
#               passwords and there is no way to authenticate without adding
#               some password (or setting it as "nopass" later).
#  reset        Performs the following actions: resetpass, resetkeys, off,
#               -@all. The user returns to the same state it has immediately
#               after its creation.
# (<options>)   Create a new selector with the options specified within the
#               parentheses and attach it to the user. Each option should be 
#               space separated. The first character must be ( and the last 
#               character must be ).
# clearselectors            Remove all of the currently attached selectors. 
#                           Note this does not change the "root" user permissions,
#                           which are the permissions directly applied onto the
#                           user (outside the parentheses).
#
# ACL rules can be specified in any order: for instance you can start with
# passwords, then flags, or key patterns. However note that the additive
# and subtractive rules will CHANGE MEANING depending on the ordering.
# For instance see the following example:
#
#   user alice on +@all -DEBUG ~* >somepassword
#
# This will allow "alice" to use all the commands with the exception of the
# DEBUG command, since +@all added all the commands to the set of the commands
# alice can use, and later DEBUG was removed. However if we invert the order
# of two ACL rules the result will be different:
#
#   user alice on -DEBUG +@all ~* >somepassword
#
# Now DEBUG was removed when alice had yet no commands in the set of allowed
# commands, later all the commands are added, so the user will be able to
# execute everything.
#
# Basically ACL rules are processed left-to-right.
#
# The following is a list of command categories and their meanings:
# * keyspace - Writing or reading from keys, databases, or their metadata 
#     in a type agnostic way. Includes DEL, RESTORE, DUMP, RENAME, EXISTS, DBSIZE,
#     KEYS, EXPIRE, TTL, FLUSHALL, etc. Commands that may modify the keyspace,
#     key or metadata will also have `write` category. Commands that only read
#     the keyspace, key or metadata will have the `read` category.
# * read - Reading from keys (values or metadata). Note that commands that don't
#     interact with keys, will not have either `read` or `write`.
# * write - Writing to keys (values or metadata)
# * admin - Administrative commands. Normal applications will never need to use
#     these. Includes REPLICAOF, CONFIG, DEBUG, SAVE, MONITOR, ACL, SHUTDOWN, etc.
# * dangerous - Potentially dangerous (each should be considered with care for
#     various reasons). This includes FLUSHALL, MIGRATE, RESTORE, SORT, KEYS,
#     CLIENT, DEBUG, INFO, CONFIG, SAVE, REPLICAOF, etc.
# * connection - Commands affecting the connection or other connections.
#     This includes AUTH, SELECT, COMMAND, CLIENT, ECHO, PING, etc.
# * blocking - Potentially blocking the connection until released by another
#     command.
# * fast - Fast O(1) commands. May loop on the number of arguments, but not the
#     number of elements in the key.
# * slow - All commands that are not Fast.
# * pubsub - PUBLISH / SUBSCRIBE related
# * transaction - WATCH / MULTI / EXEC related commands.
# * scripting - Scripting related.
# * set - Data type: sets related.
# * sortedset - Data type: zsets related.
# * list - Data type: lists related.
# * hash - Data type: hashes related.
# * string - Data type: strings related.
# * bitmap - Data type: bitmaps related.
# * hyperloglog - Data type: hyperloglog related.
# * geo - Data type: geo related.
# * stream - Data type: streams related.
#
# For more information about ACL configuration please refer to
# the Redis web site at https://redis.io/topics/acl

# ACL LOG
#
# The ACL Log tracks failed commands and authentication events associated
# with ACLs. The ACL Log is useful to troubleshoot failed commands blocked
# by ACLs. The ACL Log is stored in memory. You can reclaim memory with
# ACL LOG RESET. Define the maximum entry length of the ACL Log below.
acllog-max-len 128

# Using an external ACL file
#
# Instead of configuring users here in this file, it is possible to use
# a stand-alone file just listing users. The two methods cannot be mixed:
# if you configure users here and at the same time you activate the external
# ACL file, the server will refuse to start.
#
# The format of the external ACL user file is exactly the same as the
# format that is used inside redis.conf to describe users.
#
# aclfile /etc/redis/users.acl

# IMPORTANT NOTE: starting with Redis 6 "requirepass" is just a compatibility
# layer on top of the new ACL system. The option effect will be just setting
# the password for the default user. Clients will still authenticate using
# AUTH <password> as usually, or more explicitly with AUTH default <password>
# if they follow the new protocol: both will work.
#
# The requirepass is not compatible with aclfile option and the ACL LOAD
# command, these will cause requirepass to be ignored.
#cyx 设置密码 默认是没有密码的
# 也可以直接在客户端：config get requirepass  
# config set requirepass '123456'
# requirepass foobared

# New users are initialized with restrictive permissions by default, via the
# equivalent of this ACL rule 'off resetkeys -@all'. Starting with Redis 6.2, it
# is possible to manage access to Pub/Sub channels with ACL rules as well. The
# default Pub/Sub channels permission if new users is controlled by the
# acl-pubsub-default configuration directive, which accepts one of these values:
#
# allchannels: grants access to all Pub/Sub channels
# resetchannels: revokes access to all Pub/Sub channels
#
# From Redis 7.0, acl-pubsub-default defaults to 'resetchannels' permission.
#
# acl-pubsub-default resetchannels

# Command renaming (DEPRECATED).
#
# ------------------------------------------------------------------------
# WARNING: avoid using this option if possible. Instead use ACLs to remove
# commands from the default user, and put them only in some admin user you
# create for administrative purposes.
# ------------------------------------------------------------------------
#
# It is possible to change the name of dangerous commands in a shared
# environment. For instance the CONFIG command may be renamed into something
# hard to guess so that it will still be available for internal-use tools
# but not available for general clients.
#
# Example:
#
# rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52
#
# It is also possible to completely kill a command by renaming it into
# an empty string:
#
# rename-command CONFIG ""
#
# Please note that changing the name of commands that are logged into the
# AOF file or transmitted to replicas may cause problems.

################################### CLIENTS ####################################

# Set the max number of connected clients at the same time. By default
# this limit is set to 10000 clients, however if the Redis server is not
# able to configure the process file limit to allow for the specified limit
# the max number of allowed clients is set to the current file limit
# minus 32 (as Redis reserves a few file descriptors for internal uses).
#
# Once the limit is reached Redis will close all the new connections sending
# an error 'max number of clients reached'.
#
# IMPORTANT: When Redis Cluster is used, the max number of connections is also
# shared with the cluster bus: every node in the cluster will use two
# connections, one incoming and another outgoing. It is important to size the
# limit accordingly in case of very large clusters.
#cyx 最多有10000个客户端同时连接
# maxclients 10000

############################## MEMORY MANAGEMENT ################################

# Set a memory usage limit to the specified amount of bytes.
# When the memory limit is reached Redis will try to remove keys
# according to the eviction policy selected (see maxmemory-policy).
#
# If Redis can't remove keys according to the policy, or if the policy is
# set to 'noeviction', Redis will start to reply with errors to commands
# that would use more memory, like SET, LPUSH, and so on, and will continue
# to reply to read-only commands like GET.
#
# This option is usually useful when using Redis as an LRU or LFU cache, or to
# set a hard memory limit for an instance (using the 'noeviction' policy).
#
# WARNING: If you have replicas attached to an instance with maxmemory on,
# the size of the output buffers needed to feed the replicas are subtracted
# from the used memory count, so that network problems / resyncs will
# not trigger a loop where keys are evicted, and in turn the output
# buffer of replicas is full with DELs of keys evicted triggering the deletion
# of more keys, and so forth until the database is completely emptied.
#
# In short... if you have replicas attached it is suggested that you set a lower
# limit for maxmemory so that there is some free RAM on the system for replica
# output buffers (but this is not needed if the policy is 'noeviction').
# cyx 最大的内存数
# maxmemory <bytes>

# MAXMEMORY POLICY: how Redis will select what to remove when maxmemory
# is reached. You can select one from the following behaviors:
#
# volatile-lru -> Evict using approximated LRU, only keys with an expire set.
# allkeys-lru -> Evict any key using approximated LRU.
# volatile-lfu -> Evict using approximated LFU, only keys with an expire set.
# allkeys-lfu -> Evict any key using approximated LFU.
# volatile-random -> Remove a random key having an expire set.
# allkeys-random -> Remove a random key, any key.
# volatile-ttl -> Remove the key with the nearest expire time (minor TTL)
# noeviction -> Don't evict anything, just return an error on write operations.
#
# LRU means Least Recently Used
# LFU means Least Frequently Used
#
# Both LRU, LFU and volatile-ttl are implemented using approximated
# randomized algorithms.
#
# Note: with any of the above policies, when there are no suitable keys for
# eviction, Redis will return an error on write operations that require
# more memory. These are usually commands that create new keys, add data or
# modify existing keys. A few examples are: SET, INCR, HSET, LPUSH, SUNIONSTORE,
# SORT (due to the STORE argument), and EXEC (if the transaction includes any
# command that requires memory).
#
# The default is:
#cyx 超过最大内存时移除掉其他的key 的策略 
# maxmemory-policy noeviction

# LRU, LFU and minimal TTL algorithms are not precise algorithms but approximated
# algorithms (in order to save memory), so you can tune it for speed or
# accuracy. By default Redis will check five keys and pick the one that was
# used least recently, you can change the sample size using the following
# configuration directive.
#
# The default of 5 produces good enough results. 10 Approximates very closely
# true LRU but costs more CPU. 3 is faster but not very accurate.
#
# maxmemory-samples 5

# Eviction processing is designed to function well with the default setting.
# If there is an unusually large amount of write traffic, this value may need to
# be increased.  Decreasing this value may reduce latency at the risk of
# eviction processing effectiveness
#   0 = minimum latency, 10 = default, 100 = process without regard to latency
#
# maxmemory-eviction-tenacity 10

# Starting from Redis 5, by default a replica will ignore its maxmemory setting
# (unless it is promoted to master after a failover or manually). It means
# that the eviction of keys will be just handled by the master, sending the
# DEL commands to the replica as keys evict in the master side.
#
# This behavior ensures that masters and replicas stay consistent, and is usually
# what you want, however if your replica is writable, or you want the replica
# to have a different memory setting, and you are sure all the writes performed
# to the replica are idempotent, then you may change this default (but be sure
# to understand what you are doing).
#
# Note that since the replica by default does not evict, it may end using more
# memory than the one set via maxmemory (there are certain buffers that may
# be larger on the replica, or data structures may sometimes take more memory
# and so forth). So make sure you monitor your replicas and make sure they
# have enough memory to never hit a real out-of-memory condition before the
# master hits the configured maxmemory setting.
#
# replica-ignore-maxmemory yes

# Redis reclaims expired keys in two ways: upon access when those keys are
# found to be expired, and also in background, in what is called the
# "active expire key". The key space is slowly and interactively scanned
# looking for expired keys to reclaim, so that it is possible to free memory
# of keys that are expired and will never be accessed again in a short time.
#
# The default effort of the expire cycle will try to avoid having more than
# ten percent of expired keys still in memory, and will try to avoid consuming
# more than 25% of total memory and to add latency to the system. However
# it is possible to increase the expire "effort" that is normally set to
# "1", to a greater value, up to the value "10". At its maximum value the
# system will use more CPU, longer cycles (and technically may introduce
# more latency), and will tolerate less already expired keys still present
# in the system. It's a tradeoff between memory, CPU and latency.
#
# active-expire-effort 1

############################# LAZY FREEING ####################################

# Redis has two primitives to delete keys. One is called DEL and is a blocking
# deletion of the object. It means that the server stops processing new commands
# in order to reclaim all the memory associated with an object in a synchronous
# way. If the key deleted is associated with a small object, the time needed
# in order to execute the DEL command is very small and comparable to most other
# O(1) or O(log_N) commands in Redis. However if the key is associated with an
# aggregated value containing millions of elements, the server can block for
# a long time (even seconds) in order to complete the operation.
#
# For the above reasons Redis also offers non blocking deletion primitives
# such as UNLINK (non blocking DEL) and the ASYNC option of FLUSHALL and
# FLUSHDB commands, in order to reclaim memory in background. Those commands
# are executed in constant time. Another thread will incrementally free the
# object in the background as fast as possible.
#
# DEL, UNLINK and ASYNC option of FLUSHALL and FLUSHDB are user-controlled.
# It's up to the design of the application to understand when it is a good
# idea to use one or the other. However the Redis server sometimes has to
# delete keys or flush the whole database as a side effect of other operations.
# Specifically Redis deletes objects independently of a user call in the
# following scenarios:
#
# 1) On eviction, because of the maxmemory and maxmemory policy configurations,
#    in order to make room for new data, without going over the specified
#    memory limit.
# 2) Because of expire: when a key with an associated time to live (see the
#    EXPIRE command) must be deleted from memory.
# 3) Because of a side effect of a command that stores data on a key that may
#    already exist. For example the RENAME command may delete the old key
#    content when it is replaced with another one. Similarly SUNIONSTORE
#    or SORT with STORE option may delete existing keys. The SET command
#    itself removes any old content of the specified key in order to replace
#    it with the specified string.
# 4) During replication, when a replica performs a full resynchronization with
#    its master, the content of the whole database is removed in order to
#    load the RDB file just transferred.
#
# In all the above cases the default is to delete objects in a blocking way,
# like if DEL was called. However you can configure each case specifically
# in order to instead release memory in a non-blocking way like if UNLINK
# was called, using the following configuration directives.

lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no

# It is also possible, for the case when to replace the user code DEL calls
# with UNLINK calls is not easy, to modify the default behavior of the DEL
# command to act exactly like UNLINK, using the following configuration
# directive:

lazyfree-lazy-user-del no

# FLUSHDB, FLUSHALL, SCRIPT FLUSH and FUNCTION FLUSH support both asynchronous and synchronous
# deletion, which can be controlled by passing the [SYNC|ASYNC] flags into the
# commands. When neither flag is passed, this directive will be used to determine
# if the data should be deleted asynchronously.

lazyfree-lazy-user-flush no

################################ THREADED I/O #################################

# Redis is mostly single threaded, however there are certain threaded
# operations such as UNLINK, slow I/O accesses and other things that are
# performed on side threads.
#
# Now it is also possible to handle Redis clients socket reads and writes
# in different I/O threads. Since especially writing is so slow, normally
# Redis users use pipelining in order to speed up the Redis performances per
# core, and spawn multiple instances in order to scale more. Using I/O
# threads it is possible to easily speedup two times Redis without resorting
# to pipelining nor sharding of the instance.
#
# By default threading is disabled, we suggest enabling it only in machines
# that have at least 4 or more cores, leaving at least one spare core.
# Using more than 8 threads is unlikely to help much. We also recommend using
# threaded I/O only if you actually have performance problems, with Redis
# instances being able to use a quite big percentage of CPU time, otherwise
# there is no point in using this feature.
#
# So for instance if you have a four cores boxes, try to use 2 or 3 I/O
# threads, if you have a 8 cores, try to use 6 threads. In order to
# enable I/O threads use the following configuration directive:
#
# io-threads 4
#
# Setting io-threads to 1 will just use the main thread as usual.
# When I/O threads are enabled, we only use threads for writes, that is
# to thread the write(2) syscall and transfer the client buffers to the
# socket. However it is also possible to enable threading of reads and
# protocol parsing using the following configuration directive, by setting
# it to yes:
#
# io-threads-do-reads no
#
# Usually threading reads doesn't help much.
#
# NOTE 1: This configuration directive cannot be changed at runtime via
# CONFIG SET. Also, this feature currently does not work when SSL is
# enabled.
#
# NOTE 2: If you want to test the Redis speedup using redis-benchmark, make
# sure you also run the benchmark itself in threaded mode, using the
# --threads option to match the number of Redis threads, otherwise you'll not
# be able to notice the improvements.

############################ KERNEL OOM CONTROL ##############################

# On Linux, it is possible to hint the kernel OOM killer on what processes
# should be killed first when out of memory.
#
# Enabling this feature makes Redis actively control the oom_score_adj value
# for all its processes, depending on their role. The default scores will
# attempt to have background child processes killed before all others, and
# replicas killed before masters.
#
# Redis supports these options:
#
# no:       Don't make changes to oom-score-adj (default).
# yes:      Alias to "relative" see below.
# absolute: Values in oom-score-adj-values are written as is to the kernel.
# relative: Values are used relative to the initial value of oom_score_adj when
#           the server starts and are then clamped to a range of -1000 to 1000.
#           Because typically the initial value is 0, they will often match the
#           absolute values.
oom-score-adj no

# When oom-score-adj is used, this directive controls the specific values used
# for master, replica and background child processes. Values range -2000 to
# 2000 (higher means more likely to be killed).
#
# Unprivileged processes (not root, and without CAP_SYS_RESOURCE capabilities)
# can freely increase their value, but not decrease it below its initial
# settings. This means that setting oom-score-adj to "relative" and setting the
# oom-score-adj-values to positive values will always succeed.
oom-score-adj-values 0 200 800


#################### KERNEL transparent hugepage CONTROL ######################

# Usually the kernel Transparent Huge Pages control is set to "madvise" or
# or "never" by default (/sys/kernel/mm/transparent_hugepage/enabled), in which
# case this config has no effect. On systems in which it is set to "always",
# redis will attempt to disable it specifically for the redis process in order
# to avoid latency problems specifically with fork(2) and CoW.
# If for some reason you prefer to keep it enabled, you can set this config to
# "no" and the kernel global to "always".

disable-thp yes

############################## APPEND ONLY MODE ###############################

# By default Redis asynchronously dumps the dataset on disk. This mode is
# good enough in many applications, but an issue with the Redis process or
# a power outage may result into a few minutes of writes lost (depending on
# the configured save points).
#
# The Append Only File is an alternative persistence mode that provides
# much better durability. For instance using the default data fsync policy
# (see later in the config file) Redis can lose just one second of writes in a
# dramatic event like a server power outage, or a single write if something
# wrong with the Redis process itself happens, but the operating system is
# still running correctly.
#
# AOF and RDB persistence can be enabled at the same time without problems.
# If the AOF is enabled on startup Redis will load the AOF, that is the file
# with the better durability guarantees.
#
# Please check https://redis.io/topics/persistence for more information.

appendonly no

# The base name of the append only file.
#
# Redis 7 and newer use a set of append-only files to persist the dataset
# and changes applied to it. There are two basic types of files in use:
#
# - Base files, which are a snapshot representing the complete state of the
#   dataset at the time the file was created. Base files can be either in
#   the form of RDB (binary serialized) or AOF (textual commands).
# - Incremental files, which contain additional commands that were applied
#   to the dataset following the previous file.
#
# In addition, manifest files are used to track the files and the order in
# which they were created and should be applied.
#
# Append-only file names are created by Redis following a specific pattern.
# The file name's prefix is based on the 'appendfilename' configuration
# parameter, followed by additional information about the sequence and type.
#
# For example, if appendfilename is set to appendonly.aof, the following file
# names could be derived:
#
# - appendonly.aof.1.base.rdb as a base file.
# - appendonly.aof.1.incr.aof, appendonly.aof.2.incr.aof as incremental files.
# - appendonly.aof.manifest as a manifest file.

appendfilename "appendonly.aof"

# For convenience, Redis stores all persistent append-only files in a dedicated
# directory. The name of the directory is determined by the appenddirname
# configuration parameter.

appenddirname "appendonlydir"

# The fsync() call tells the Operating System to actually write data on disk
# instead of waiting for more data in the output buffer. Some OS will really flush
# data on disk, some other OS will just try to do it ASAP.
#
# Redis supports three different modes:
#
# no: don't fsync, just let the OS flush the data when it wants. Faster.
# always: fsync after every write to the append only log. Slow, Safest.
# everysec: fsync only one time every second. Compromise.
#
# The default is "everysec", as that's usually the right compromise between
# speed and data safety. It's up to you to understand if you can relax this to
# "no" that will let the operating system flush the output buffer when
# it wants, for better performances (but if you can live with the idea of
# some data loss consider the default persistence mode that's snapshotting),
# or on the contrary, use "always" that's very slow but a bit safer than
# everysec.
#
# More details please check the following article:
# http://antirez.com/post/redis-persistence-demystified.html
#
# If unsure, use "everysec".

# appendfsync always
appendfsync everysec
# appendfsync no

# When the AOF fsync policy is set to always or everysec, and a background
# saving process (a background save or AOF log background rewriting) is
# performing a lot of I/O against the disk, in some Linux configurations
# Redis may block too long on the fsync() call. Note that there is no fix for
# this currently, as even performing fsync in a different thread will block
# our synchronous write(2) call.
#
# In order to mitigate this problem it's possible to use the following option
# that will prevent fsync() from being called in the main process while a
# BGSAVE or BGREWRITEAOF is in progress.
#
# This means that while another child is saving, the durability of Redis is
# the same as "appendfsync no". In practical terms, this means that it is
# possible to lose up to 30 seconds of log in the worst scenario (with the
# default Linux settings).
#
# If you have latency problems turn this to "yes". Otherwise leave it as
# "no" that is the safest pick from the point of view of durability.

no-appendfsync-on-rewrite no

# Automatic rewrite of the append only file.
# Redis is able to automatically rewrite the log file implicitly calling
# BGREWRITEAOF when the AOF log size grows by the specified percentage.
#
# This is how it works: Redis remembers the size of the AOF file after the
# latest rewrite (if no rewrite has happened since the restart, the size of
# the AOF at startup is used).
#
# This base size is compared to the current size. If the current size is
# bigger than the specified percentage, the rewrite is triggered. Also
# you need to specify a minimal size for the AOF file to be rewritten, this
# is useful to avoid rewriting the AOF file even if the percentage increase
# is reached but it is still pretty small.
#
# Specify a percentage of zero in order to disable the automatic AOF
# rewrite feature.

auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# An AOF file may be found to be truncated at the end during the Redis
# startup process, when the AOF data gets loaded back into memory.
# This may happen when the system where Redis is running
# crashes, especially when an ext4 filesystem is mounted without the
# data=ordered option (however this can't happen when Redis itself
# crashes or aborts but the operating system still works correctly).
#
# Redis can either exit with an error when this happens, or load as much
# data as possible (the default now) and start if the AOF file is found
# to be truncated at the end. The following option controls this behavior.
#
# If aof-load-truncated is set to yes, a truncated AOF file is loaded and
# the Redis server starts emitting a log to inform the user of the event.
# Otherwise if the option is set to no, the server aborts with an error
# and refuses to start. When the option is set to no, the user requires
# to fix the AOF file using the "redis-check-aof" utility before to restart
# the server.
#
# Note that if the AOF file will be found to be corrupted in the middle
# the server will still exit with an error. This option only applies when
# Redis will try to read more data from the AOF file but not enough bytes
# will be found.
aof-load-truncated yes

# Redis can create append-only base files in either RDB or AOF formats. Using
# the RDB format is always faster and more efficient, and disabling it is only
# supported for backward compatibility purposes.
aof-use-rdb-preamble yes

# Redis supports recording timestamp annotations in the AOF to support restoring
# the data from a specific point-in-time. However, using this capability changes
# the AOF format in a way that may not be compatible with existing AOF parsers.
aof-timestamp-enabled no

################################ SHUTDOWN #####################################

# Maximum time to wait for replicas when shutting down, in seconds.
#
# During shut down, a grace period allows any lagging replicas to catch up with
# the latest replication offset before the master exists. This period can
# prevent data loss, especially for deployments without configured disk backups.
#
# The 'shutdown-timeout' value is the grace period's duration in seconds. It is
# only applicable when the instance has replicas. To disable the feature, set
# the value to 0.
#
# shutdown-timeout 10

# When Redis receives a SIGINT or SIGTERM, shutdown is initiated and by default
# an RDB snapshot is written to disk in a blocking operation if save points are configured.
# The options used on signaled shutdown can include the following values:
# default:  Saves RDB snapshot only if save points are configured.
#           Waits for lagging replicas to catch up.
# save:     Forces a DB saving operation even if no save points are configured.
# nosave:   Prevents DB saving operation even if one or more save points are configured.
# now:      Skips waiting for lagging replicas.
# force:    Ignores any errors that would normally prevent the server from exiting.
#
# Any combination of values is allowed as long as "save" and "nosave" are not set simultaneously.
# Example: "nosave force now"
#
# shutdown-on-sigint default
# shutdown-on-sigterm default

################ NON-DETERMINISTIC LONG BLOCKING COMMANDS #####################

# Maximum time in milliseconds for EVAL scripts, functions and in some cases
# modules' commands before Redis can start processing or rejecting other clients.
#
# If the maximum execution time is reached Redis will start to reply to most
# commands with a BUSY error.
#
# In this state Redis will only allow a handful of commands to be executed.
# For instance, SCRIPT KILL, FUNCTION KILL, SHUTDOWN NOSAVE and possibly some
# module specific 'allow-busy' commands.
#
# SCRIPT KILL and FUNCTION KILL will only be able to stop a script that did not
# yet call any write commands, so SHUTDOWN NOSAVE may be the only way to stop
# the server in the case a write command was already issued by the script when
# the user doesn't want to wait for the natural termination of the script.
#
# The default is 5 seconds. It is possible to set it to 0 or a negative value
# to disable this mechanism (uninterrupted execution). Note that in the past
# this config had a different name, which is now an alias, so both of these do
# the same:
# lua-time-limit 5000
# busy-reply-threshold 5000

################################ REDIS CLUSTER  ###############################

# Normal Redis instances can't be part of a Redis Cluster; only nodes that are
# started as cluster nodes can. In order to start a Redis instance as a
# cluster node enable the cluster support uncommenting the following:
#
# cluster-enabled yes

# Every cluster node has a cluster configuration file. This file is not
# intended to be edited by hand. It is created and updated by Redis nodes.
# Every Redis Cluster node requires a different cluster configuration file.
# Make sure that instances running in the same system do not have
# overlapping cluster configuration file names.
#
# cluster-config-file nodes-6379.conf

# Cluster node timeout is the amount of milliseconds a node must be unreachable
# for it to be considered in failure state.
# Most other internal time limits are a multiple of the node timeout.
#
# cluster-node-timeout 15000

# The cluster port is the port that the cluster bus will listen for inbound connections on. When set 
# to the default value, 0, it will be bound to the command port + 10000. Setting this value requires 
# you to specify the cluster bus port when executing cluster meet.
# cluster-port 0

# A replica of a failing master will avoid to start a failover if its data
# looks too old.
#
# There is no simple way for a replica to actually have an exact measure of
# its "data age", so the following two checks are performed:
#
# 1) If there are multiple replicas able to failover, they exchange messages
#    in order to try to give an advantage to the replica with the best
#    replication offset (more data from the master processed).
#    Replicas will try to get their rank by offset, and apply to the start
#    of the failover a delay proportional to their rank.
#
# 2) Every single replica computes the time of the last interaction with
#    its master. This can be the last ping or command received (if the master
#    is still in the "connected" state), or the time that elapsed since the
#    disconnection with the master (if the replication link is currently down).
#    If the last interaction is too old, the replica will not try to failover
#    at all.
#
# The point "2" can be tuned by user. Specifically a replica will not perform
# the failover if, since the last interaction with the master, the time
# elapsed is greater than:
#
#   (node-timeout * cluster-replica-validity-factor) + repl-ping-replica-period
#
# So for example if node-timeout is 30 seconds, and the cluster-replica-validity-factor
# is 10, and assuming a default repl-ping-replica-period of 10 seconds, the
# replica will not try to failover if it was not able to talk with the master
# for longer than 310 seconds.
#
# A large cluster-replica-validity-factor may allow replicas with too old data to failover
# a master, while a too small value may prevent the cluster from being able to
# elect a replica at all.
#
# For maximum availability, it is possible to set the cluster-replica-validity-factor
# to a value of 0, which means, that replicas will always try to failover the
# master regardless of the last time they interacted with the master.
# (However they'll always try to apply a delay proportional to their
# offset rank).
#
# Zero is the only value able to guarantee that when all the partitions heal
# the cluster will always be able to continue.
#
# cluster-replica-validity-factor 10

# Cluster replicas are able to migrate to orphaned masters, that are masters
# that are left without working replicas. This improves the cluster ability
# to resist to failures as otherwise an orphaned master can't be failed over
# in case of failure if it has no working replicas.
#
# Replicas migrate to orphaned masters only if there are still at least a
# given number of other working replicas for their old master. This number
# is the "migration barrier". A migration barrier of 1 means that a replica
# will migrate only if there is at least 1 other working replica for its master
# and so forth. It usually reflects the number of replicas you want for every
# master in your cluster.
#
# Default is 1 (replicas migrate only if their masters remain with at least
# one replica). To disable migration just set it to a very large value or
# set cluster-allow-replica-migration to 'no'.
# A value of 0 can be set but is useful only for debugging and dangerous
# in production.
#
# cluster-migration-barrier 1

# Turning off this option allows to use less automatic cluster configuration.
# It both disables migration to orphaned masters and migration from masters
# that became empty.
#
# Default is 'yes' (allow automatic migrations).
#
# cluster-allow-replica-migration yes

# By default Redis Cluster nodes stop accepting queries if they detect there
# is at least a hash slot uncovered (no available node is serving it).
# This way if the cluster is partially down (for example a range of hash slots
# are no longer covered) all the cluster becomes, eventually, unavailable.
# It automatically returns available as soon as all the slots are covered again.
#
# However sometimes you want the subset of the cluster which is working,
# to continue to accept queries for the part of the key space that is still
# covered. In order to do so, just set the cluster-require-full-coverage
# option to no.
#
# cluster-require-full-coverage yes

# This option, when set to yes, prevents replicas from trying to failover its
# master during master failures. However the replica can still perform a
# manual failover, if forced to do so.
#
# This is useful in different scenarios, especially in the case of multiple
# data center operations, where we want one side to never be promoted if not
# in the case of a total DC failure.
#
# cluster-replica-no-failover no

# This option, when set to yes, allows nodes to serve read traffic while the
# cluster is in a down state, as long as it believes it owns the slots.
#
# This is useful for two cases.  The first case is for when an application
# doesn't require consistency of data during node failures or network partitions.
# One example of this is a cache, where as long as the node has the data it
# should be able to serve it.
#
# The second use case is for configurations that don't meet the recommended
# three shards but want to enable cluster mode and scale later. A
# master outage in a 1 or 2 shard configuration causes a read/write outage to the
# entire cluster without this option set, with it set there is only a write outage.
# Without a quorum of masters, slot ownership will not change automatically.
#
# cluster-allow-reads-when-down no

# This option, when set to yes, allows nodes to serve pubsub shard traffic while
# the cluster is in a down state, as long as it believes it owns the slots.
#
# This is useful if the application would like to use the pubsub feature even when
# the cluster global stable state is not OK. If the application wants to make sure only
# one shard is serving a given channel, this feature should be kept as yes.
#
# cluster-allow-pubsubshard-when-down yes

# Cluster link send buffer limit is the limit on the memory usage of an individual
# cluster bus link's send buffer in bytes. Cluster links would be freed if they exceed
# this limit. This is to primarily prevent send buffers from growing unbounded on links
# toward slow peers (E.g. PubSub messages being piled up).
# This limit is disabled by default. Enable this limit when 'mem_cluster_links' INFO field
# and/or 'send-buffer-allocated' entries in the 'CLUSTER LINKS` command output continuously increase.
# Minimum limit of 1gb is recommended so that cluster link buffer can fit in at least a single
# PubSub message by default. (client-query-buffer-limit default value is 1gb)
#
# cluster-link-sendbuf-limit 0
 
# Clusters can configure their announced hostname using this config. This is a common use case for 
# applications that need to use TLS Server Name Indication (SNI) or dealing with DNS based
# routing. By default this value is only shown as additional metadata in the CLUSTER SLOTS
# command, but can be changed using 'cluster-preferred-endpoint-type' config. This value is 
# communicated along the clusterbus to all nodes, setting it to an empty string will remove 
# the hostname and also propagate the removal.
#
# cluster-announce-hostname ""

# Clusters can advertise how clients should connect to them using either their IP address,
# a user defined hostname, or by declaring they have no endpoint. Which endpoint is
# shown as the preferred endpoint is set by using the cluster-preferred-endpoint-type
# config with values 'ip', 'hostname', or 'unknown-endpoint'. This value controls how
# the endpoint returned for MOVED/ASKING requests as well as the first field of CLUSTER SLOTS. 
# If the preferred endpoint type is set to hostname, but no announced hostname is set, a '?' 
# will be returned instead.
#
# When a cluster advertises itself as having an unknown endpoint, it's indicating that
# the server doesn't know how clients can reach the cluster. This can happen in certain 
# networking situations where there are multiple possible routes to the node, and the 
# server doesn't know which one the client took. In this case, the server is expecting
# the client to reach out on the same endpoint it used for making the last request, but use
# the port provided in the response.
#
# cluster-preferred-endpoint-type ip

# In order to setup your cluster make sure to read the documentation
# available at https://redis.io web site.

########################## CLUSTER DOCKER/NAT support  ########################

# In certain deployments, Redis Cluster nodes address discovery fails, because
# addresses are NAT-ted or because ports are forwarded (the typical case is
# Docker and other containers).
#
# In order to make Redis Cluster working in such environments, a static
# configuration where each node knows its public address is needed. The
# following four options are used for this scope, and are:
#
# * cluster-announce-ip
# * cluster-announce-port
# * cluster-announce-tls-port
# * cluster-announce-bus-port
#
# Each instructs the node about its address, client ports (for connections
# without and with TLS) and cluster message bus port. The information is then
# published in the header of the bus packets so that other nodes will be able to
# correctly map the address of the node publishing the information.
#
# If cluster-tls is set to yes and cluster-announce-tls-port is omitted or set
# to zero, then cluster-announce-port refers to the TLS port. Note also that
# cluster-announce-tls-port has no effect if cluster-tls is set to no.
#
# If the above options are not used, the normal Redis Cluster auto-detection
# will be used instead.
#
# Note that when remapped, the bus port may not be at the fixed offset of
# clients port + 10000, so you can specify any port and bus-port depending
# on how they get remapped. If the bus-port is not set, a fixed offset of
# 10000 will be used as usual.
#
# Example:
#
# cluster-announce-ip 10.1.1.5
# cluster-announce-tls-port 6379
# cluster-announce-port 0
# cluster-announce-bus-port 6380

################################## SLOW LOG ###################################

# The Redis Slow Log is a system to log queries that exceeded a specified
# execution time. The execution time does not include the I/O operations
# like talking with the client, sending the reply and so forth,
# but just the time needed to actually execute the command (this is the only
# stage of command execution where the thread is blocked and can not serve
# other requests in the meantime).
#
# You can configure the slow log with two parameters: one tells Redis
# what is the execution time, in microseconds, to exceed in order for the
# command to get logged, and the other parameter is the length of the
# slow log. When a new command is logged the oldest one is removed from the
# queue of logged commands.

# The following time is expressed in microseconds, so 1000000 is equivalent
# to one second. Note that a negative number disables the slow log, while
# a value of zero forces the logging of every command.
slowlog-log-slower-than 10000

# There is no limit to this length. Just be aware that it will consume memory.
# You can reclaim memory used by the slow log with SLOWLOG RESET.
slowlog-max-len 128

################################ LATENCY MONITOR ##############################

# The Redis latency monitoring subsystem samples different operations
# at runtime in order to collect data related to possible sources of
# latency of a Redis instance.
#
# Via the LATENCY command this information is available to the user that can
# print graphs and obtain reports.
#
# The system only logs operations that were performed in a time equal or
# greater than the amount of milliseconds specified via the
# latency-monitor-threshold configuration directive. When its value is set
# to zero, the latency monitor is turned off.
#
# By default latency monitoring is disabled since it is mostly not needed
# if you don't have latency issues, and collecting data has a performance
# impact, that while very small, can be measured under big load. Latency
# monitoring can easily be enabled at runtime using the command
# "CONFIG SET latency-monitor-threshold <milliseconds>" if needed.
latency-monitor-threshold 0

################################ LATENCY TRACKING ##############################

# The Redis extended latency monitoring tracks the per command latencies and enables
# exporting the percentile distribution via the INFO latencystats command,
# and cumulative latency distributions (histograms) via the LATENCY command.
#
# By default, the extended latency monitoring is enabled since the overhead
# of keeping track of the command latency is very small.
# latency-tracking yes

# By default the exported latency percentiles via the INFO latencystats command
# are the p50, p99, and p999.
# latency-tracking-info-percentiles 50 99 99.9

############################# EVENT NOTIFICATION ##############################

# Redis can notify Pub/Sub clients about events happening in the key space.
# This feature is documented at https://redis.io/topics/notifications
#
# For instance if keyspace events notification is enabled, and a client
# performs a DEL operation on key "foo" stored in the Database 0, two
# messages will be published via Pub/Sub:
#
# PUBLISH __keyspace@0__:foo del
# PUBLISH __keyevent@0__:del foo
#
# It is possible to select the events that Redis will notify among a set
# of classes. Every class is identified by a single character:
#
#  K     Keyspace events, published with __keyspace@<db>__ prefix.
#  E     Keyevent events, published with __keyevent@<db>__ prefix.
#  g     Generic commands (non-type specific) like DEL, EXPIRE, RENAME, ...
#  $     String commands
#  l     List commands
#  s     Set commands
#  h     Hash commands
#  z     Sorted set commands
#  x     Expired events (events generated every time a key expires)
#  e     Evicted events (events generated when a key is evicted for maxmemory)
#  n     New key events (Note: not included in the 'A' class)
#  t     Stream commands
#  d     Module key type events
#  m     Key-miss events (Note: It is not included in the 'A' class)
#  A     Alias for g$lshzxetd, so that the "AKE" string means all the events
#        (Except key-miss events which are excluded from 'A' due to their
#         unique nature).
#
#  The "notify-keyspace-events" takes as argument a string that is composed
#  of zero or multiple characters. The empty string means that notifications
#  are disabled.
#
#  Example: to enable list and generic events, from the point of view of the
#           event name, use:
#
#  notify-keyspace-events Elg
#
#  Example 2: to get the stream of the expired keys subscribing to channel
#             name __keyevent@0__:expired use:
#
#  notify-keyspace-events Ex
#
#  By default all notifications are disabled because most users don't need
#  this feature and the feature has some overhead. Note that if you don't
#  specify at least one of K or E, no events will be delivered.
notify-keyspace-events ""

############################### ADVANCED CONFIG ###############################

# Hashes are encoded using a memory efficient data structure when they have a
# small number of entries, and the biggest entry does not exceed a given
# threshold. These thresholds can be configured using the following directives.
hash-max-listpack-entries 512
hash-max-listpack-value 64

# Lists are also encoded in a special way to save a lot of space.
# The number of entries allowed per internal list node can be specified
# as a fixed maximum size or a maximum number of elements.
# For a fixed maximum size, use -5 through -1, meaning:
# -5: max size: 64 Kb  <-- not recommended for normal workloads
# -4: max size: 32 Kb  <-- not recommended
# -3: max size: 16 Kb  <-- probably not recommended
# -2: max size: 8 Kb   <-- good
# -1: max size: 4 Kb   <-- good
# Positive numbers mean store up to _exactly_ that number of elements
# per list node.
# The highest performing option is usually -2 (8 Kb size) or -1 (4 Kb size),
# but if your use case is unique, adjust the settings as necessary.
list-max-listpack-size -2

# Lists may also be compressed.
# Compress depth is the number of quicklist ziplist nodes from *each* side of
# the list to *exclude* from compression.  The head and tail of the list
# are always uncompressed for fast push/pop operations.  Settings are:
# 0: disable all list compression
# 1: depth 1 means "don't start compressing until after 1 node into the list,
#    going from either the head or tail"
#    So: [head]->node->node->...->node->[tail]
#    [head], [tail] will always be uncompressed; inner nodes will compress.
# 2: [head]->[next]->node->node->...->node->[prev]->[tail]
#    2 here means: don't compress head or head->next or tail->prev or tail,
#    but compress all nodes between them.
# 3: [head]->[next]->[next]->node->node->...->node->[prev]->[prev]->[tail]
# etc.
list-compress-depth 0

# Sets have a special encoding in just one case: when a set is composed
# of just strings that happen to be integers in radix 10 in the range
# of 64 bit signed integers.
# The following configuration setting sets the limit in the size of the
# set in order to use this special memory saving encoding.
set-max-intset-entries 512

# Similarly to hashes and lists, sorted sets are also specially encoded in
# order to save a lot of space. This encoding is only used when the length and
# elements of a sorted set are below the following limits:
zset-max-listpack-entries 128
zset-max-listpack-value 64

# HyperLogLog sparse representation bytes limit. The limit includes the
# 16 bytes header. When an HyperLogLog using the sparse representation crosses
# this limit, it is converted into the dense representation.
#
# A value greater than 16000 is totally useless, since at that point the
# dense representation is more memory efficient.
#
# The suggested value is ~ 3000 in order to have the benefits of
# the space efficient encoding without slowing down too much PFADD,
# which is O(N) with the sparse encoding. The value can be raised to
# ~ 10000 when CPU is not a concern, but space is, and the data set is
# composed of many HyperLogLogs with cardinality in the 0 - 15000 range.
hll-sparse-max-bytes 3000

# Streams macro node max size / items. The stream data structure is a radix
# tree of big nodes that encode multiple items inside. Using this configuration
# it is possible to configure how big a single node can be in bytes, and the
# maximum number of items it may contain before switching to a new node when
# appending new stream entries. If any of the following settings are set to
# zero, the limit is ignored, so for instance it is possible to set just a
# max entries limit by setting max-bytes to 0 and max-entries to the desired
# value.
stream-node-max-bytes 4096
stream-node-max-entries 100

# Active rehashing uses 1 millisecond every 100 milliseconds of CPU time in
# order to help rehashing the main Redis hash table (the one mapping top-level
# keys to values). The hash table implementation Redis uses (see dict.c)
# performs a lazy rehashing: the more operation you run into a hash table
# that is rehashing, the more rehashing "steps" are performed, so if the
# server is idle the rehashing is never complete and some more memory is used
# by the hash table.
#
# The default is to use this millisecond 10 times every second in order to
# actively rehash the main dictionaries, freeing memory when possible.
#
# If unsure:
# use "activerehashing no" if you have hard latency requirements and it is
# not a good thing in your environment that Redis can reply from time to time
# to queries with 2 milliseconds delay.
#
# use "activerehashing yes" if you don't have such hard requirements but
# want to free memory asap when possible.
activerehashing yes

# The client output buffer limits can be used to force disconnection of clients
# that are not reading data from the server fast enough for some reason (a
# common reason is that a Pub/Sub client can't consume messages as fast as the
# publisher can produce them).
#
# The limit can be set differently for the three different classes of clients:
#
# normal -> normal clients including MONITOR clients
# replica -> replica clients
# pubsub -> clients subscribed to at least one pubsub channel or pattern
#
# The syntax of every client-output-buffer-limit directive is the following:
#
# client-output-buffer-limit <class> <hard limit> <soft limit> <soft seconds>
#
# A client is immediately disconnected once the hard limit is reached, or if
# the soft limit is reached and remains reached for the specified number of
# seconds (continuously).
# So for instance if the hard limit is 32 megabytes and the soft limit is
# 16 megabytes / 10 seconds, the client will get disconnected immediately
# if the size of the output buffers reach 32 megabytes, but will also get
# disconnected if the client reaches 16 megabytes and continuously overcomes
# the limit for 10 seconds.
#
# By default normal clients are not limited because they don't receive data
# without asking (in a push way), but just after a request, so only
# asynchronous clients may create a scenario where data is requested faster
# than it can read.
#
# Instead there is a default limit for pubsub and replica clients, since
# subscribers and replicas receive data in a push fashion.
#
# Note that it doesn't make sense to set the replica clients output buffer
# limit lower than the repl-backlog-size config (partial sync will succeed
# and then replica will get disconnected).
# Such a configuration is ignored (the size of repl-backlog-size will be used).
# This doesn't have memory consumption implications since the replica client
# will share the backlog buffers memory.
#
# Both the hard or the soft limit can be disabled by setting them to zero.
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60

# Client query buffers accumulate new commands. They are limited to a fixed
# amount by default in order to avoid that a protocol desynchronization (for
# instance due to a bug in the client) will lead to unbound memory usage in
# the query buffer. However you can configure it here if you have very special
# needs, such us huge multi/exec requests or alike.
#
# client-query-buffer-limit 1gb

# In some scenarios client connections can hog up memory leading to OOM
# errors or data eviction. To avoid this we can cap the accumulated memory
# used by all client connections (all pubsub and normal clients). Once we
# reach that limit connections will be dropped by the server freeing up
# memory. The server will attempt to drop the connections using the most 
# memory first. We call this mechanism "client eviction".
#
# Client eviction is configured using the maxmemory-clients setting as follows:
# 0 - client eviction is disabled (default)
#
# A memory value can be used for the client eviction threshold,
# for example:
# maxmemory-clients 1g
#
# A percentage value (between 1% and 100%) means the client eviction threshold
# is based on a percentage of the maxmemory setting. For example to set client
# eviction at 5% of maxmemory:
# maxmemory-clients 5%

# In the Redis protocol, bulk requests, that are, elements representing single
# strings, are normally limited to 512 mb. However you can change this limit
# here, but must be 1mb or greater
#
# proto-max-bulk-len 512mb

# Redis calls an internal function to perform many background tasks, like
# closing connections of clients in timeout, purging expired keys that are
# never requested, and so forth.
#
# Not all tasks are performed with the same frequency, but Redis checks for
# tasks to perform according to the specified "hz" value.
#
# By default "hz" is set to 10. Raising the value will use more CPU when
# Redis is idle, but at the same time will make Redis more responsive when
# there are many keys expiring at the same time, and timeouts may be
# handled with more precision.
#
# The range is between 1 and 500, however a value over 100 is usually not
# a good idea. Most users should use the default of 10 and raise this up to
# 100 only in environments where very low latency is required.
hz 10

# Normally it is useful to have an HZ value which is proportional to the
# number of clients connected. This is useful in order, for instance, to
# avoid too many clients are processed for each background task invocation
# in order to avoid latency spikes.
#
# Since the default HZ value by default is conservatively set to 10, Redis
# offers, and enables by default, the ability to use an adaptive HZ value
# which will temporarily raise when there are many connected clients.
#
# When dynamic HZ is enabled, the actual configured HZ will be used
# as a baseline, but multiples of the configured HZ value will be actually
# used as needed once more clients are connected. In this way an idle
# instance will use very little CPU time while a busy instance will be
# more responsive.
dynamic-hz yes

# When a child rewrites the AOF file, if the following option is enabled
# the file will be fsync-ed every 4 MB of data generated. This is useful
# in order to commit the file to the disk more incrementally and avoid
# big latency spikes.
aof-rewrite-incremental-fsync yes

# When redis saves RDB file, if the following option is enabled
# the file will be fsync-ed every 4 MB of data generated. This is useful
# in order to commit the file to the disk more incrementally and avoid
# big latency spikes.
rdb-save-incremental-fsync yes

# Redis LFU eviction (see maxmemory setting) can be tuned. However it is a good
# idea to start with the default settings and only change them after investigating
# how to improve the performances and how the keys LFU change over time, which
# is possible to inspect via the OBJECT FREQ command.
#
# There are two tunable parameters in the Redis LFU implementation: the
# counter logarithm factor and the counter decay time. It is important to
# understand what the two parameters mean before changing them.
#
# The LFU counter is just 8 bits per key, it's maximum value is 255, so Redis
# uses a probabilistic increment with logarithmic behavior. Given the value
# of the old counter, when a key is accessed, the counter is incremented in
# this way:
#
# 1. A random number R between 0 and 1 is extracted.
# 2. A probability P is calculated as 1/(old_value*lfu_log_factor+1).
# 3. The counter is incremented only if R < P.
#
# The default lfu-log-factor is 10. This is a table of how the frequency
# counter changes with a different number of accesses with different
# logarithmic factors:
#
# +--------+------------+------------+------------+------------+------------+
# | factor | 100 hits   | 1000 hits  | 100K hits  | 1M hits    | 10M hits   |
# +--------+------------+------------+------------+------------+------------+
# | 0      | 104        | 255        | 255        | 255        | 255        |
# +--------+------------+------------+------------+------------+------------+
# | 1      | 18         | 49         | 255        | 255        | 255        |
# +--------+------------+------------+------------+------------+------------+
# | 10     | 10         | 18         | 142        | 255        | 255        |
# +--------+------------+------------+------------+------------+------------+
# | 100    | 8          | 11         | 49         | 143        | 255        |
# +--------+------------+------------+------------+------------+------------+
#
# NOTE: The above table was obtained by running the following commands:
#
#   redis-benchmark -n 1000000 incr foo
#   redis-cli object freq foo
#
# NOTE 2: The counter initial value is 5 in order to give new objects a chance
# to accumulate hits.
#
# The counter decay time is the time, in minutes, that must elapse in order
# for the key counter to be divided by two (or decremented if it has a value
# less <= 10).
#
# The default value for the lfu-decay-time is 1. A special value of 0 means to
# decay the counter every time it happens to be scanned.
#
# lfu-log-factor 10
# lfu-decay-time 1

########################### ACTIVE DEFRAGMENTATION #######################
#
# What is active defragmentation?
# -------------------------------
#
# Active (online) defragmentation allows a Redis server to compact the
# spaces left between small allocations and deallocations of data in memory,
# thus allowing to reclaim back memory.
#
# Fragmentation is a natural process that happens with every allocator (but
# less so with Jemalloc, fortunately) and certain workloads. Normally a server
# restart is needed in order to lower the fragmentation, or at least to flush
# away all the data and create it again. However thanks to this feature
# implemented by Oran Agra for Redis 4.0 this process can happen at runtime
# in a "hot" way, while the server is running.
#
# Basically when the fragmentation is over a certain level (see the
# configuration options below) Redis will start to create new copies of the
# values in contiguous memory regions by exploiting certain specific Jemalloc
# features (in order to understand if an allocation is causing fragmentation
# and to allocate it in a better place), and at the same time, will release the
# old copies of the data. This process, repeated incrementally for all the keys
# will cause the fragmentation to drop back to normal values.
#
# Important things to understand:
#
# 1. This feature is disabled by default, and only works if you compiled Redis
#    to use the copy of Jemalloc we ship with the source code of Redis.
#    This is the default with Linux builds.
#
# 2. You never need to enable this feature if you don't have fragmentation
#    issues.
#
# 3. Once you experience fragmentation, you can enable this feature when
#    needed with the command "CONFIG SET activedefrag yes".
#
# The configuration parameters are able to fine tune the behavior of the
# defragmentation process. If you are not sure about what they mean it is
# a good idea to leave the defaults untouched.

# Active defragmentation is disabled by default
# activedefrag no

# Minimum amount of fragmentation waste to start active defrag
# active-defrag-ignore-bytes 100mb

# Minimum percentage of fragmentation to start active defrag
# active-defrag-threshold-lower 10

# Maximum percentage of fragmentation at which we use maximum effort
# active-defrag-threshold-upper 100

# Minimal effort for defrag in CPU percentage, to be used when the lower
# threshold is reached
# active-defrag-cycle-min 1

# Maximal effort for defrag in CPU percentage, to be used when the upper
# threshold is reached
# active-defrag-cycle-max 25

# Maximum number of set/hash/zset/list fields that will be processed from
# the main dictionary scan
# active-defrag-max-scan-fields 1000

# Jemalloc background thread for purging will be enabled by default
jemalloc-bg-thread yes

# It is possible to pin different threads and processes of Redis to specific
# CPUs in your system, in order to maximize the performances of the server.
# This is useful both in order to pin different Redis threads in different
# CPUs, but also in order to make sure that multiple Redis instances running
# in the same host will be pinned to different CPUs.
#
# Normally you can do this using the "taskset" command, however it is also
# possible to this via Redis configuration directly, both in Linux and FreeBSD.
#
# You can pin the server/IO threads, bio threads, aof rewrite child process, and
# the bgsave child process. The syntax to specify the cpu list is the same as
# the taskset command:
#
# Set redis server/io threads to cpu affinity 0,2,4,6:
# server_cpulist 0-7:2
#
# Set bio threads to cpu affinity 1,3:
# bio_cpulist 1,3
#
# Set aof rewrite child process to cpu affinity 8,9,10,11:
# aof_rewrite_cpulist 8-11
#
# Set bgsave child process to cpu affinity 1,10,11
# bgsave_cpulist 1,10-11

# In some cases redis will emit warnings and even refuse to start if it detects
# that the system is in bad state, it is possible to suppress these warnings
# by setting the following config which takes a space delimited list of warnings
# to suppress
#
# ignore-warnings ARM64-COW-BUG

```

## 发布订阅（基础命令）



客户端可以订阅任意数量的频道

![](/images/system/redis/2813.png)

![](/images/system/redis/3150.png)

### 命令行实现

```bash
127.0.0.1:6379[18]> subscribe chennel1
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "chennel1"
3) (integer) 1
# 在不退出的客户端的情况下启动另外一个客户端，约定俗成为生产端：
[root@192 ~]# /usr/local/bin/redis-cli 
127.0.0.1:6379> publish chennel1 hello # 当客户端不存在时候。生产端发布的消息影响到的为0
(integer) 0
127.0.0.1:6379> publish chennel1 hello
(integer) 1
127.0.0.1:6379> 






```

## 新数据类型

### bitmap

> 现代计算机用二进制位作为信息的基础单位，1个字节等于8位，例如“abc" 字符串是由3个字节组成。但实际在计算机存储时候将其二进制表示。abc对应的ascii码 分别为 97 98 99 对应的二进制分别是 01100001 01100010 01100011 

合理地适用操作位能欧有效地提高内存使用率和开发效率  节省内存空间

* redis提供了bitmaps 这个 “数据类型” ，实际上他就是字符串 但是它可以对字符串进行微操作

* bitmaps提供了一套命令，所以在redis 中适用bitmaps和适用字符串的方式不太相同。可以把bitmaps想成一个以位位单位的数组，数组的每个单位只能存储0 或者 1  数组的下标在bitmaps叫做偏移量

#### 命令

1.  setbit

   setbit \<key\> \<offset\> \<value\>

   setbit  key  16 1 # 代表第 16位为1，其他均为0 ，在第一次初始化bitmaps时候，如果偏移量很大，name整个初始化过程执行会比较慢

   ![](/images/system/redis/001.png)

   ![](/images/system/redis/002.png)

   ![](/images/system/redis/003.png)

2.   getbit

​		获取bitmap的值,指定offset下标，有则返回1，没有则返回0，不存在的下标也返回0。

​		格式如：`get <key> <offset>`

3.   bitcout

 		统计设置为1的bit数量，可以指定获取的范围。

​		bitcount \<key\> [start end]

​	需要**注意**的是：start 和 end 是按照字节来进行统计的，

 	不能认为 start 和 end 是对应的bitmap的下标

 统计字符串被设置为1 的bit数，注意不是byte数，start 和end 都可以适用负数，-1 表示最后一个位， -2 表示倒数第二个位。

start 和end 是指bit 组的字节的下标数，

即

00000000 00000000 00000000

start 和end指的是 这里有3个字节，而不是位数 

redis的setbit设置或者清除的是bit位置，而bitcount 计算的是byte的位置  

4. bitop

   bitop可以进行多种操作是一个复合操作， 它可以对多个Bitmaps做and（交集） 、 or（并集） 、 not（非） 、 xor（异或） 等操作，将结果保存在目标destkey中。

   异或: 如果a、b两个值不相同，则*异或*结果为1。如果a、b两个值相同，*异或*结果为0

`bitop <operation> <destkey> <keys...>`，其中operation有`and,or,not,xor`几种。



需要注意一点，所说Bitmaps能够节省[内存](https://so.csdn.net/so/search?q=内存&spm=1001.2101.3001.7020)，但是并不适用所有情况。

假设网站有1000万用户，但是其中的活跃用户只有10万。此时Bitmaps存储了绝大多数的僵尸用户，但是bit位的值都是0，是无效的，只有百分之一的利用率，还是浪费了绝大部分的内存。



另外还有一种情况，向前面统计的日活数，如果用户的id是这样的：1000001、1000002、1000003等，前面存在100000这样的固定值，那么需要在存储bitmaps进行截取，以免造成内存浪费。

####  比较

分别用bitmaps和set存储活跃用户可以得到的表 

| 数据类型 | 每个用户id占用空间 | 需要存储的用户量 | 全部内存           |
| -------- | ------------------ | ---------------- | ------------------ |
| set      | 64位               | 50000000         | 64位*50**=400MB    |
| bitmaps  | 1位                | 100000000        | 1位*1000***=12.5MB |
|          |                    |                  |                    |

### hyperloglog

解决基数问题。 不重复元素的个数

重复元素问题。（mysql distict ）

基数统计算法 

因为hyperloglog只会根据输入元素来计算基数，而不会存户输入元素本身，所以hyperloglog不能像集合那样，返回输入的各个元素



| 命令                                                         | 描述                                      | 语法                                                         | 返回值                                                       | 学习顺序 |
| :----------------------------------------------------------- | :---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| [Redis Pgmerge 命令](https://www.redis.net.cn/order/3631.html) | 将多个 HyperLogLog 合并为一个 HyperLogLog | redis 127.0.0.1:6379> PFMERGE destkey sourcekey [sourcekey ...] | 返回 OK。                                                    | 3        |
| [Redis Pfadd 命令](https://www.redis.net.cn/order/3629.html) | 添加指定元素到 HyperLogLog 中。           | PFADD key element [element ...]                              | 整型，如果至少有个元素被添加返回 1， 否则返回 0。            | 1        |
| [Redis Pfcount 命令](https://www.redis.net.cn/order/3630.html) | 返回给定 HyperLogLog 的基数估算值。       | PFCOUNT key [key ...]                                        | 整数，返回给定 HyperLogLog 的基数值，如果多个 HyperLogLog 则返回基数估值之和。 | 2        |

### Redis 地理位置(geo) 命令

| 命令                                                         | 描述                                                         | 示例                                                         | 语法 | 返回值                                                       | 说明 |
| :----------------------------------------------------------- | :----------------------------------------------------------- | ------------------------------------------------------------ | ---- | ------------------------------------------------------------ | ---- |
| [Redis GEOHASH 命令](https://www.redis.net.cn/order/3687.html) | 返回一个或多个位置元素的 Geohash 表示                        |                                                              |      |                                                              |      |
| [Redis GEOPOS 命令](https://www.redis.net.cn/order/3688.html) | 从key里返回所有给定位置元素的位置（经度和纬度）              |                                                              |      |                                                              |      |
| [Redis GEODIST 命令](https://www.redis.net.cn/order/3686.html) | 返回两个给定位置之间的距离<br />如果两个位置之间的其中一个不存在， 那么命令返回空值。<br/><br/>指定单位的参数 unit 必须是以下单位的其中一个：<br/><br/>m 表示单位为米。<br/>km 表示单位为千米。<br/>mi 表示单位为英里。<br/>ft 表示单位为英尺。<br/>如果用户没有显式地指定单位参数， 那么 GEODIST 默认使用米作为单位。<br/><br/>GEODIST 命令在计算距离时会假设地球为完美的球形， 在极限情况下， 这一假设最大会造成 0.5% 的误差。 | redis GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"<br/>(integer) 2<br/>redis GEODIST Sicily Palermo Catania<br/>"166274.15156960039"<br/>redis GEODIST Sicily Palermo Catania km<br/>"166.27415156960038"<br/>redis GEODIST Sicily Palermo Catania mi<br/>"103.31822459492736"<br/>redis GEODIST Sicily Foo Bar<br/>(nil)<br/>redis |      | 计算出的距离会以双精度浮点数的形式被返回。 如果给定的位置元素不存在， 那么命令返回空值。 | 2    |
| [Redis GEORADIUS 命令](https://www.redis.net.cn/order/3689.html) | 以给定的经纬度为中心， 找出某一半径内的元素<br/><br/>以给定的经纬度为中心， 返回键包含的位置元素当中， 与中心的距离不超过给定最大距离的所有位置元素。<br/><br/>范围可以使用以下其中一个单位：<br/><br/>m 表示单位为米。<br/>km 表示单位为千米。<br/>mi 表示单位为英里。<br/>ft 表示单位为英尺。<br/>在给定以下可选项时， 命令会返回额外的信息：<br/><br/>WITHDIST: 在返回位置元素的同时， 将位置元素与中心之间的距离也一并返回。 距离的单位和用户给定的范围单位保持一致。<br/>WITHCOORD: 将位置元素的经度和维度也一并返回。<br/>WITHHASH: 以 52 位有符号整数的形式， 返回位置元素经过原始 geohash 编码的有序集合分值。 这个选项主要用于底层应用或者调试， 实际中的作用并不大。<br/>命令默认返回未排序的位置元素。 通过以下两个参数， 用户可以指定被返回位置元素的排序方式：<br/><br/>ASC: 根据中心的位置， 按照从近到远的方式返回位置元素。<br/>DESC: 根据中心的位置， 按照从远到近的方式返回位置元素。<br/>在默认情况下， GEORADIUS 命令会返回所有匹配的位置元素。 虽然用户可以使用 COUNT \<count\> 选项去获取前 N 个匹配元素， 但是因为命令在内部可能会需要对所有被匹配的元素进行处理， 所以在对一个非常大的区域进行搜索时， 即使只使用 COUNT 选项去获取少量元素， 命令的执行速度也可能会非常慢。 但是从另一方面来说， 使用 COUNT 选项去减少需要返回的元素数量， 对于减少带宽来说仍然是非常有用的。 | redis GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"<br/>(integer) 2<br/>redis GEORADIUS Sicily 15 37 200 km WITHDIST<br/>1) 1) "Palermo"<br/>   2) "190.4424"<br/>2) 1) "Catania"<br/>   2) "56.4413"<br/>redis  GEORADIUS Sicily 15 37 200 km WITHCOORD<br/>1) 1) "Palermo"<br/>   2) 1) "13.361389338970184"<br/>      2) "38.115556395496299"<br/>2) 1) "Catania"<br/>   2) 1) "15.087267458438873"<br/>      2) "37.50266842333162"<br/>redis  GEORADIUS Sicily 15 37 200 km WITHDIST WITHCOORD<br/>1) 1) "Palermo"<br/>   2) "190.4424"<br/>   3) 1) "13.361389338970184"<br/>      2) "38.115556395496299"<br/>2) 1) "Catania"<br/>   2) "56.4413"<br/>   3) 1) "15.087267458438873"<br/>      2) "37.50266842333162"<br/>redis  |      | 在没有给定任何 WITH 选项的情况下， 命令只会返回一个像 [“New York”,”Milan”,”Paris”] 这样的线性（linear）列表。<br/>在指定了 WITHCOORD 、 WITHDIST 、 WITHHASH 等选项的情况下， 命令返回一个二层嵌套数组， 内层的每个子数组就表示一个元素。<br/>在返回嵌套数组时， 子数组的第一个元素总是位置元素的名字。 至于额外的信息， 则会作为子数组的后续元素， 按照以下顺序被返回：<br/><br/>以浮点数格式返回的中心与位置元素之间的距离， 单位与用户指定范围时的单位一致。<br/>geohash 整数。<br/>由两个元素组成的坐标，分别为经度和纬度。<br/>举个例子， GEORADIUS Sicily 15 37 200 km WITHCOORD WITHDIST 这样的命令返回的每个子数组都是类似以下格式的：<br/><br/>["Palermo","190.4424",["13.361389338970184","38.115556395496299"]] | 3    |
| [Redis GEOADD 命令](https://www.redis.net.cn/order/3685.html) | 将指定的地理空间位置（纬度、经度、名称）添加到指定的key中<br />将指定的地理空间位置（纬度、经度、名称）添加到指定的key中。这些数据将会存储到sorted set这样的目的是为了方便使用GEORADIUS或者GEORADIUSBYMEMBER命令对数据进行半径查询等操作。<br/><br/>该命令以采用标准格式的参数x,y,所以经度必须在纬度之前。这些坐标的限制是可以被编入索引的，区域面积可以很接近极点但是不能索引。具体的限制，由EPSG:900913 / EPSG:3785 / OSGEO:41001 规定如下：<br/><br/>有效的经度从-180度到180度。<br/>有效的纬度从-85.05112878度到85.05112878度。<br/>当坐标位置超出上述指定范围时，该命令将会返回一个错误。<br/>**不能添加南极和北极**<br/>它是如何工作的？<br/>sorted set使用一种称为Geohash的技术进行填充。经度和纬度的位是交错的，以形成一个独特的52位整数. 我们知道，一个sorted set 的double score可以代表一个52位的整数，而不会失去精度。<br/><br/>这种格式允许半径查询检查的1 + 8个领域需要覆盖整个半径，并丢弃元素以外的半径。通过计算该区域的范围，通过计算所涵盖的范围，从不太重要的部分的排序集的得分，并计算得分范围为每个区域的sorted set中的查询。<br/><br/>使用什么样的地球模型（Earth model）？<br/>这只是假设地球是一个球体，因为使用的距离公式是Haversine公式。这个公式仅适用于地球，而不是一个完美的球体。当在社交网站和其他大多数需要查询半径的应用中使用时，这些偏差都不算问题。但是，在最坏的情况下的偏差可能是0.5%，所以一些地理位置很关键的应用还是需要谨慎考虑。 | redis  GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"<br/>(integer) 2<br/>redis GEODIST Sicily Palermo Catania<br/>"166274.15156960039"<br/>redis GEORADIUS Sicily 15 37 100 km<br/>1) "Catania"<br/>redis GEORADIUS Sicily 15 37 200 km<br/>1) "Palermo"<br/>2) "Catania"<br/>redis |      |                                                              | 1    |
| [Redis GEORADIUSBYMEMBER 命令](https://www.redis.net.cn/order/3690.html) | 找出位于指定范围内的元素，中心点是由给定的位置元素决定       |                                                              |      |                                                              |      |

## Jedis

```xml
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
        </dependency>
```

```java
 public static void main(String[] args) {
        Jedis jedis=new Jedis("192.168.1.236",6379);
     # jedis有很多方法
        jedis.ping();
    }
```

Redistemplate

配置类

```java
@EnableCaching
@Configuration
@Import({com.公司名.starter.cache.config.RedisCacheConfig.class})
@EnableConfigurationProperties(CacheProperties.class)
@ConditionalOnProperty(prefix = "starter.cache", name = "enable", havingValue = "true", matchIfMissing = true)
public class StarterCacheAutoConfiguration {

}
package com.公司名.starter.cache.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@ConfigurationProperties(prefix = "starter.cache")
public class CacheProperties {

    private Boolean enable = true;

    /**
     * cache type: redis, caffeine
     */
    private String name;

    private Map<String, String> cacheNames;

    private CaffeineConfig caffeine = new CaffeineConfig();

    private RedisConfig redis = new RedisConfig();

    @Data
    @Configuration
    @ConfigurationProperties(prefix = "starter.cache.caffeine")
    @ConditionalOnProperty(prefix = "starter.cache", value = "name", havingValue = "caffeine")
    public static class CaffeineConfig {

        private Long maximumSize;

    }

    @Data
    @Configuration
    @ConfigurationProperties(prefix = "starter.cache.redis")
    @ConditionalOnProperty(prefix = "starter.cache", value = "name", havingValue = "redis")
    public static class RedisConfig {

        private boolean autoTypeSupport = false;

        private List<String> autoTypeAccept;

        private String deny;

        /**
         * serializer type: fastjson, jackson
         */
        private String serializer;

    }
}

```

```java
package com.公司名.starter.cache.config;

import com.alibaba.fastjson.parser.ParserConfig;
import com.公司名.starter.cache.serializer.FastjsonRedisSerializer;
import com.公司名.starter.cache.serializer.JacksonRedisSerializer;
import com.公司名.starter.cache.util.CacheUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.cache.RedisCacheWriter;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Configuration
@ConditionalOnBean(CacheProperties.RedisConfig.class)
public class RedisCacheConfig {

    @Autowired
    private CacheProperties cacheProperties;

    @Autowired
    private RedisConnectionFactory redisConnectionFactory;

    @Autowired
    private RedisSerializer<Object> redisSerializer;

    @Bean
    @Primary
    @ConditionalOnProperty(prefix = "starter.cache.redis", name = "serializer", havingValue = "fastjson")
    public RedisSerializer<Object> fastjsonRedisSerializer() {
        CacheProperties.RedisConfig redisConfig = cacheProperties.getRedis();
        Optional.ofNullable(redisConfig.getAutoTypeAccept()).orElse(Collections.emptyList())
            .forEach(accept -> {
                ParserConfig.getGlobalInstance().addAccept(accept);
            });

        if (redisConfig.getDeny() != null) {
            String[] denyList = redisConfig.getDeny().split(",");
            for (String denyStr : denyList) {
                ParserConfig.getGlobalInstance().addDeny(denyStr);
            }
        }
        ParserConfig.getGlobalInstance().setAutoTypeSupport(redisConfig.isAutoTypeSupport());
        return new FastjsonRedisSerializer<>(Object.class);
    }

    @Bean
    @Primary
    @ConditionalOnProperty(prefix = "starter.cache.redis", name = "serializer", havingValue = "jackson")
    public RedisSerializer<Object> jacksonRedisSerializer() {
        return new JacksonRedisSerializer<>(Object.class);
    }

    @Bean
    @Primary
    public CacheManager cacheManager() {
        Map<String, RedisCacheConfiguration> configMap = getConfigMap(cacheProperties.getCacheNames());
        return new RedisCacheManager(
                RedisCacheWriter.nonLockingRedisCacheWriter(redisConnectionFactory),
                // 默认策略 未配置key使用
                this.getConfigWithTtl(10, ChronoUnit.MINUTES),
                // 指定key策略
                configMap
        );
    }

    @Bean
    public RedisTemplate<String, ?> redisTemplate() {
        RedisTemplate<String, ?> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(redisSerializer);
        return redisTemplate;
    }

    private Map<String, RedisCacheConfiguration> getConfigMap(Map<String, String> cacheNames) {
        if (MapUtils.isEmpty(cacheNames)) {
            return Collections.emptyMap();
        }
        Map<String, RedisCacheConfiguration> redisCacheConfigurationMap = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : cacheNames.entrySet()) {
            String cacheName = entry.getKey();
            String ttl = entry.getValue();
            if (!CacheUtil.validateConfig(ttl)) {
                log.error("缓存配置{}格式错误", cacheName);
            }
            redisCacheConfigurationMap.put(cacheName, getConfigWithTtl(CacheUtil.parseTtlToSecond(ttl), ChronoUnit.SECONDS));
        }
        return redisCacheConfigurationMap;
    }

    private RedisCacheConfiguration getConfigWithTtl(long ttl, TemporalUnit unit) {
        RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig();
        return redisCacheConfiguration.serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(redisSerializer)
        ).entryTtl(Duration.of(ttl, unit));
    }
}

```



## Redis 事务

redis事务是一个单独的隔离操作：事务中得所有命令都会序列化，按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。redis的事务主要租用是串联多个米宁，防止别人的命令插队

| 命令                                                         | 描述                                                         | 语法 | 返回值         | 示例                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | ---- | -------------- | ------------------------------------------------------------ |
| [Redis Exec 命令](https://www.redis.net.cn/order/3639.html)  | 执行所有事务块内的命令。<br />事务块内所有命令的返回值，按命令执行的先后顺序排列。 当操作被打断时，返回空值 nil 。 |      |                | # 事务被成功执行<br/> <br/>redis 127.0.0.1:6379> MULTI<br/>OK<br/> <br/>redis 127.0.0.1:6379> INCR user_id<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> INCR user_id<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> INCR user_id<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> PING<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> EXEC<br/>1) (integer) 1<br/>2) (integer) 2<br/>3) (integer) 3<br/>4) PONG<br/> <br/> <br/># 监视 key ，且事务成功执行<br/> <br/>redis 127.0.0.1:6379> WATCH lock lock_times<br/>OK<br/> <br/>redis 127.0.0.1:6379> MULTI<br/>OK<br/> <br/>redis 127.0.0.1:6379> SET lock "huangz"<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> INCR lock_times<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> EXEC<br/>1) OK<br/>2) (integer) 1<br/> <br/> <br/># 监视 key ，且事务被打断<br/> <br/>redis 127.0.0.1:6379> WATCH lock lock_times<br/>OK<br/> <br/>redis 127.0.0.1:6379> MULTI<br/>OK<br/> <br/>redis 127.0.0.1:6379> SET lock "joe"        # 就在这时，另一个客户端修改了 lock_times 的值<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> INCR lock_times<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> EXEC                  # 因为 lock_times 被修改， joe 的事务执行失败<br/>(nil) |
| [Redis Watch 命令](https://www.redis.net.cn/order/3642.html) | 监视一个(或多个) key ，如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断。 |      | 总是返回 OK 。 | WATCH lock lock_times<br/>OK                                 |
| [Redis Discard 命令](https://www.redis.net.cn/order/3638.html) | 取消事务，放弃执行事务块内的所有命令。                       |      | 总是返回 OK 。 |                                                              |
| [Redis Unwatch 命令](https://www.redis.net.cn/order/3641.html) | 取消 WATCH 命令对所有 key 的监视。                           |      |                |                                                              |
| [Redis Multi 命令](https://www.redis.net.cn/order/3640.html) | 标记一个事务块的开始。                                       |      |                | redis 127.0.0.1:6379> MULTI            # 标记事务开始<br/>OK<br/> <br/>redis 127.0.0.1:6379> INCR user_id     # 多条命令按顺序入队<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> INCR user_id<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> INCR user_id<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> PING<br/>QUEUED<br/> <br/>redis 127.0.0.1:6379> EXEC             # 执行<br/>1) (integer) 1<br/>2) (integer) 2<br/>3) (integer) 3<br/>4) PONG |

从输入Muti命令开始，输入的命令会都会一次进入命令队列中，但不会执行，直到输入exec后，redis会将之前的命令队列中得命令来依次执行。组队的过程中可以通过discard来放弃组队。

![](/images/system/redis/004.png)

错误：

* 组队任何一个命令错误，例如set key value (value忘记输入了)  最终都不会执行执行阶段

* 组队成功，执行中哪个有误，则哪个会报错。其他没有错误的命令也会正常操作。

  ```java
  set c1 v1 
      incr c1
      exec 
      
  ```

### 事务和锁的机制-事务冲突（悲观锁和乐观锁）

#### 三个请求

总金额为10000，以下共有三个请求同时请求

* 一个请求想消费8000

* 一个请求想消费5000
* 一个请求想消费1000元

#### 悲观锁

先 向 10000 上锁， 其他动作都不能操作，其他都是block状态，第一次请求完就释放操作。 每次操作之前都是上锁，只有等操作完才释放。

悲观锁：每次拿数据的时候都认为别人会修改。所以每次在拿数据的时候都会上锁，这样别人想拿数据就会阻塞 直到锁释放后，它拿到锁。**行锁，表锁，读锁，写锁** 都是在操作之前先上锁。



#### 乐观锁

给数据加上version版本号

第一个请求拿到余额，和版本号（1.0.0） 第二个请求拿到余额 和版本号（1.0.0） ，第一个请求去操作时候，带上版本号例如数据库update的时候 version字段为1.0.0 ，更新完后版本则自动加1变为 1.0.1 ，当第二个请求去操作的时候，此时带上的还是1.0.0 ，但是已经没有1.0.0 则更新失败 。

简称：CAS自旋锁 ，而CAS锁只是乐观锁的一种









### 演示乐观锁和事务特性

```bash
 # 以下执行的顺序是，先在客户端1 设置test 为1  ，并且 在客户端 1 2 都watch test ,然后客户端1 执行multi 直到exec ，可以成功执行，然后客户端执行multi   直到 exec 则返回null 
 connected!
> select 0
OK
> set test 1
OK
> watch test
OK
> multi
OK
> incr test
QUEUED
> incr test
QUEUED
> exec
2
3


 192.168.1.232@6379 connected!
> select 0
OK
> watch test
OK
> multi
OK
> incr test
QUEUED
> incr test
QUEUED
> exec
null

```



#### redis 事务特性

单独的隔离操作

* 事务中的所有命令都会序列化，按顺序地执行。事务在执行地过程中，不会被其他客户端发送过来地命令请求所打断

没有隔离级别地概念

* 队列中地命令没有提交之前都不会实际执行。因为事务提交前任何指令都不会被实际执行

不保证原子性

* 事务中如果有一条命令执行失败，其后地命令依然会被执行，没有回滚





```sh
# yum install httpd-tools
ab -help
ab [options] [hosts:port/path]
ab 
-n  requests:表示当前请求次数
-c  current :表示当前并发次数
-n 1000 -c 100 有100个是并发的
-t 如果适用POST或者PUT 提交 ，Content-type:application/x-www-form-urlencoded;
-p 如果是post请求则是请求体   postifile 请求体 

```

## Redis示例

### Jedis



```java
package tech.burny.burnyredis01;

import lombok.extern.slf4j.Slf4j;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.Transaction;

import java.util.List;

/**
 * @Author: cyx
 * @Date: 2022/9/17 15:48
 * @ProjectName: IntelliJ IDEA
 * @Description:
 */
@Slf4j
public class Redis01 {
    public static  boolean  dotest(String uid,String prodId){
        //1.连接redis

        Jedis jedis=new Jedis("192.168.1.202",6379);






        //2.拼接key  库存key + 秒杀用户的key
        String kcKey="sk:"+prodId+":qt";
        String userKey="sk:"+prodId+":user";

        String kc=jedis.get(kcKey);
        //3.获取库存，如果库存为空，则秒杀活动还没开始
        if (kc ==null){
            log.info("秒杀还没开始");
            jedis.close();
            return false;
        }
        //4.开始秒杀
        //5.每个用户只能秒杀一次
        boolean sismember = jedis.sismember(userKey, uid);
        if (sismember){
            log.info("已经秒杀成功，不能重复秒杀");
            jedis.close();
return false;
        }

        // 判断如果商品数量或者库存数量小于0 ，则秒杀结束
        if (Integer.parseInt(kc)<=0){
            log.info("秒杀结束");
            jedis.close();
            return false;
        }



        jedis.decr(kcKey);
        jedis.sadd(userKey,uid);
        jedis.close();
        //库存减一
        //把秒杀成功的用户需要加到清单里面
        //yum install httpd-tools

        //第二示例：
                JedisPool instance =
                JedisPoolUtil.getInstance();
        Jedis resource = instance.getResource();

        Transaction multi = resource.multi();
        //组队操作
        //组队操作 秒杀过程
        multi.decr(kcKey);
        multi.sadd(userKey,uid);
        //剔除队伍操作
        multi.discard();
        List<Object> exec = multi.exec();

        return true;
    }
}

```



### JedisPool

```java
package tech.burny.burnyredis01;

import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

/**
 * @Author: cyx
 * @Date: 2022/9/20 22:21
 * @ProjectName: IntelliJ IDEA
 * @Description:
 */
public class JedisPoolUtil {
    
    //可解决超时报错问题
    private static  volatile JedisPool jedisPool=null;
    public static JedisPool getInstance(){
        if (null==jedisPool){
            synchronized (JedisPoolUtil.class){
                if (null==jedisPool){
                    JedisPoolConfig config=new JedisPoolConfig();
                    config.setMaxTotal(200); //最大连接数  控制一个 pool 可分配多少个 jedis 实例，通过 pool.getResource () 来获取；如果赋值为 - 1，则表示不限制；如果 pool 已经分配了 MaxTotal 个 jedis 实例，则此时 pool 的状态为 exhausted。

                    config.setMaxIdle(32);//表示当borrow一个jedis实例时，最大的等待毫秒数，如果超过等待时间，则直接抛JedisConnectionException；
                    config.setMaxWaitMillis(100*100); //超过连接数是否等待
                    config.setBlockWhenExhausted(true);
                    config.setTestOnBorrow(true); //# ping
                    jedisPool=new JedisPool(config,"192.168.1.202",6379,60*1000);
                }
            }
        }
        return  jedisPool;
    }





}

```

### 库存遗留问题（redis和java程序 整个方法没有原子性问题）LUA脚本*



* 作为嵌入式语言
* 一次性交给redis执行，减少反复连接redis的次数，提升性能
* LUA脚本类似redis的事务，有一定的原子性，不会被其他命令插队，可以完成一些redis事务的操作
* 需要2.6以上版本
* 通过lua脚本解决争抢问题，实际上是redis利用其单线程的特性，用任务队列的方式解决多任务并发的问题

```:


local userid=keys[1]; # 定义标量，要求输入
local prodid=keys[2];
local qtkey="sk:"..prodid..":qt";  # 字符串拼接
local userskey="sk:"..prodid.."usr";
local userExits=redis.call("sismember",userskey,userid);  # 调用方法
if tonumber(userExits)==1 then
     return 2;  # 约定俗称：如果为2则为失败
end
local num=redis.call("get",qtkey);
if tonumber(num)< =0 then 
  return 2;
else
 redis.call("decr",qtkey);
 redis.call("sadd",userkey,userid);
end;
return 1;




```

java调用



```java
        Jedis resource1 = instance.getResource();
        String jiaoben="....";
        String s = resource1.scriptLoad(jiaoben);
        
```

## Redis持久化操作

三种方式。

官网地址说明

![](/images/system/redis/005.png)

### RDB（Redis Database）

> 在指定的**时间间隔**内将内存中**的数据集快照**写入磁盘

全部数据的快照

#### 备份执行



![](/images/system/redis/006.png)

##### 过程

Redis会单独创建（fork）一个子进程来进行持久化，会先将数据写入到 一个临时文件中，待持久化过程都结束了，再用这个临时文件替换上次持久化好的文件。 整个过程中，主进程是不进行任何IO操作的，这就确保了极高的性能 如果需要进行大规模数据的恢复，且对于数据恢复的完整性不是非常敏感，那RDB方式要比AOF方式更加的高效。RDB的缺点是最后一次持久化后的数据可能丢失。

##### Fork

l Fork的作用是复制一个与当前进程一样的进程。新进程的所有数据（变量、环境变量、程序计数器等） 数值都和原进程一致，但是是一个全新的进程，并作为原进程的子进程

l 在Linux程序中，fork()会产生一个和父进程完全相同的子进程，但子进程在此后多会exec系统调用，出于效率考虑，Linux中引入了“**写时复制技术**”

l **一般情况父进程和子进程会共用同一段物理内存**，只有进程空间的各段的内容要发生变化时，才会将父进程的内容复制一份给子进程。



* dump.rdb文件

  在redis.conf配置中配置文件名称，默认为dump.rdb

  ```sh
  # The filename where to dump the DB 文件名
  dbfilename dump.rdb
  dir ./  #  目录
  stop-writes-on-bgsave-error yes # 硬盘已经满了，就停止备份
  rdbcompression yes ## 备份的文件是否采用压缩 LZF算法
  rdbchecksum yes # 备份的文件是否完整性检查 大概有10%的性能消耗 CRC64算法来进行数据校验
  save 
   save <seconds> <changes> [<seconds> <changes> ...]
   # 自动保存的事件
    save 3600 1 300 100 60 10000
    # RDB是整个内存的压缩过的Snapshot，RDB的数据结构，可以配置复合的快照触发条件，
   # 如果在3600 秒内 至少1个key发生变化 or
    # 如果在300 秒内 至少100个key发生变化 or
   #   如果在60 秒内 至少10000个key发生变化 or
      
  ```

  ![](/images/system/redis/007.png)

  save ：save时只管保存，其它不管，全部阻塞。手动保存。不建议。

  **bgsave**：Redis会在后台异步进行快照操作， **快照同时还可以响应客户端请求。**

  可以通过lastsave 命令获取最后一次成功执行快照的时间

* flushall

  执行flushall命令，也会产生dump.rdb文件，但里面是空的，无意义

####  **rdb文件的备份**

先通过config get dir 查询rdb文件的目录 

将*.rdb的文件拷贝到别的地方

rdb的恢复

* 关闭Redis

* 先把备份的文件拷贝到工作目录下 cp dump2.rdb dump.rdb

*  启动Redis, 备份数据会直接加载

#### 优势



![](/images/system/redis/008.png)

* 适合大规模的数据恢复

* 对数据完整性和一致性要求不高更适合使用

* 节省磁盘空间

* 恢复速度快

#### 劣势

* Fork的时候，内存中的数据被克隆了一份，大致2倍的膨胀性需要考虑

* 虽然Redis在fork时使用了**写时拷贝技术**,但是如果数据庞大时还是比较消耗性能。

* 在备份周期在一定间隔时间做一次备份，所以如果Redis意外down掉的话，就会丢失最后一次快照后的所有修改。

####  手动停止

redis-cli config set save  ""      #save后给空值，表示禁用保存策略

### AOF（Append Only File）



#### RDB + AOF



