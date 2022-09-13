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
| [Redis Getbit 命令](https://www.redis.net.cn/order/3548.html) | 对 key 所储存的字符串值，获取指定偏移量上的位(bit)。         | GETBIT KEY_NAME OFFSET                        | 字符串值指定偏移量上的位(bit)。当偏移量 OFFSET 比字符串值的长度大，或者 key 不存在时，返回 0 。 | \# 对不存在的 key 或者不存在的 offset 进行 GETBIT， 返回 0  <br /> redis> EXISTS bit (integer) 0<br />   redis> GETBIT bit 10086 (integer) 0     \# 对已存在的 offset 进行 GETBIT   redis> SETBIT bit 10086 1 (integer) 0   redis> GETBIT bit 10086 (integer) 1 |
| [Redis Setbit 命令](https://www.redis.net.cn/order/3550.html) | 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)。   | Setbit KEY_NAME OFFSET                        | 指定偏移量原来储存的位。                                     | redis> SETBIT bit 10086 1 (integer) 0   redis> GETBIT bit 10086 (integer) 1   redis> GETBIT bit 100   # bit 默认被初始化为 0 (integer) 0 |
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



| 命令                                                         | 描述                                                         | 语法                                                   | 返回值                                                       | 实例                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Redis Hmset 命令](https://www.redis.net.cn/order/3573.html) | Redis Hmset 命令用于同时将多个 field-value (字段-值)对设置到哈希表中。<br/><br/>此命令会覆盖哈希表中已存在的字段。<br/><br/>如果哈希表不存在，会创建一个空哈希表，并执行 HMSET 操作。 | HMSET KEY_NAME FIELD1 VALUE1 ...FIELDN VALUEN          | 如果命令执行成功，返回 OK 。                                 | redis 127.0.0.1:6379> HSET myhash field1 "foo" field2 "bar"<br/>OK<br/>redis 127.0.0.1:6379> HGET myhash field1<br/>"foo"<br/>redis 127.0.0.1:6379> HMGET myhash field2<br/>"bar" |
| [Redis Hmget 命令](https://www.redis.net.cn/order/3572.html) | Redis Hmget 命令用于返回哈希表中，一个或多个给定字段的值。<br/><br/>如果指定的字段不存在于哈希表，那么返回一个 nil 值。 | HMGET KEY_NAME FIELD1...FIELDN                         | 一个包含多个给定字段关联值的表，表值的排列顺序和指定字段的请求顺序一样。 | redis 127.0.0.1:6379> HSET myhash field1 "foo"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HSET myhash field2 "bar"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HMGET myhash field1 field2 nofield<br/>1) "foo"<br/>2) "bar"<br/>3) (nil) |
| [Redis Hset 命令](https://www.redis.net.cn/order/3574.html)  | Redis Hset 命令用于为哈希表中的字段赋值 。<br/><br/>如果哈希表不存在，一个新的哈希表被创建并进行 HSET 操作。<br/><br/>如果字段已经存在于哈希表中，旧值将被覆盖。 | HSET KEY_NAME FIELD VALUE                              | 如果字段是哈希表中的一个新建字段，并且值设置成功，返回 1 。 如果哈希表中域字段已经存在且旧值已被新值覆盖，返回 0 。 | redis 127.0.0.1:6379> HSET myhash field1 "foo" OK redis 127.0.0.1:6379> HGET myhash field1 "foo"   redis 127.0.0.1:6379> HSET website google "www.g.cn"       # 设置一个新域 (integer) 1   redis 127.0.0.1:6379>HSET website google "www.google.com" # 覆盖一个旧域 (integer) 0 |
| [Redis Hgetall 命令](https://www.redis.net.cn/order/3567.html) | Redis Hgetall 命令用于返回哈希表中，所有的字段和值。<br/><br/>在返回值里，紧跟每个字段名(field name)之后是字段的值(value)，所以返回值的长度是哈希表大小的两倍。 | HGETALL KEY_NAME                                       | 以列表形式返回哈希表的字段及字段值。 若 key 不存在，返回空列表。 | redis 127.0.0.1:6379> HSET myhash field1 "foo"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HSET myhash field2 "bar"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HGETALL myhash<br/>1) "field1"<br/>2) "Hello"<br/>3) "field2"<br/>4) "World" |
| [Redis Hget 命令](https://www.redis.net.cn/order/3566.html)  | 获取存储在哈希表中指定字段的值/td>                           | HGET KEY_NAME FIELD_NAME                               | 返回给定字段的值。如果给定的字段或 key 不存在时，返回 nil 。 | # 字段存在<br/> <br/>redis> HSET site redis redis.com<br/>(integer) 1<br/> <br/>redis> HGET site redis<br/>"redis.com"<br/> <br/> <br/># 字段不存在<br/> <br/>redis> HGET site mysql<br/>(nil) |
| [Redis Hexists 命令](https://www.redis.net.cn/order/3565.html) | 查看哈希表 key 中，指定的字段是否存在。                      | HEXISTS KEY_NAME FIELD_NAME                            | 如果哈希表含有给定字段，返回 1 。 如果哈希表不含有给定字段，或 key 不存在，返回 0 。 |                                                              |
| [Redis Hincrby 命令](https://www.redis.net.cn/order/3568.html) | 为哈希表 key 中的指定字段的整数值加上增量 increment 。       | HINCRBY KEY_NAME FIELD_NAME INCR_BY_NUMBER             | Redis Hincrby 命令用于为哈希表中的字段值加上指定增量值。<br/><br/>增量也可以为负数，相当于对指定字段进行减法操作。<br/><br/>如果哈希表的 key 不存在，一个新的哈希表被创建并执行 HINCRBY 命令。<br/><br/>如果指定的字段不存在，那么在执行命令前，字段的值被初始化为 0 。<br/><br/>对一个储存字符串值的字段执行 HINCRBY 命令将造成一个错误。<br/><br/>本操作的值被限制在 64 位(bit)有符号数字表示之内。 |                                                              |
| [Redis Hlen 命令](https://www.redis.net.cn/order/3571.html)  | 获取哈希表中字段的数量                                       | HLEN KEY_NAME                                          | 哈希表中字段的数量。 当 key 不存在时，返回 0 。              |                                                              |
| [Redis Hdel 命令](https://www.redis.net.cn/order/3564.html)  | 删除一个或多个哈希表字段                                     | HDEL KEY_NAME FIELD1.. FIELDN                          | 被成功删除字段的数量，不包括被忽略的字段。                   |                                                              |
| [Redis Hvals 命令](https://www.redis.net.cn/order/3576.html) | 获取哈希表中所有值                                           | HVALS KEY_NAME （此处官网有误）                        | 一个包含哈希表中所有值的表。 当 key 不存在时，返回一个空表。 | redis 127.0.0.1:6379> HSET myhash field1 "foo"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HSET myhash field2 "bar"<br/>(integer) 1<br/>redis 127.0.0.1:6379> HVALS myhash<br/>1) "foo"<br/>2) "bar"<br/> <br/># 空哈希表/不存在的key<br/> <br/>redis 127.0.0.1:6379> EXISTS not_exists<br/>(integer) 0<br/> <br/>redis 127.0.0.1:6379> HVALS not_exists<br/>(empty list or set) |
| [Redis Hincrbyfloat 命令](https://www.redis.net.cn/order/3569.html) | Redis Hincrbyfloat 命令用于为哈希表中的字段值加上指定浮点数增量值。<br/><br/>如果指定的字段不存在，那么在执行命令前，字段的值被初始化为 0 。 | HINCRBYFLOAT KEY_NAME FIELD_NAME INCR_BY_NUMBER <br /> | 执行 Hincrbyfloat 命令之后，哈希表中字段的值。               |                                                              |
| [Redis Hkeys 命令](https://www.redis.net.cn/order/3570.html) | 获取所有哈希表中的字段                                       | HKEYS KEY_NAME （此处官网有误）                        | 包含哈希表中所有字段的列表。 当 key 不存在时，返回一个空列表。 |                                                              |
| [Redis Hsetnx 命令](https://www.redis.net.cn/order/3575.html) | Redis Hsetnx 命令用于为哈希表中不存在的的字段赋值 。<br/><br/>如果哈希表不存在，一个新的哈希表被创建并进行 HSET 操作。<br/><br/>如果字段已经存在于哈希表中，操作无效。<br/><br/>如果 key 不存在，一个新哈希表被创建并执行 HSETNX 命令。 | HSETNX KEY_NAME FIELD VALUE                            | 设置成功，返回 1 。 如果给定字段已经存在且没有操作被执行，返回 0 。 |                                                              |

### 有序集合（Hzet）

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
| [Redis Zrangebylex 命令](https://www.redis.net.cn/order/3616.html) | 通过字典区间返回有序集合的成员                               | ZRANGEBYLEX key min max [LIMIT offset count]                 | 指定区间内的元素列表。                                       | redis 127.0.0.1:6379> ZADD myzset 0 a 0 b 0 c 0 d 0 e 0 f 0 g<br/>(integer) 7<br/>redis 127.0.0.1:6379> ZRANGEBYLEX myzset - [c<br/>1) "a"<br/>2) "b"<br/>3) "c"<br/>redis 127.0.0.1:6379> ZRANGEBYLEX myzset - (c<br/>1) "a"<br/>2) "b"<br/>redis 127.0.0.1:6379> ZRANGEBYLEX myzset [aaa (g<br/>1) "b"<br/>2) "c"<br/>3) "d"<br/>4) "e"<br/>5) "f"<br/>redis> |
| [Redis Zscore 命令](https://www.redis.net.cn/order/3626.html) | redis Zscore 命令返回有序集中，成员的分数值。 如果成员元素不是有序集 key 的成员，或 key 不存在，返回 nil 。 | ZSCORE key member                                            | 成员的分数值，以字符串形式表示。                             | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES    # 测试数据<br/>1) "tom"<br/>2) "2000"<br/>3) "peter"<br/>4) "3500"<br/>5) "jack"<br/>6) "5000"<br/> <br/>redis 127.0.0.1:6379> ZSCORE salary peter              # 注意返回值是字符串<br/>"3500" |
| [Redis Zremrangebyscore 命令](https://www.redis.net.cn/order/3622.html) | 移除有序集合中给定的分数区间的所有成员                       | ZREMRANGEBYSCORE key min max                                 | 被移除成员的数量。                                           | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES          # 显示有序集内所有成员及其 score 值<br/>1) "tom"<br/>2) "2000"<br/>3) "peter"<br/>4) "3500"<br/>5) "jack"<br/>6) "5000"<br/> <br/>redis 127.0.0.1:6379> ZREMRANGEBYSCORE salary 1500 3500      # 移除所有薪水在 1500 到 3500 内的员工<br/>(integer) 2<br/> <br/>redis> ZRANGE salary 0 -1 WITHSCORES          # 剩下的有序集成员<br/>1) "jack"<br/>2) "5000" |
| [Redis Zscan 命令](https://www.redis.net.cn/order/3628.html) | 迭代有序集合中的元素（包括元素成员和元素分值）               | redis 127.0.0.1:6379> redis 127.0.0.1:6379> ZSCAN key cursor [MATCH pattern] [COUNT count] | 返回的每个元素都是一个有序集合元素，一个有序集合元素由一个成员（member）和一个分值（score）组成。 |                                                              |
| [Redis Zrevrangebyscore 命令](https://www.redis.net.cn/order/3624.html)(不是很懂，需加查看) | Redis Zrevrangebyscore 返回有序集中指定分数区间内的所有的成员。有序集成员按分数值递减(从大到小)的次序排列。<br/><br/>具有相同分数值的成员按字典序的逆序(reverse lexicographical order )排列。<br/><br/>除了成员按分数值递减的次序排列这一点外， ZREVRANGEBYSCORE 命令的其他方面和 ZRANGEBYSCORE 命令一样。 | ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count] | 指定区间内，带有分数值(可选)的有序集成员的列表。             | redis 127.0.0.1:6379> ZADD salary 10086 jack<br/>(integer) 1<br/>redis > ZADD salary 5000 tom<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD salary 7500 peter<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD salary 3500 joe<br/>(integer) 1<br/> <br/>redis 127.0.0.1:6379> ZREVRANGEBYSCORE salary +inf -inf   # 逆序排列所有成员<br/>1) "jack"<br/>2) "peter"<br/>3) "tom"<br/>4) "joe"<br/> <br/>redis 127.0.0.1:6379> ZREVRANGEBYSCORE salary 10000 2000  # 逆序排列薪水介于 10000 和 2000 之间的成员<br/>1) "peter"<br/>2) "tom"<br/>3) "joe" |
| [Redis Zremrangebylex 命令](https://www.redis.net.cn/order/3620.html) | 移除有序集合中给定的字典区间的所有成员                       | ZREMRANGEBYLEX key min max                                   | 被成功移除的成员的数量，不包括被忽略的成员。                 | redis 127.0.0.1:6379> ZADD myzset 0 aaaa 0 b 0 c 0 d 0 e<br/>(integer) 5<br/>redis 127.0.0.1:6379> ZADD myzset 0 foo 0 zap 0 zip 0 ALPHA 0 alpha<br/>(integer) 5<br/>redis 127.0.0.1:6379> ZRANGE myzset 0 -1<br/>1) "ALPHA"<br/> 2) "aaaa"<br/> 3) "alpha"<br/> 4) "b"<br/> 5) "c"<br/> 6) "d"<br/> 7) "e"<br/> 8) "foo"<br/> 9) "zap"<br/>10) "zip"<br/>redis 127.0.0.1:6379> ZREMRANGEBYLEX myzset [alpha [omega<br/>(integer) 6<br/>redis 127.0.0.1:6379> ZRANGE myzset 0 -1<br/>1) "ALPHA"<br/>2) "aaaa"<br/>3) "zap"<br/>4) "zip"<br/>redis> |
| [Redis Zrevrange 命令](https://www.redis.net.cn/order/3623.html) | redis Zrevrange 命令返回有序集中，指定区间内的成员。<br/><br/>其中成员的位置按分数值递减(从大到小)来排列。<br/><br/>具有相同分数值的成员按字典序的逆序(reverse lexicographical order)排列。<br/><br/>除了成员按分数值递减的次序排列这一点外， ZREVRANGE 命令的其他方面和 ZRANGE 命令一样。 | redis 127.0.0.1:6379> ZREVRANGE key start stop [WITHSCORES]  | 指定区间内，带有分数值(可选)的有序集成员的列表。             | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES        # 递增排列<br/>1) "peter"<br/>2) "3500"<br/>3) "tom"<br/>4) "4000"<br/>5) "jack"<br/>6) "5000"<br/> <br/>redis 127.0.0.1:6379> ZREVRANGE salary 0 -1 WITHSCORES     # 递减排列<br/>1) "jack"<br/>2) "5000"<br/>3) "tom"<br/>4) "4000"<br/>5) "peter"<br/>6) "3500" |
| [Redis Zrange 命令](https://www.redis.net.cn/order/3615.html) | Redis Zrange 返回有序集中，指定区间内的成员。<br/><br/>其中成员的位置按分数值递增(从小到大)来排序。<br/><br/>具有相同分数值的成员按字典序(lexicographical order )来排列。<br/><br/>如果你需要成员按<br/><br/>值递减(从大到小)来排列，请使用 ZREVRANGE 命令。<br/><br/>下标参数 start 和 stop 都以 0 为底，也就是说，以 0 表示有序集第一个成员，以 1 表示有序集第二个成员，以此类推。<br/><br/>你也可以使用负数下标，以 -1 表示最后一个成员， -2 表示倒数第二个成员，以此类推。 | ZRANGE key start stop [WITHSCORES]                           | 指定区间内，带有分数值(可选)的有序集成员的列表。             | redis 127.0.0.1:6379> ZRANGE salary 0 -1 WITHSCORES             # 显示整个有序集成员<br/>1) "jack"<br/>2) "3500"<br/>3) "tom"<br/>4) "5000"<br/>5) "boss"<br/>6) "10086"<br/> <br/>redis 127.0.0.1:6379> ZRANGE salary 1 2 WITHSCORES              # 显示有序集下标区间 1 至 2 的成员<br/>1) "tom"<br/>2) "5000"<br/>3) "boss"<br/>4) "10086"<br/> <br/>redis 127.0.0.1:6379> ZRANGE salary 0 200000 WITHSCORES         # 测试 end 下标超出最大下标时的情况<br/>1) "jack"<br/>2) "3500"<br/>3) "tom"<br/>4) "5000"<br/>5) "boss"<br/>6) "10086"<br/> <br/>redis > ZRANGE salary 200000 3000000 WITHSCORES                  # 测试当给定区间不存在于有序集时的情况<br/>(empty list or set) |
| [Redis Zcount 命令](https://www.redis.net.cn/order/3611.html) | 计算在有序集合中指定区间分数的成员数                         | ZCOUNT key min max                                           | 分数值在 min 和 max 之间的成员的数量。                       | redis 127.0.0.1:6379> ZADD myzset 1 "hello"<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD myzset 1 "foo"<br/>(integer) 1<br/>redis 127.0.0.1:6379> ZADD myzset 2 "world" 3 "bar"<br/>(integer) 2<br/>redis 127.0.0.1:6379> ZCOUNT myzset 1 3<br/>(integer) 4 |
| [Redis Zadd 命令](https://www.redis.net.cn/order/3609.html)  | Redis Zadd 命令用于将一个或多个成员元素及其分数值加入到有序集当中。<br/><br/>如果某个成员已经是有序集的成员，那么更新这个成员的分数值，并通过重新插入这个成员元素，来保证该成员在正确的位置上。<br/><br/>分数值可以是整数值或双精度浮点数。<br/><br/>如果有序集合 key 不存在，则创建一个空的有序集并执行 ZADD 操作。<br/><br/>当 key 存在但不是有序集类型时，返回一个错误。 | ZADD KEY_NAME SCORE1 VALUE1.. SCOREN VALUEN<br/>可用版本     | 被成功添加的新成员的数量，不包括那些被更新的、已经存在的成员 |                                                              |

